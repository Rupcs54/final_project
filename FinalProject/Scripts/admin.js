var tbl; //DATA TABLE

$(document).ready(function () {
    navBarVisability();
    getMostViewedS();
    getMostViewedE();
    getMostActiveUser();

    $("#showUsers").on("click", getUsers);
    $("#showSeries").on("click", getSeries);
    $("#showEpisodes").on("click", getEpisodes);
});

function getUsers() {
    let api = "../api/Users";
    ajaxCall("GET", api, "", getUsersSuccessCB, DbError);
}
function getSeries() {
    let api = "../api/Seriess";
    ajaxCall("GET", api, "", getSeriesSuccessCB, DbError);
}
function getEpisodes() {
    let api = "../api/Episodes";
    ajaxCall("GET", api, "", getEpisodesSuccessCB, DbError);
}
///////////////////////////////////////////////////// DATA TABLE ///////////////////////////////////////////////////////////////
function getUsersSuccessCB(usersList) {
    createUsersTable(usersList);
}
function getSeriesSuccessCB(seriesList) {
    createSeriesTable(seriesList);
}
function getEpisodesSuccessCB(episodesList) {
    createEpisodesTable(episodesList);
}
///////////////////////////////////////// create Users Table - Data Table ////////////////////////////////////////////////////
function createUsersTable(usersdata) {
    console.log(usersdata);
    $("#ph").html("<table id='usersTable' class='display nowrap' style='width: 95%'> </table>");
    try {
        tbl = $('#usersTable').DataTable({
            data: usersdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        let dataProd = "data-userId='" + row.Id + "'";
                        deleteBtn = "<button type='button' id='btnDataTable' class='delete btn btn-success' onclick='deleteFunc(this)' " + dataProd + " > Delete </button>";
                        return deleteBtn;
                    }
                },
                {
                    title: "UserId:",
                    data: "Id"
                },
                {
                    title: "First Name",
                    data: "FirstName"
                },
                {
                    title: "Last Name",
                    data: "LastName"
                },
                {
                    title: "Email",
                    data: "Email"
                },
                {
                    title: "Password",
                    data: "Password"
                },
                {
                    title: "PhoneNumber",
                    data: "PhoneNum"
                },
                {
                    title: "Gender",
                    data: "Gender"
                },
                {
                    title: "Year of birth",
                    data: "YearOfBirth"
                },
                {
                    title: "Favorite Genre",
                    data: "Genre"
                },
                {
                    title: "Address",
                    data: "Address"
                }
            ],
        })
    }
    catch (err) {
        alert("Users Table error -  " + err)
    }
}
///////////////////////////////////////// create series Table - Data Table ///////////////////////////////////////////////////
function createSeriesTable(seriesdata) {
    $("#ph").html("<table id='seriesTable' class='display nowrap' style='width: 95%'> </table>");
    console.log(seriesdata);
    try {
        tbl = $('#seriesTable').DataTable({
            data: seriesdata,
            pageLength: 5,
            columns: [
                {
                    title: "Series Id:",
                    data: "Id"
                },
                {
                    title: "Series image",
                    render: function (data, type, row, meta) {
                        return "<img class='imgT 'width='70' height='90' src='" + row.Poster_path + "'/>";
                    }
                },
                {
                    title: "Series Name",
                    data: "Name"
                },
                {
                    title: "Preferences",
                    data: "PreferencesCount"
                },
                {
                    title: "Popularity",
                    data: "Popularity"
                },
                {
                    title: "First air date",
                    data: "First_air_date"
                },
                {
                    title: "Origin country",
                    data: "Origin_country"
                },
                {
                    title: "Original language",
                    data: "Original_language"
                },
                {
                    title: "Overview",
                    render: function (data, type, row, meta) {
                        return "<p class='overview' style='text-align:left'>" + row.Overview.slice(0, 90) + "</p>";
                    }
                }
            ],
        })
    }
    catch (err) {
        alert("Series Table error -  " + err)
    }
}
///////////////////////////////////////// create episodes Table - Data Table ///////////////////////////////////////////////////
function createEpisodesTable(episodesdata) {
    $("#ph").html("<table id='episodesTable' class='display nowrap' style='width: 95%'> </table>");
    console.log(episodesdata);
    try {
        tbl = $('#episodesTable').DataTable({
            data: episodesdata,
            pageLength: 5,
            columns: [
                {
                    title: "Episode Id:",
                    data: "EpisodeId"
                },
                {
                    title: "Episode image",
                    render: function (data, type, row, meta) {
                        return "<img 'width='50' height='70' src='" + row.ImageURL + "'/>";
                    }
                },
                {
                    title: "Episode Name",
                    data: "EpisodeName"
                },
                {
                    title: "Series Id",
                    data: "SeriesId"
                },
                {
                    title: "Series Name",
                    data: "SeriesName"
                },
                {
                    title: "Season Number",
                    data: "SeasonNum"
                },
                {
                    title: "Preferences",
                    data: "PreferencesCount"
                },
                {
                    title: "Air-Date",
                    data: "AirDate"

                },
                {
                    title: "Overview",
                    render: function (data, type, row, meta) {
                        return "<p class='overview' style='text-align:left'>" + row.Overview.slice(0, 100) + "</p>";
                    }
                }
            ],
        })
    }
    catch (err) {
        alert("Episode Table error -  " + err)
    }
}

