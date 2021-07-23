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
    public class UsersController : ApiController
    {
        /* Get User when login to the system, if the user exists */
        public HttpResponseMessage Get(string email, string password)
        {
            User us = new User();
            User u= us.checkLogin(email, password);

            if (u !=null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, u);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "user not found");
            }
        }

        /* Get user by Id */
        public User Get(int id)
        {
            User us = new User();
            return us.GetById(id);
        }

        /* Get all users list */
        public List<User> Get()
        {
            User us = new User();
            return us.Get();
        }

        /* This method inserts a user to the Users table */
        public int Post([FromBody] User user)
        {
            return user.Insert(); //return 1
        }

        /* Update User Details to the Users Tbl */
        public HttpResponseMessage Put(User user)
        {
            int num = user.UpdateUser();
            if (num == 1)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "User Updated");
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "user not found");
            }
        }

        /* Delete a User from the Users Tbl, according to the userId */
        public int Delete(int id)
        {
            User us = new User();
            return us.Delete(id);
        }
    }
}