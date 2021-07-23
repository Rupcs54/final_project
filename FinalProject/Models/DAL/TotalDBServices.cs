using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Configuration;

namespace FinalProject.Models.DAL
{
    public class TotalDBServices
    {

        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
        //---------------------------------------------------------------------------------
        // Create the SqlCommand
        //---------------------------------------------------------------------------------
        private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }
        //--------------------------------------------------------------------------------------------------
        // This method insert 
        //--------------------------------------------------------------------------------------------------
        public int Insert(Total obj)
        {
            SqlConnection con;
            SqlCommand cmd;
            int numEffected;
            int columnValue = 0;

            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                throw (ex);// write to log
            }

            //insert:
            String cStr = BuildInsertCommand(obj);
            cmd = CreateCommand(cStr, con);

            
            try
            {
                numEffected = cmd.ExecuteNonQuery(); // execute the (insert) command
                //update command: (countPreferSeries)
                String selectSTRseries = "Select count(distinct userId) as 'countPreferSeries' from Preferences_2021 where seriesId=" + obj.Series.Id;
                cmd = CreateCommand(selectSTRseries, con);

                // get a reader
                SqlDataReader dr1 = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr1.Read())
                {   // Read till the end of the data into a row
                    string column = dr1["countPreferSeries"].ToString();
                    columnValue = Convert.ToInt32(dr1["countPreferSeries"]);
                }
                UpdatePreferencesSeriesCount(columnValue, obj.Series.Id);

                ///////////////////////////////////////////////////////////////////////////
                con = connect("DBConnectionString"); // create the connection
                //update command: (countPreferEpisodes)
                String selectSTRepisode = "Select count(distinct userId) as 'countPreferEpisodes' from Preferences_2021 where seriesId=" + obj.Episode.SeriesId +" and episodeId=" +obj.Episode.EpisodeId;
                cmd = CreateCommand(selectSTRepisode, con);

                // get a reader
                SqlDataReader dr2 = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr2.Read())
                {   // Read till the end of the data into a row
                    string column = dr2["countPreferEpisodes"].ToString();
                    columnValue = Convert.ToInt32(dr2["countPreferEpisodes"]);
                }
                UpdatePreferencesEpisodesCount(columnValue, obj.Episode.SeriesId, obj.Episode.EpisodeId);

                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (!(ex.Number == 2627))
                    throw (ex);
                return -1;
            }
            finally
            {
                if (con != null)
                    con.Close();                    // close the db connection

            }
        }

        //--------------------------------------------------------------------
        // Build the Insert command String
        //--------------------------------------------------------------------
        private String BuildInsertCommand(Total prefer)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values({0}, {1} , {2})", prefer.UserId, prefer.Episode.EpisodeId, prefer.Episode.SeriesId);
            String prefix = "INSERT INTO Preferences_2021 ([userId], [episodeId], [seriesId])";
            command = prefix + sb.ToString();
            return command;
        }


        //---------------------------------------------------------------------------------
        // Read from the DB into a list all the series names that the user prefered- dataReader
        //---------------------------------------------------------------------------------

