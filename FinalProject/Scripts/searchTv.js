$(document).ready(function () {
    $("#getTV").click(getTV);
    $("#tvShowName").keyup(function (e) {
        if (e.keyCode == 13) {
            getTV();
        }
    });

    key = "90f77ef6862d870eb9f5fff3bc587100";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";

    if (localStorage.series != null) {
        var series = JSON.parse(localStorage["series"]);
        $("#tvShowName").val(series.seriesObj.Name);
        toGetTv(series.seriesObj.Name);
    }

    document.getElementById('card').onclick = function () {
        document.getElementById('scripted').focus();
    };
});

function aboutPage() {
    localStorage.setItem("series", JSON.stringify(totalSeries));
    setTimeout(function () { location.href = 'aboutTv.html'; }, 2000);
}

//////////////////////////////////////////////////Get TV Show///////////////////////////////////////////////////////
function getTV() {
    let name = $("#tvShowName").val();
    $("#seasonsList").html("");
    $("#episodeList").html("");
    toGetTv(name);
}

//
function toGetTv(name) {
    i = 1; //counter of seasons
    k = 0;
    let method = "3/search/tv?";
    let api_key = "api_key=" + key;
    let moreParams = "&language=en-US&page=1&include_adult=false&";
    let query = "query=" + encodeURIComponent(name);
    let apiCall = url + method + api_key + moreParams + query;
    ajaxCall("GET", apiCall, "", getTVSuccessCB, getTVErrorCB);
}

function getTVSuccessCB(tv) {
    buildTvSeriese(tv);
    $("#Episodes").html("");
    seasonsList = "";
    tvId = tv.results[0].id;
    posterURL = tv.results[0].poster_path
    let poster = imagePath + posterURL;
    str = "<img src='" + poster + "'/>";
    let stars = 5;
    let popularity = tv.results[0].popularity;
    switch (true) {
        case (popularity < 40):
            stars = 1
            break;
        case (popularity < 60):
            stars = 2
            break;
        case (popularity < 200):
            stars = 3
            break;
        case (popularity < 400):
            stars = 4
            break;
    }
    str += "<img id='starsPopularity' src= '../images/" + stars + "stars.png'/><button id='aboutBtn' onclick='aboutPage()'>TV SHOW about</button>";
    $("#ph").html(str);

    let method = "3/tv/";
    let api_key = "api_key=" + key;

    let apiCall = url + method + tvId + "/season/" + i + "?" + api_key;
    ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB);
}

function getTVErrorCB(err) {
    if (err.status == 404)
        console.log("can't find more");
    console.log(err);
}

//create obj for sql table - in button "add" we send it to the sql table
seriesObj = null;
totalSeries = null;
function buildTvSeriese(tv) {
    console.log(tv);
    seriesObj = {
        Id: tv.results[0].id,
        First_air_date: tv.results[0].first_air_date,
        Name: tv.results[0].name,
        Origin_country: tv.results[0].origin_country[0],
        Original_language: tv.results[0].original_language,
        Overview: tv.results[0].overview,
        Popularity: tv.results[0].popularity,
        Poster_path: imagePath + tv.results[0].poster_path
    }
    extras = {

        Backdrop_path: imagePath + tv.results[0].backdrop_path,
        Genre_ids: tv.results[0].genre_ids

    }
    totalSeries = {
        seriesObj,
        extras
    }
    console.log(totalSeries);

    localStorage.setItem("series", JSON.stringify(totalSeries));
}

//////////////////////////////////////////////////Get Seasons///////////////////////////////////////////////////////
seasonsCount = 0;
function getSeasonSuccessCB(season) {
    epArr = [];
    if (season.poster_path == null)
        season.poster_path = posterURL;
    seasonsList += "<div id= '" + i + "' class='card' onclick=showEpisode(this.id)>";
    seasonsList += "<img id= 'imgInCard' src='" + imagePath + season.poster_path + "'style='width:100%'>";
    seasonsList += "<h4 style='text-align:center'><b>" + season.name + "</b></h4></div>";
    i++;
    seasonsCount++;

    $("#seasonsList").html(seasonsList);
    let method = "3/tv/";
    let api_key = "api_key=" + key;

    let apiCall = url + method + tvId + "/season/" + i + "?" + api_key;
    ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB);
}


