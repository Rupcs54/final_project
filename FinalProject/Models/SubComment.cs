using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FinalProject.Models.DAL;

namespace FinalProject.Models.DAL
{
    public class SubComment
    {
        int subCommentId;
        int commentId;
        string currDate;
        int userId;
        string userName;
        int seriesId;
        string content;
        string profile;
        public SubComment() { }
        public SubComment(int subCommentId, int commentId, string currDate, int userId, string userName, int seriesId, string content, string profile)
        {
            this.subCommentId = subCommentId;
            this.commentId = commentId;
            this.currDate = currDate;
            this.userId = userId;
            this.seriesId = seriesId;
            this.content = content;
            this.userName = userName;
            this.profile = profile;
        }

        public int SubCommentId { get => subCommentId; set => subCommentId = value; }
        public int CommentId { get => commentId; set => commentId = value; }
        public string CurrDate { get => currDate; set => currDate = value; }
        public int UserId { get => userId; set => userId = value; }
        public string UserName { get => userName; set => userName = value; }
        public int SeriesId { get => seriesId; set => seriesId = value; }
        public string Content { get => content; set => content = value; }
        public string Profile { get => profile; set => profile = value; }

        /* Insert a SubComment to the SubComments Table 
         * Returns the seriesId of the forum comments
         */
        public int PostSubComment()
        {
            SubCommentDBServices db = new SubCommentDBServices();
            return db.Insert(this); 
        }

        /* Get a list of all the SubComments for each Comment */
        public List<SubComment> Get(int seriesId, int commentId)
        {
            SubCommentDBServices db = new SubCommentDBServices();
            return db.GetSubComments(seriesId, commentId);
        }
    }
}