/*  * Show the user in view page series loved their episodes
    * input - userId and email
    * Output - a sorted list of the series he liked */
        public List<Series> GetSeries(int userId, string email)
        {
            SqlConnection con = null;
            List<Series> seriesNames = new List<Series>();

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "Select distinct S.name ,S.id From Preferences_2021 as P inner join User_2021 as U on U.id=P.userId ";
                selectSTR += "inner join Series_2021 as S on P.seriesId= S.id WHERE U.id = " + userId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                

                
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
               
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Series s = new Series();
                    s.Id = Convert.ToInt32(dr["id"]);
                    s.Name= (string)dr["name"];
                    seriesNames.Add(s);
                }

                return seriesNames;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        /*  * Recommended series for the user according to our algorithm according to our calculation
            * The algorithm selects "similar users" and recommends the user to see the most common series they liked.
            * Similar users = users in the same age range (5 years up and down) and members with the same gender. 
            * input - userId
            * Output - a sorted list of the most viewed series on the site */
        public List<Series> RecommendForTheUser(int userId)
        {
            SqlConnection con = null;
            List<Series> similarsSeriesForYou = new List<Series>();

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT distinct S.*";
                selectSTR += "FROM User_2021 as U right join Preferences_2021 as P on U.id = P.userId inner join Series_2021 as S on P.seriesId = S.id ";
                selectSTR += "WHERE U.id IN( ";
                selectSTR += "SELECT U1.id FROM( ";
                selectSTR += "SELECT U2.id as tmpId,U2.gender as tmpGender,U2.yearOfBirth as tmpYOB ";
                selectSTR += "FROM User_2021 as U2 WHERE U2.id =" + userId;
                selectSTR += ")TmpUser left join User_2021 as U1 on TmpUser.tmpGender= U1.gender and ";
                selectSTR += "U1.yearOfBirth Between TmpUser.tmpYOB - 5 and TmpUser.tmpYOB + 5 ";
                selectSTR += "and TmpUser.tmpId <> U1.id) ";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Series s = new Series();
                    s.Id = Convert.ToInt32(dr["id"]);
                    s.First_air_date = (string)dr["first_air_date"];
                    s.Name = (string)dr["name"];
                    s.Origin_country = (string)dr["origin_country"];
                    s.Original_language = (string)dr["original_language"];
                    s.Overview = (string)dr["overview"];
                    s.Popularity = Convert.ToInt32(dr["popularity"]);
                    s.Poster_path = (string)(dr["poster_path"]);
                    similarsSeriesForYou.Add(s);
                }

                return similarsSeriesForYou;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public void UpdatePreferencesSeriesCount(int preferencesCount, int id)
        {
            SqlConnection con;
            SqlCommand cmd;
            {
                try
                {
                    con = connect("DBConnectionString"); // create the connection
                }
                catch (Exception ex)
                {
                    // write to log
                    throw (ex);
                }
                String cStr = BuildUpdateSeriesCommand(preferencesCount, id);      // helper method to build the insert string

                cmd = CreateCommand(cStr, con);             // create the command

                try
                {
                    int rowEffected = cmd.ExecuteNonQuery(); // execute the command
                    //return rowEffected;
                }
                catch (Exception ex)
                {
                    // write to log
                    throw (ex);
                }

                finally
                {
                    if (con != null)
                    {
                        // close the db connection
                        con.Close();
                    }
                }
            }
        }

        public void UpdatePreferencesEpisodesCount(int preferencesCount, int seriesId, int episodeId)
        {
            SqlConnection con;
            SqlCommand cmd;
            {
                try
                {
                    con = connect("DBConnectionString"); // create the connection
                }
                catch (Exception ex)
                {
                    // write to log
                    throw (ex);
                }
                String cStr = BuildUpdateEpisodeCommand(preferencesCount, seriesId, episodeId);      // helper method to build the insert string

                cmd = CreateCommand(cStr, con);             // create the command

                try
                {
                    int rowEffected = cmd.ExecuteNonQuery(); // execute the command
                    //return rowEffected;
                }
                catch (Exception ex)
                {
                    // write to log
                    throw (ex);
                }

                finally
                {
                    if (con != null)
                    {
                        // close the db connection
                        con.Close();
                    }
                }
            }
        }
        //--------------------------------------------------------------------
        // Build the Update command String
        //--------------------------------------------------------------------
        private String BuildUpdateSeriesCommand(int preferencesCount, int id)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat(" SET [preferencesCount]= {0}", preferencesCount);
            String prefix = "UPDATE Series_2021";
            String end = "WHERE id= " + id;
            command = prefix + sb.ToString() + end;
            return command;
        }

        private String BuildUpdateEpisodeCommand(int preferencesCount, int seriesId, int episodeId)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat(" SET [preferencesCount]= {0}", preferencesCount);
            String prefix = "UPDATE Episode_2021";
            String end = "WHERE seriesId= " + seriesId + " and episodeId = " + episodeId;
            command = prefix + sb.ToString() + end;
            return command;
        }

        //DeletePreferences
        public int DeletePreferences(int episodeId, int seriesId, int userId)
        {
            //int numEffected;
            int columnValue = 0;
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildDeletePreferencesCommand(episodeId, seriesId, userId);      // helper method to build the insert string

            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the (insert) command
                //update command: (countPreferSeries)
                String selectSTRseries = "Select count(distinct userId) as 'countPreferSeries' from Preferences_2021 where seriesId=" + seriesId;
                cmd = CreateCommand(selectSTRseries, con);

                // get a reader
                SqlDataReader dr1 = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr1.Read())
                {   // Read till the end of the data into a row
                    string column = dr1["countPreferSeries"].ToString();
                    columnValue = Convert.ToInt32(dr1["countPreferSeries"]);
                }
                UpdatePreferencesSeriesCount(columnValue, seriesId);

                ///////////////////////////////////////////////////////////////////////////
                con = connect("DBConnectionString"); // create the connection
                //update command: (countPreferEpisodes)
                String selectSTRepisode = "Select count(distinct userId) as 'countPreferEpisodes' from Preferences_2021 where seriesId=" + seriesId + " and episodeId=" + episodeId;
                cmd = CreateCommand(selectSTRepisode, con);

                // get a reader
                SqlDataReader dr2 = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr2.Read())
                {   // Read till the end of the data into a row
                    string column = dr2["countPreferEpisodes"].ToString();
                    columnValue = Convert.ToInt32(dr2["countPreferEpisodes"]);
                }
                UpdatePreferencesEpisodesCount(columnValue, seriesId, episodeId);

                return numEffected;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();

                }
            }

        }

        //--------------------------------------------------------------------
        // Build the DELETE command String///
        //--------------------------------------------------------------------
        private String BuildDeletePreferencesCommand(int episodeId, int seriesId, int userId)
        {
            String command;
            command = "DELETE from Preferences_2021 where userId =" + userId + " and episodeId = " + episodeId + " and seriesId = " + seriesId;
            return command;
        }
    }
}