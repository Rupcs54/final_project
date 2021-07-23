using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FinalProject.Models.DAL;

namespace FinalProject.Models
{
    public class Series
    {
        int id;
        string first_air_date;
        string name;
        string origin_country;
        string original_language;
        string overview;
        float popularity;
        string poster_path;
        int preferencesCount;

        public Series(int id, string first_air_date, string name, string origin_country, string original_language, string overview, float popularity, string poster_path, int preferencesCount)
        {
            this.id = id;
            this.first_air_date = first_air_date;
            this.name = name;
            this.origin_country = origin_country;
            this.original_language = original_language;
            this.overview = overview;
            this.popularity = popularity;
            this.poster_path = poster_path;
            this.PreferencesCount = preferencesCount + 1;
            
        }
        public Series()
        { 

        }

        public int Id { get => id; set => id = value; }
        public string First_air_date { get => first_air_date; set => first_air_date = value; }
        public string Name { get => name; set => name = value; }
        public string Origin_country { get => origin_country; set => origin_country = value; }
        public string Original_language { get => original_language; set => original_language = value; }
        public string Overview { get => overview; set => overview = value; }
        public float Popularity { get => popularity; set => popularity = value; }
        public string Poster_path { get => poster_path; set => poster_path = value; }
        public int PreferencesCount { get => preferencesCount; set => preferencesCount = value; }

        public void Insert()
        {
            SeriesDBServices dbs = new SeriesDBServices();
            dbs.Insert(this);
        }
/*     * The most viewed series on our site for display on the Home page
       * input - none
       * Output - a sorted list of the most viewed series on the site  */
        public List<Series> Get()
        {
            SeriesDBServices us = new SeriesDBServices();
            return us.GetSeries();
        }

    }
}