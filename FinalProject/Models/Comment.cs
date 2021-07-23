using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FinalProject.Models.DAL;

namespace FinalProject.Models.DAL
{
    public class Comment
    {
        int commentId;
        string currDate;
        int userId;
        string userName;
        int seriesId;
        string content;
        int likes;
        int dislikes;
        string profile;
        bool isLike;
        bool isDislike;
        public Comment() { }
        public Comment(int commentId, string currDate, int userId, string userName, int seriesId, string content, int likes, int dislikes, string profile, bool isLike, bool isDislike)
        {
            this.commentId = commentId;
            this.currDate = currDate;
            this.userId = userId;
            this.seriesId = seriesId;
            this.content = content;
            this.userName = userName;
            this.likes = likes;
            this.dislikes = dislikes;
            this.profile = profile;
            this.isLike = isLike;
            this.isDislike = isDislike;
        }

        public int CommentId { get => commentId; set => commentId = value; }
        public string CurrDate { get => currDate; set => currDate = value; }
        public int UserId { get => userId; set => userId = value; }
        public string UserName { get => userName; set => userName = value; }
        public int SeriesId { get => seriesId; set => seriesId = value; }
        public string Content { get => content; set => content = value; }
        public int Likes { get => likes; set => likes = value; }
        public int Dislikes { get => dislikes; set => dislikes = value; }
        public bool IsLike { get => isLike; set => isLike = value; }
        public bool IsDislike { get => isDislike; set => isDislike = value; }
        public string Profile { get => profile; set => profile = value; }


        /* Insert new comment to the Comments Tbl */
        public int PostComment()
        {
            CommentDBServices db = new CommentDBServices();
            return db.Insert(this); 
        }

        /* Get all the comments according to series and current connected userId */
        public List<Comment> Get(int seriesId, int connectedUserId)
        {
            CommentDBServices db = new CommentDBServices();
            return db.GetComments(seriesId, connectedUserId);
        }

        /* Get the most active user who wrote the most comments and return his UserId */
        public int Get()
        {
            CommentDBServices db = new CommentDBServices();
            return db.GetMostActivUser();
        }

        /* Update like or dislike on comment */ 
        public int UpdateLikes(int commentId, int likes, int dislikes)
        {
            CommentDBServices db = new CommentDBServices();
            return db.UpdateLikes(commentId, likes, dislikes);
        }
    }
}