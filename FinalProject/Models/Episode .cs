using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FinalProject.Models.DAL;

namespace FinalProject.Models
{
    public class Episode
    {
        int episodeId;
        int seriesId;
        string seriesName;
        int seasonNum;
        string episodeName;
        string imageURL;
        string overview;
        string airDate;
        int preferencesCount;

        public int SeriesId { get => seriesId; set => seriesId = value; }
        public string SeriesName { get => seriesName; set => seriesName = value; }
        public int SeasonNum { get => seasonNum; set => seasonNum = value; }
        public string EpisodeName { get => episodeName; set => episodeName = value; }
        public string ImageURL { get => imageURL; set => imageURL = value; }
        public string Overview { get => overview; set => overview = value; }
        public string AirDate { get => airDate; set => airDate = value; }
        public int EpisodeId { get => episodeId; set => episodeId = value; }
        public int PreferencesCount { get => preferencesCount; set => preferencesCount = value; }

        public Episode()
        {

        }

        public Episode(int episodeId, string seriesName, int seriesId, int seasonNum, string episodeName, string imageURL, string overview, string airDate, int preferencesCount)
        {
            this.episodeId = episodeId;
            this.seriesName = seriesName;
            this.seriesId = seriesId;
            this.seasonNum = seasonNum;
            this.episodeName = episodeName;
            this.imageURL = imageURL;
            this.overview = overview;
            this.airDate = airDate;
            this.preferencesCount = preferencesCount;
        }

        /* Inserts an Episode to the episodes table  */
        public int Insert()
        {
            EpisodeDataServices ds = new EpisodeDataServices();
            return ds.Insert(this);
        }

        /* Get the episodes from Preferences Tbl that the user added according to series name and user Id */
        public List<Episode> Get(string seriesName, int userId)
        {
            EpisodeDataServices d = new EpisodeDataServices();
            List<Episode> episodeList = d.GetEpisodes(seriesName, userId);
            return episodeList;
        }

        /* The most viewed episode on our site for display on the Home page
         * Returns - a sorted list of the most episode series on the site  */
        public List<Episode> Get()
        {
            EpisodeDataServices us = new EpisodeDataServices();
            return us.GetEpisode();
        }
    }
}