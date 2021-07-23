using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Configuration;
using System.Web.Http;
using FinalProject.Models.DAL;


namespace FinalProject.Models.DAL
{
    public class UserLikeCommDBServices
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

        //--------------------------------------------------------------------
        // Build the Insert command String
        //--------------------------------------------------------------------
        private String BuildInsertCommand(UserLikesComment ulc, string mode)
        {
            String command;
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            if (mode.Equals("dislike"))
            {
                ulc.Dislike = true;
                ulc.Like = false;
            }
            else
            {
                ulc.Like = true;
                ulc.Dislike = false;
            }
            sb.AppendFormat("Values({0}, {1}, {2},'{3}', '{4}')", ulc.CommentId, ulc.UserId, ulc.SeriesId, ulc.Like, ulc.Dislike);
            String prefix = "INSERT INTO UserLikeComments_2021 " + "([commentId], [userId],[seriesId], [like], [dislike]) ";
            command = prefix + sb.ToString();
            return command;
        }

        //--------------------------------------------------------------------------------------------------------
        // Update user like or dislike the comment 
        // Get all the relevant information- commentId, userId, seriesId and whether he like/ dislike this comment
        //--------------------------------------------------------------------------------------------------------
        public int Update(UserLikesComment ulc)
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
                    throw (ex);
                }

                String cStr = "";
                string mode = "dislike";
                if (ulc.Dislike) //use this way to relise what to update, value in Like
                {
                    mode = "like";
                    cStr = BuildUpdateLikesCommand(ulc);      // helper method to build the insert string
                }
                else
                {
                    cStr = BuildUpdateDislikesCommand(ulc);
                }

                cmd = CreateCommand(cStr, con);             // create the command

                try
                {
                    int rowEffected = cmd.ExecuteNonQuery(); // execute the command
                    if (rowEffected == 0)   // If didnt find any row to change so the row is not exists
                    {
                        cStr = BuildInsertCommand(ulc, mode);
                        cmd = CreateCommand(cStr, con);
                        rowEffected = cmd.ExecuteNonQuery();
                    }
                    return rowEffected;
                }
                catch (SqlException ex)
                {
                    if (!(ex.Number == 2627))  //if the row doesnt exists so what is your problem? (throw it)
                        throw (ex);//so throw what was the problem
                    
                    return -1; //the row exists allready
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
        // Build the Update Likes command String
        //--------------------------------------------------------------------
        private String BuildUpdateLikesCommand(UserLikesComment ulc)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat(" SET [CommentId]={0}, [UserId]={1}, [SeriesId]={2}, [Like]='{3}', [Dislike]=[Dislike]", ulc.CommentId, ulc.UserId, ulc.SeriesId, ulc.Like);
            String prefix = "UPDATE userLikeComments_2021" + " ";
            String end = " WHERE CommentId= " + ulc.CommentId + " and UserId =" + ulc.UserId + " and SeriesId= " + ulc.SeriesId;
            command = prefix + sb.ToString() + end;
            return command;
        }

        //--------------------------------------------------------------------
        // Build the Update Dislikes command String
        //--------------------------------------------------------------------
        private String BuildUpdateDislikesCommand(UserLikesComment ulc)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat(" SET [CommentId]={0}, [UserId]={1}, [SeriesId]={2}, [Like]=[Like], [Dislike]='{3}'", ulc.CommentId, ulc.UserId, ulc.SeriesId, ulc.Like);
            String prefix = "UPDATE userLikeComments_2021" + " ";
            String end = " WHERE CommentId= " + ulc.CommentId + " and UserId =" + ulc.UserId + " and SeriesId= " + ulc.SeriesId;
            command = prefix + sb.ToString() + end;
            return command;
        }
    }
}