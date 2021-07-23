using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class EpisodesController : ApiController
    {
        /* Return the episodes list from Preferences Tbl that the user added according to series name and user Id */
        public List<Episode> Get(string seriesName, int userId)
        {
            Episode e = new Episode();
            List<Episode> Elist = e.Get(seriesName, userId);
            return Elist;
        }

        /* Inserts an Episode to the episodes table  */
        public int Post([FromBody]Episode e)
        {
            e.Insert();
            return 1;
        }

        /* The most viewed episode on our site for display on the Home page
         * Returns - a sorted list of the most episode series on the site  */
        public HttpResponseMessage Get()//List<Episode>
        {
            Episode s = new Episode();
            List<Episode> episodesList= s.Get();
            if (episodesList != null)
            {
                return Request.CreateResponse<List<Episode>>(HttpStatusCode.OK, episodesList);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "most viewed series on our site not exists");
            }
        }
    }
}