function getSeasonErrorCB(err) {
    if (err.status == 404) {
        console.log("All Seasons Loaded");
        i = 0;
    }
    else
        console.log(err);
}
saveSeasonNum = 0;
function chooseSeasonClass(seasonNum) {
    document.getElementById(seasonNum).classList.add("cardSelected");
    if (saveSeasonNum != 0) {
        document.getElementById(saveSeasonNum).classList.remove("cardSelected");
    }
}

//////////////////////////////////////////////////Get Episodes from the TMDB server///////////////////////////////////////////////////////
function showEpisode(seasonNum) {
    $("html, #Episodes").animate({ scrollTop: document.body.scrollHeight }, "slow");

    chooseSeasonClass(seasonNum);
    j = 1;
    saveSeasonNum = seasonNum;
    episodesList = "";
    $("#Episodes").html(episodesList);

    let method = "3/tv/";
    let api_key = "api_key=" + key;
    epArr = [];
    apiCall = url + method + tvId + "/season/" + seasonNum + "/episode/" + j + "?" + api_key;
    ajaxCall("GET", apiCall, "", getEpisodeSuccessCB, getEpisodeErrorCB);
}

c = 0;
episode = null;
function getEpisodeSuccessCB(episodes) {
    episode = {
        EpisodeId: episodes.id,
        SeriesId: seriesObj.Id, //foreign key
        SeriesName: seriesObj.Name,
        SeasonNum: episodes.season_number,
        EpisodeName: episodes.name,
        ImageURL: imagePath + episodes.still_path,
        Overview: episodes.overview,
        AirDate: episodes.air_date
    }
    if (episodes.still_path == null)
        episode.ImageURL = imagePath + posterURL;


    epArr.push(episode);    
    episodesList += "<div class='card2'><img class= 'imgCard' id='" + j + "' src='" + episode.ImageURL + "'>"; 
    episodesList += "<div class='episodeBlock'><br><b class='episodeTitle'>" + (episodes.name);
    episodesList += "</b></br> " + episodes.air_date + "</br></br><div id='episodeOverView'>" + episodes.overview + "</div></div>";
    if (localStorage.user != undefined) {
        episodesList += "</br><button class='addBtn' id='" + c + "' type='button' onclick=PostToServer(epArr[this.id])> Add </button> </center>";
    }
    episodesList += "</div>";
    c++;

    $("#Episodes").html(episodesList);
    j++;
    let method = "3/tv/";
    let api_key = "api_key=" + key;
    let apiCall = url + method + tvId + "/season/" + saveSeasonNum + "/episode/" + j + "?" + api_key;
    ajaxCall("GET", apiCall, "", getEpisodeSuccessCB, getEpisodeErrorCB);
}

function getEpisodeErrorCB(err) {
    if (err.status == 404) {
        console.log("All Episodes Loaded");
        c = 0;
    }
    else
        console.log(err);
}

//////////////////////////////////////////////////Add Preferences to our Total DB///////////////////////////////////////////////////////
totalObj = {};  
function PostToServer(episodeToAdd) {
    let api = "../api/Totals";
    //add new preference for DB
    totalObj = {
        Series: seriesObj,
        Episode: episodeToAdd,
        UserId: user.Id
    }
    ajaxCall("POST", api, JSON.stringify(totalObj), postPreferenceSuccessCB, postPreferenceErrorCB);
}

function postPreferenceSuccessCB(feedback) {
    alert(feedback);
}

function postPreferenceErrorCB(err) {
    if (err.status == 404)
        alert("Preference is already exists");
    else
        alert(err.status);
}

