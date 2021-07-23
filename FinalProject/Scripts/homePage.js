$(document).ready(function () {
    $("#nav-bar").load("signup.html");
    key = "90f77ef6862d870eb9f5fff3bc587100";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    method = "3/tv/";
    api_key = "api_key=" + key;

    getTopRated();  
    getMostViewed();
    getMostViewedEpisodes();
    getGenres()

    if (localStorage.user != null) {
        user = JSON.parse(localStorage["user"]);
        getRecommendForYou(user);
    }
    else
        document.getElementById("recommandTitle").style.visibility = "hidden";
});

///////////////////////////////////////////////// Get Top Rated from the movie DB api ////////////////////////////////////////////////////////
function getTopRated() {
    let apiCall = url + "3/trending/tv/week?" + api_key;
    ajaxCall("GET", apiCall, "", getSuccesstopRated, apiError);
}

r = 0; //index in result array that contain all the tv shows in the TMDB services
topRatedArr = [];//local array to render and play onclick function

function getSuccesstopRated(topRated) {
    topRatedArr = topRated.results;
    topRatedList = "<div class='container'>";
    topRatedList += "<div class='owl-carousel owl-theme row'>";
    topRatedArr.forEach(TVShow => {
        topRatedList += drawTopRated(TVShow);
        r++;
    });
    topRatedList += "</div></div>";
    $("#topRated").html(topRatedList);
    r = 0;

    jQuery(function ($) {
        $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 7
                }
            }
        })
    });
}

///ERROR FROM API///
function apiError(err) {
    if (err.status == 404)
        alert("error in 'the movie DB' Api");
    else
        alert(err.status);
}

function drawTopRated(TVShow) {
    let stars = 5;
    let popularity = TVShow.popularity;
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
    str = "";
    str = `<div class='item recommand-card' onclick = 'showAbout(topRatedArr[` + r + `])'>
                           <img src='` + imagePath + TVShow.poster_path + `'>
                           <h4><b>` + TVShow.name + `</b></h4>
                           <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`
    return str;
}


///////////////////Recommended series for the user according to our algorithm according to our calculation (from our DB) /////////////////////////////
function getRecommendForYou(user) {
    let api = "../api/Totals?userId=" + user.Id; 
    ajaxCall("GET", api, "", getSuccessRecommendForYou, errortRecommendForYou);
}

recommendForYouArr = [];//local arrey to render and play onclick function
function getSuccessRecommendForYou(recForYou) {
    if (recForYou.length == 0) {
        getPopular();
    }
    else {
        recommendForYouArr = recForYou;
        recommendForYouList = "<div style= 'display:flex; justify-content:center;' class='row'>";
        while (r < 8 && recForYou[r] != undefined) {
            recommendForYouList += drawRecommendForYou(recForYou[r]);
            r++;
        }
        recommendForYouList += "</div>";
        $("#RecommendForYou").html(recommendForYouList);
    }
    r = 0;
}

//If dont have recommended series - then show the popular
function getPopular() {
    let apiCall = url + "3/tv/popular?" + api_key;
    ajaxCall("GET", apiCall, "", getSuccessPopular, apiError);
}

popularsArr = [];//local array to render and play onclick function
function getSuccessPopular(populars) {
    popularsArr = populars.results;
    popularsList = "<div class='container'>";
    popularsList += "<div class='owl-carousel owl-theme row'>";
    popularsArr.forEach(TVShow => {
        popularsList += drawPopularTv(TVShow);
        r++;
    });
    popularsList += "</div></div>";
    $("#RecommendForYou").html(popularsList);
    r = 0;
    carousel();
}
function drawPopularTv(TVShow) {
    console.log(TVShow);
    let stars = 5;
    let popularity = TVShow.popularity;
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
    str = "";
    str = `<div class='item recommand-card' onclick = 'showAbout(popularsArr[` + r + `])'>
                           <img src='` + imagePath + TVShow.poster_path + `'>
                           <h4><b>` + TVShow.name + `</b></h4>
                           <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`
    return str;
}

