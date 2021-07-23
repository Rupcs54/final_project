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
    public class UserLikesCommController : ApiController
    {
        /* Update user like or dislike the comment 
         * Get all the relevant information- commentId, userId, seriesId and whether he like/ dislike this comment
         */
        public void Put(int commentId, int userId, int seriesId, bool like, bool dislike)
        {
            UserLikesComment ulc = new UserLikesComment(commentId, userId, seriesId, like, dislike);
            ulc.Update();
        }
    } 
} 