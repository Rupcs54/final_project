using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class ClubMembersController : ApiController
    {
        // GET api/<controller>/5
        public ClubMember Get(int seriesId, int userId)
        {
            ClubMember cm = new ClubMember();
            return cm.Get(seriesId, userId);
        }

        /* Insert a user into the clubMembers */
        public int Post(int seriesId, int userId)
        {
            ClubMember cm = new ClubMember();
            return cm.Insert(seriesId, userId);
        }
    }
}