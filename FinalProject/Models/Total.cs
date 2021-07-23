using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FinalProject.Models.DAL;
using FinalProject.Models;

namespace FinalProject.Models
{
    public class Total
    {
        Series series;
        Episode episode;
        int userId;
        string email;

        public Total(Series series, Episode episode, int userId, string email)
        {
            this.Series = series;
            this.Episode = episode;
            this.UserId = userId;
            this.Email = email;
        }

        public Total()
        {
        }

        public Series Series { get => series; set => series = value; }
        public Episode Episode { get => episode; set => episode = value; }
        public int UserId { get => userId; set => userId = value; }
        public string Email { get => email; set => email = value; }

        public int Insert()
        {
            TotalDBServices ds = new TotalDBServices();
            Series.Insert();
            Episode.Insert();
            return ds.Insert(this);
        }
        /*  * Show the user in view page series loved their episodes
           * input - userId and email
           * Output - a sorted list of the series he liked */
        public List<Series> GetSeries(int userId, string email)
        {
            TotalDBServices tDB = new TotalDBServices();
            return tDB.GetSeries(userId, email);
        }

        //DeletePreferences///.......
        public void DeletePreferences(int episodeId, int seriesId, int userId)
        {
            TotalDBServices tDB = new TotalDBServices();
            tDB.DeletePreferences(episodeId,seriesId, userId);
        }

        /*  * Recommended series for the user according to our algorithm according to our calculation
            * The algorithm selects "similar users" and recommends the user to see the most common series they liked.
            * Similar users = users in the same age range (5 years up and down) and members with the same gender. 
            * input - userId
            * Output - a sorted list of the most viewed series on the site */
        public List<Series> RecommendForTheUser(int userId)
        {
            TotalDBServices tDB = new TotalDBServices();
            return tDB.RecommendForTheUser(userId);
        }

    }
}