function errortRecommendForYou(err) {
    if (err.status == 404)
        console.log("Can't find series recommend for you")
    else
        console.log(err);
}

function drawRecommendForYou(TVShow) {
    console.log(TVShow);
    let stars = 5;
    let popularity = TVShow.Popularity;
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
    str = "";
    str = `<div class='recommand-card' onclick = 'showAboutFromOurWeb(recommendForYouArr[` + r + `])'>
            <img src='`+ TVShow.Poster_path + `'>
            <h4><b>` + TVShow.Name + `</b></h4>
            <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`
    return str;
}

////////////////////////////////////// The most watched Series - according our DB ///////////////////////////////////////////////////
function getMostViewed() {
    let api = "../api/Seriess";
    ajaxCall("GET", api, "", getSuccessMostViewed, errorMostViewed);
}

mostViewedArr = [];//local arrey to render and play onclick function
function getSuccessMostViewed(mostView) {
    mostViewedArr = mostView;
    mostViewedList = "<div style= 'display:flex; justify-content:center;' class='row'>";
    while (r < 8) {
        mostViewedList += drawMostViewed(mostView[r]);
        r++;
    }
    mostViewedList += "</div>";
    $("#mostViewed").html(mostViewedList);
    r = 0;
}

function errorMostViewed(err) {
    if (err.status == 404)
        console.log("Can't find The most watched Series")
    else
        console.log(err);
}

function drawMostViewed(TVShow) {
    console.log(TVShow);
    let stars = 5;
    let popularity = TVShow.Popularity;
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
    str = "";
    str = `<div class='recommand-card' onclick = 'showAboutFromOurWeb(mostViewedArr[` + r + `])'>
                           <img src='`+ TVShow.Poster_path + `'>
                           <h4><b>` + TVShow.Name + `</b></h4>
                           <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`
    return str;
}

////////////////////////////////////// The most watched Episodes - according our DB ///////////////////////////////////////////////////

function getMostViewedEpisodes() {
    let api = "../api/Episodes";
    ajaxCall("GET", api, "", getSuccessMostViewedEpisodes, errorMostViewedEpisodes);
}

mostViewedEpisodesArr = [];//local arrey to render and play onclick function
function getSuccessMostViewedEpisodes(mostViewEpisodes) {
    mostViewedEpisodesArr = mostViewEpisodes;/////
    mostViewedEpisodesList = "<div style= 'display:flex; justify-content:center;' class='row'>";

    while (r < 8) {
        mostViewedEpisodesList += drawMostViewedEpisodes(mostViewEpisodes[r]);
        r++;
    }
    mostViewedEpisodesList += "</div>";
    $("#mostViewedEpisodes").html(mostViewedEpisodesList);
    r = 0;
}

function errorMostViewedEpisodes(err) {
    if (err.status == 404)
        console.log("Can't find The most watched Episodes")
    else
        console.log(err);
}

function drawMostViewedEpisodes(TVShow) {
    str = "";
    str = `<div class='recommand-card'>
                           <img src='`+ TVShow.ImageURL + `'>
                           <h5><b>` + TVShow.SeriesName + "</b><br>Season" + TVShow.SeasonNum + `</h5>
                           <h5>` + TVShow.EpisodeName + `</h5></div>`
    return str;
}


////////////////////////////////////////// search according genre - movie DB api /////////////////////////////////////////////////////////
function getGenres() {
    genresList = "<div> <select id='genre' onchange=showSeriesAccoGenre(this.value)>";
    genresList += "<option value=" + null + "> Select By Genre </option>";

    let apiCall = url + "3/genre/tv/list?" + api_key;
    ajaxCall("GET", apiCall, "", getSuccessGenres, apiError);
}

genresArr = [];//local arrey to render and play onclick function

