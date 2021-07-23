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
    public class EpisodeDataServices
    {
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
        // This method inserts an Episode to the episodes table 
        //--------------------------------------------------------------------------------------------------
        public int Insert(Episode episode)
        {
            SqlConnection con;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String episodeQuery = "INSERT INTO Episode_2021 (episodeId,seriesId, seriesName, seasonNum,episodeName,imageURL,overview,airDate) VALUES (@episodeId,@seriesId,@seriesName,@seasonNum,@episodeName,@imageURL,@overview,@airDate)";

            using (SqlCommand command = new SqlCommand(episodeQuery, con))
            {
                command.Parameters.AddWithValue("@episodeId", episode.EpisodeId);
                command.Parameters.AddWithValue("@seriesId", episode.SeriesId);
                command.Parameters.AddWithValue("@seriesName", episode.SeriesName);
                command.Parameters.AddWithValue("@seasonNum", episode.SeasonNum);
                command.Parameters.AddWithValue("@episodeName", episode.EpisodeName);
                command.Parameters.AddWithValue("@imageURL", episode.ImageURL);
                command.Parameters.AddWithValue("@overview", episode.Overview);
                command.Parameters.AddWithValue("@airDate", episode.AirDate);

                try
                {
                    int numEffected = command.ExecuteNonQuery();
                    return numEffected;
                }
                catch (SqlException exe)
                {
                    if (!(exe.Number == 2627))
                        throw (exe);
                    return -1;
                }
                finally
                {
                    if (con != null)
                    {
                        con.Close();// close the db connection
                    }
                }
            }
        }
      
        //---------------------------------------------------------------------------------
        // Read from the DB into a list - dataReader
        // Get the episodes from Preferences Tbl that the user added according to series name and user Id 
        //---------------------------------------------------------------------------------
        public List<Episode> GetEpisodes(string seriesName, int userId)
        {
            SqlConnection con = null;
            List<Episode> episodeList = new List<Episode>();
            string seriesNameTmp= seriesName.Replace("'", "''");

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT E.* From Preferences_2021 as P inner join Episode_2021 as E on E.episodeId=P.episodeId ";
                selectSTR += "Where E.seriesName= '" + seriesNameTmp + "' and P.userId= " + userId + " order by E.preferencesCount DESC";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Episode e = new Episode();
                    e.EpisodeId = Convert.ToInt32(dr["episodeId"]);
                    e.SeriesId= Convert.ToInt32(dr["seriesId"]);
                    e.SeriesName = (string)dr["seriesName"];
                    e.SeasonNum= Convert.ToInt32(dr["seasonNum"]);
                    e.EpisodeName = (string)dr["episodeName"];
                    e.ImageURL= (string)dr["imageURL"];
                    e.Overview = (string)dr["overview"];
                    e.AirDate = (string)dr["airDate"];
                    episodeList.Add(e);
                }
                return episodeList;
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

        /* The most viewed episode on our site for display on the Home page
         * Returns - a sorted list of the most episode series on the site  */
        public List<Episode> GetEpisode()
        {
            SqlConnection con = null;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
                List<Episode> episodeList = new List<Episode>();
                String selectSTR = "SELECT * FROM Episode_2021 ORDER BY preferencesCount DESC";
                cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {
                    Episode u = new Episode();
                    u.EpisodeId = Convert.ToInt32(dr["episodeId"]);
                    u.SeriesId = Convert.ToInt32(dr["seriesId"]);
                    u.SeriesName = (string)dr["SeriesName"];
                    u.SeasonNum = Convert.ToInt32(dr["seasonNum"]);
                    u.EpisodeName = (string)dr["episodeName"];
                    u.ImageURL = (string)dr["imageURL"];
                    u.Overview = (string)(dr["overview"]);
                    u.AirDate = (string)(dr["airDate"]);
                    u.PreferencesCount = dr["preferencesCount"] == DBNull.Value ? 1 : Convert.ToInt32(dr["preferencesCount"]);
                    episodeList.Add(u);
                }
                return episodeList;
            }

            catch (Exception ex)
            {
                throw (ex); // write to log
            }

            finally
            {
                if (con != null)
                {
                    con.Close();// close the db connection
                }
            }
        }
    }
}