function redrawTable(tbl, data) {
    tbl.clear();
    for (var i = 0; i < data.length; i++) {
        tbl.row.add(data[i]);
    }
    tbl.draw();
}

// this function is activated in case of a failure //
function DbError(err) {
    if (err.status == 404)
        console.log("Can't find Data the DB")
    else
        console.log(err);
}

///////////////////////////////////////// Delete a user from the server //////////////////////////////////////////////////////
function DeleteUser(id) {
    ajaxCall("DELETE", "../api/Users/" + id, "", deleteUserSuccess, deleteUserError);
}
function deleteFunc(id) {
    var userId = id.getAttribute('data-userId');
    swal({ // this will open a dialouge
        title: "Are you sure ??",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true
    })
        .then(function (willDelete) {
            if (willDelete) DeleteUser(userId);
            else swal("Not Deleted!");
        });
}
function deleteUserSuccess(numOfUser) {
    swal("User Deleted")
    getUsers();
}
function deleteUserError(err) {
    if (err.status == 404)
        console.log("Can't delete User from the server")
    else
        console.log(err);
}

///////////////////////////////////// get the Most popular series in our DB//////////////////////////////////////////////////////
function getMostViewedS() {
    let api = "../api/Seriess";
    ajaxCall("GET", api, "", getSuccessMostViewedS, errorDB);
}
function getSuccessMostViewedS(topV) {
    mostViewedList = "<p class='MostViewed'> The most popular series <br><br><b>" + topV[0].Name + "</b></p>";
    $("#redDiv").html(mostViewedList);
}
///////////////////////////////////// get the Most popular episode in our DB//////////////////////////////////////////////////////
function getMostViewedE() {
    let api = "../api/Episodes";
    ajaxCall("GET", api, "", getSuccessMostViewedE, errorDB);
}
function getSuccessMostViewedE(topV) {
    mostViewedList = "<p class='MostViewed'> The most popular Episode <br><br><b>" + topV[0].EpisodeName + "</b> in " + topV[0].SeriesName + "</p>";
    $("#blueDiv").html(mostViewedList);
}
function getMostActiveUser() {
    let api = "../api/Comments";
    ajaxCall("GET", api, "", getSuccessMostActiveUser, errorDB);
}
///////////////////////////////////// get the Most Active User in our DB//////////////////////////////////////////////////////
// get the id of Most Active User //
function getSuccessMostActiveUser(userId) {
    let api = "../api/Users?id=" + userId;
    ajaxCall("GET", api, "", getSuccessMostActiveUserDetails, errorDB);
}
// get mםre details  about the Most Active User //
function getSuccessMostActiveUserDetails(user) {
    mostViewedList = "<p class='MostViewed'> The most responses <br><br><b>" + user.FirstName + " " + user.LastName + "</b><br>id: " + user.Id + "</p>";
    $("#greenDiv").html(mostViewedList);
}

function errorDB(err) {
    if (err.status == 404)
        console.log("Can't find Data the DB");
    else
        console.log(err);
}