function getSuccessGenres(genre) {
    genresArr = genre.genres;
    genresArr.forEach(genre => {
        genresList += drawGenres(genre);
        r++;
    });
    genresList += "</select></div>";
    $("#genreSearch").html(genresList);
    r = 0;
}

function drawGenres(genre) {
    console.log(genre);
    str = "";
    str += "<option value=" + genre.id + ">" + genre.name + "</option>";
    return str;
}

////show the Top Rated according the genre the user select///
function showSeriesAccoGenre(genreId) {
    seriesAccoGenreList = "<div class='container'>";
    seriesAccoGenreList += "<div class='owl-carousel owl-theme row'>";

    let apiCall = url + "3/discover/tv?" + api_key + "&sort_by=popularity.desc&with_genres=" + genreId;
    ajaxCall("GET", apiCall, "", getSuccessTVShowGenres, apiError);
}

seriesAccoGenreArr = [];//local arrey to render and play onclick function
function getSuccessTVShowGenres(seriess) {
    seriesAccoGenreArr = seriess.results;
    
    seriesAccoGenreArr.forEach(TVShow => {
        seriesAccoGenreList += drawAccoGenre(TVShow);
        r++;
    });
    seriesAccoGenreList += "</div></div>";
    $("#seriesAccoGenre").html(seriesAccoGenreList);
    r = 0;
///////////////////////////////////////////////// carousel function ////////////////////////////////////////////////////////////
    carousel();
}

function drawAccoGenre(TVShow) {
    let stars = 5;
    let popularity = TVShow.popularity;
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
    str = "";
    str = `<div class='item recommand-card' onclick = 'showAbout(seriesAccoGenreArr[` + r + `])'>
                           <img src='` + imagePath + TVShow.poster_path + `'>
                           <h4><b>` + TVShow.name + `</b></h4>
                           <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`

    return str;
}
///////////////////////////////////////////////////////////  GLOBAL FUNCTIONS  /////////////////////////////////////////////////

//Transition function - Click on a series from the API//
function showAbout(tvShow) {
    console.log(tvShow);
    storeToLS(tvShow);
    window.location.replace("searchTv.html");
}

//Store to Local Storage the tvShow that was clicked - for series from the API//
function storeToLS(tvShow) {
    seriesObj = {
        Id: tvShow.id,
        First_air_date: tvShow.first_air_date,
        Name: tvShow.name,
        Origin_country: tvShow.origin_country,
        Original_language: tvShow.original_language,
        Overview: tvShow.overview,
        Popularity: tvShow.popularity,
        Poster_path: imagePath + tvShow.poster_path
    }
    extras = {

        Backdrop_path: imagePath + tvShow.backdrop_path,
        Genre_ids: tvShow.genre_ids

    }
    totalSeries = {
        seriesObj,
        extras
    }
    localStorage.setItem("series", JSON.stringify(totalSeries));
}
//Transition function - Click on a series from our DB  - we need Upper letters//
function showAboutFromOurWeb(tvShow) {
    console.log(tvShow);
    storeToLsFromSeriesDB(tvShow);
    window.location.replace("searchTv.html");
}

//Store to Local Storage the tvShow that was clicked - for series from our DB//
function storeToLsFromSeriesDB(tvShow) {
    seriesObj = {
        Id: tvShow.Id,
        First_air_date: tvShow.First_air_date,
        Name: tvShow.Name,
        Origin_country: tvShow.Origin_country,
        Original_language: tvShow.Original_language,
        Overview: tvShow.Overview,
        Popularity: tvShow.Popularity,
        Poster_path: tvShow.Poster_path
    }
    extras = {

        Backdrop_path: imagePath + tvShow.backdrop_path,
        Genre_ids: tvShow.genre_ids

    }
    totalSeries = {
        seriesObj,
        extras
    }
    localStorage.setItem("series", JSON.stringify(totalSeries));
}

function carousel() {
    jQuery(function ($) {
        $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 7
                }
            }
        })
    });
}