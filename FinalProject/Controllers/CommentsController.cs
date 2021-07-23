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
    public class CommentsController : ApiController
    {
        /* Get all the comments according to series and current connected userId */
        public List<Comment> Get(int seriesId, int connectedUserId)
        {
            Comment c = new Comment();
            return c.Get(seriesId, connectedUserId);
        }

        /* Get the most active user who wrote the most comments and return his UserId */
        public int Get()
        {
            Comment c = new Comment();
            return c.Get();
        }

        /* Insert new comment to the Comments Tbl */
        public int Post([FromBody] Comment com)
        {
            com.PostComment();
            return com.SeriesId;  
        }

        /* Update like or dislike on comment */
        public int Put(int commentId, int likes, int dislikes)
        {
            Comment c = new Comment();
            c.UpdateLikes(commentId, likes, dislikes);
            return commentId;
        }
    }
}