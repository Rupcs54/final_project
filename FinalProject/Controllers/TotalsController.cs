using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class TotalsController : ApiController
    {
        /*  * Show the user in view page series according to his preferences
            * input - userId and email
            * Output - a sorted list of the series he liked */
        public HttpResponseMessage Get(int userId, string email) 
        {
            Total total = new Total();
            List<Series> Slist =  total.GetSeries(userId, email);
            if (Slist != null)
            {
                return Request.CreateResponse<List<Series>>(HttpStatusCode.OK, Slist);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "The user has no saved series");
            }
        }

        /*  * Recommended series for the user according to our algorithm according to our calculation
            * The algorithm selects "similar users" and recommends the user to see the most common series they liked.
            * Similar users = users in the same age range (5 years up and down) and members with the same gender. 
            * input - userId
            * Output - a sorted list of the most viewed series on the site */
        public HttpResponseMessage Get(int userId)// List<Series>
        {
            Total total = new Total();
            List<Series> Slist = total.RecommendForTheUser(userId);
            if (Slist != null)
            {
                return Request.CreateResponse<List<Series>>(HttpStatusCode.OK, Slist);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "There are no recommended series for the user");
            }

        }
        /*  * Upload the episodes that the user liked according to the series he chose(preferences)
              * input - series Name and user Id
              * Output -  list of the Episode he liked */
        public HttpResponseMessage Get(string seriesName, int userId)
        {
            Episode e = new Episode();
            List<Episode> Elist = e.Get(seriesName, userId);
            if (Elist != null)
            {
                return Request.CreateResponse<List<Episode>>(HttpStatusCode.OK, Elist);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "There are no recommended series for the user");
            }
        }

        /*  * Insert to the preferences DB tbl
             * the user's Preferences Episodes and the Series it belongs 
             * and the user that choose them */
        public HttpResponseMessage Post([FromBody]Total obj)
        {
            int feedback= obj.Insert();
            if (feedback == 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Preferences Inserted");
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, " Preferences already exists");
            }
        }

        /*  * Delete the chapter from the user's preferences list
            input - episode Id, series Id, userId
           * Output - none */
        public void Delete(int episodeId, int seriesId, int userId)
        {
            Total total = new Total();
            total.DeletePreferences(episodeId, seriesId, userId);
        }
    }
}