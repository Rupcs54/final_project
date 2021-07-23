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
    public class SubCommentsController : ApiController
    {
        /* Insert a SubComment to the SubComments Table 
         * Returns the seriesId of the forum comments
         */
        public int Post([FromBody] SubComment com)
        {
            com.PostSubComment();
            return com.SeriesId;
        }
         
        /* Get a list of all the SubComments for each Comment */
        public List<SubComment> Get(int seriesId, int commentId)
        {
            SubComment sc = new SubComment();
            return sc.Get(seriesId, commentId);
        }
    }
}