$(document).ready(function () {
    $("#nav-bar").load("signup.html");
    imagePath = "https://image.tmdb.org/t/p/w500/";

    $("#phView").html("");
    str = "<select id='series' onchange=showEpisodes(this)>";
    str += "<option>select</option>";

    if (localStorage.user != null) {
        user = JSON.parse(localStorage["user"]);
        userId = user.Id;
        userEmail = user.Email;
        userName = user.FirstName + " " + user.LastName;
        userTmp = {
            id: userId,
            name: userName
        }
    }
    let api = "../api/Totals?UserId=" + userId + "&email=" + userEmail;
    ajaxCall("GET", api, "", getSeriesSuccessCB, getSeriesErrorCB);
});
   //////////////////////////////Show the user in view page, series according to his preferences///////////////////////////////

function getSeriesSuccessCB(series) {

    for (const s of series) {
        str += "<option value=" + s.Id + ">" + s.Name + "</option>";
    }
    str += "</select>";
    $("#phView").html(str);
}


function getSeriesErrorCB(err) {
    if (err.status == 404)
        alert("Error -cant get the Series names");
    else
        alert(err.status);
}

//////////////////////////////Show the user in view page, Episodes According to the series he chose///////////////////////////////

episodesList = "";
seriesReload = 0;

function showEpisodes(series) {
    var selectedText = series.options[series.selectedIndex].innerHTML; //series name
    selectedVal = series.options[series.selectedIndex].value; //series id

    saveToLocalS(selectedText);
    seriesReload = selectedText;
    getToDBShowEpisodes(selectedText);
}

function getToDBShowEpisodes(selectedText)
{
    let api = "../api/Totals?seriesName=" + selectedText + "&userId=" + userId;
    ajaxCall("GET", api, "", getEpisodesSuccessCB, getEpisodesError);
}

function getEpisodesSuccessCB(episodes) {
    
    checkClub(selectedVal); // Check if he's part of the fan club
    episodesList = "";

    episodes.forEach(ep => {
        episodesList += drawEpisodeCard(ep);
    });

    $("#episodesView").html(episodesList);
}

i = 0; //index in result array that contain all the tv shows
episodes = []; //local arrey to render and play onclick function

function drawEpisodeCard(episode) {
    episodes[i] = episode;
    let str = "<div class='card2 cardInView' style='width:800px; height: 400px'><a class='deleteEpisodeBtn' onclick=deleteEpisode(episodes["+i+"]) tabindex='0' role='button'>X</a> <center><b><p class='episodeTitle'>" + episode.SeriesName + " season " + episode.SeasonNum + "</p></b></center><img class= 'imgCard' src='" + episode.ImageURL + "'>";
    str += "<div class='episodeBlock'><br><b>" + episode.EpisodeName + "</b></br > " + episode.AirDate + "</br></br><div id='episodeOverView'>" + episode.Overview + "</div></div></div>";
    i++;
    return str;
}

function getEpisodesError(err) {
    if (err.status == 404)
        alert("Error -cant get the Episodes list");
    else
        alert(err.status);
}

/////////////////// Delete the episode from the user's preferences list /////////////////////////

function deleteEpisode(episode) {
    let api = "../api/Totals?episodeId=" + episode.EpisodeId + "&seriesId=" + episode.SeriesId + "&userId=" + userId;
    ajaxCall("DELETE", api, "", deleteEpisodesSuccess, deleteEpisodeError);
}

function deleteEpisodesSuccess()
{
    getToDBShowEpisodes(seriesReload);// Reloading of the episodes
    //alert('deleted');
}

function deleteEpisodeError(err) {
    if (err.status == 404)
        alert("Error -cant delete Episode");
    else
        alert(err.status);
}

//////////////////////////////// Check if he's part of the fan club ///////////////////////////////
function checkClub(seriesId) {
    let api = "../api/ClubMembers?seriesId=" + seriesId + "&userId=" + userId;
    ajaxCall("GET", api, "", getClubmMSuccessCB, getClubmMError);
}

function getClubmMError(err) {
    if (err.status == 404)
        alert("Error -cant get Club Member ");
    else
        alert(err.status);
}

function getClubmMSuccessCB(ma) {
    console.log(ma);
    if (ma.UserId == 0) {
        str = `  <div class="wrapper">
              <a id="`+ selectedVal + `" onclick="addToClub(this.id)" href="#">Join to the fan club</a>
           </div> `;
    }

    else {
        str = `  <div class="wrapper">
              <a id="`+ selectedVal + `" onclick="toForum()">Join to the Forum</a>
           </div> `;
    }
    $("#forum").html(str);
}

//////////////////////////////////////// Join the members club /////////////////////////////////////// 
function addToClub(seriesId) {
    let api = "../api/ClubMembers?seriesId=" + seriesId + "&userId=" + userId;
    ajaxCall("POST", api, "", postClubmMSuccessCB, postClubmMError);
}

function postClubmMSuccessCB(ma) {
    alert(" welcome to the gruop :) ");

    str = `  <div class="wrapper">
              <a id="`+ selectedVal + `" href="forum.html">to the forum</a>
           </div> `;
    $("#episodesView").html(episodesList);
    $("#forum").html(str);
}

function postClubmMError(err) {
    if (err.status == 404)
        alert("Error -cant add To Club Member ");
    else
        alert(err.status);
}

function toForum() {
    window.location.replace("forum.html");
}

function saveToLocalS(selectedText) {
    seriesObj = {
        Id: selectedVal,
        Name: selectedText,
    }
    extras = {

        Backdrop_path: "",
        Genre_ids: ""

    }
    totalSeries = {
        seriesObj,
        extras
    }
    console.log(totalSeries);

    localStorage.setItem("series", JSON.stringify(totalSeries));
}
