using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FinalProject.Models;
using FinalProject.Models.DAL;

namespace FinalProject.Controllers
{
    public class SeriessController : ApiController
    {
        /*Inserts a series to the series table */
        public void Post([FromBody] Series series)
        {
            series.Insert();
        } 

        /* The most viewed series on our site for display on the Home page
        * Returns - a sorted list of the most viewed series on the site  */
        public HttpResponseMessage Get()
        {
            Series s = new Series();
            List<Series> seriesList= s.Get();
            if (seriesList != null)
            {
                return Request.CreateResponse<List<Series>>(HttpStatusCode.OK, seriesList);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "most viewed series on our site not exists");
            }
        }
    }
}
