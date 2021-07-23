$(document).ready(function () {

    $("#getMovie").click(getMovie);
    $("#SearchMovieName").keyup(function (e) {
        if (e.keyCode == 13) {
            getMovie();
        }
    });
    key = "90f77ef6862d870eb9f5fff3bc587100";
    api_key = "api_key=" + key;
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    getTopRated();
});

//////////////////////////////////////////////Get Movie according to the search/////////////////////////////////////////////////
function getMovie() {
    $("html, #TheMovieList").animate({ scrollTop: document.body.scrollHeight }, "slow");
    let name = $("#SearchMovieName").val();
    $("#TheMovieList").html("");
    toGetMovie(name);
}

function toGetMovie(name) {
    i = 0;
    k = 0;
    method = "3/search/movie?";
    moreParams = "&language=en-US&page=1&include_adult=false&";
    query = "query=" + encodeURIComponent(name);
    let apiCall = url + method + api_key + moreParams + query;
    ajaxCall("GET", apiCall, "", getMovieSuccessCB, getMovieErrorCB);
}

i = 0;
moviesArr = [];
function getMovieSuccessCB(movie) {
    document.getElementById("searchResultTitle").style.visibility = "visible";
    moviesList = "<div class='row'>";
    moviesArr = movie.results;

    while (i < 7) {
        moviesList += drawMovie(moviesArr[i]);
        i++;
    }
    moviesList += "</div";
    $("#TheMovieList").html(moviesList);
    i = 0;
}

function drawMovie(movie) {
    if (movie.poster_path == null)
        movieImg =`../images/Default.jpg`;
     else
        movieImg = imagePath + movie.poster_path;

    str = "";
    str = `<div id='` + i + `' class='recommand-card' onclick = 'showAbout(moviesArr[this.id])'>
            <img class ="movieImg" src='` + movieImg + `'>
            <h4><b>` + movie.title + `</b></h4></div>`;
    return str;
}

function getMovieErrorCB(err) {
    console.log(err);
}

//////////////////////////////////////////About Movie///////////////////////////////////////
movieName = "";
//When clicked on a movie --> to get more information
function showAbout(movie) {
    $("html, #TheMovieList").animate({ scrollTop: document.body.scrollHeight }, "slow");
    console.log(movie);
    showMovieData(movie);
    getCredists(movie);
    movieName = movie.title;
    gapi.load("client", loadClient.bind(this));
}

function showMovieData(movie) {
    let name = movie.title;
    $("#movieName").html(name);

    let overview = movie.overview;
    $("#overview").html(overview);
    if (movie.poster_path == null)
        movieImg = `../images/Default.jpg`;
    else
        movieImg = imagePath + movie.poster_path;
    let poster = "<img src='" + movieImg + "'/>";

    let stars = 5;
    let popularity = movie.popularity;
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
    poster += "<img class='starsPopularity' src= '../images/" + stars + "stars.png'/>";
    $("#Poster").html(poster);

    let backdropImg = "<img src='" +imagePath + movie.backdrop_path + "'>";
    $("#backgroundPorter").html(backdropImg);
}


///////////////////////////////////////////////////////Get Actors From TMDB Api//////////////////////////////////////////////////////////
function getCredists(movie) {
    let apiCall = url + "3/movie/" + movie.id + "/credits?" + api_key;
    ajaxCall("GET", apiCall, "", getCastSuccessCB, getCastErrorCB);
}

k = 0;
actors = null;
function getCastSuccessCB(credit) {
    actors = credit.cast; //arr of all the actors
    actorsList = "<div class='actors-row'>";
    while (k < 7) {
        actorsList += drawActor(actors[k]);
        k++;
    }
    actorsList += "</div>";//</div>";
    $("#actors").html(actorsList);
    k = 0;
}

function getCastErrorCB(err) {
    if (err.status == 404) {
        console.log(err);
    }
}

function drawActor(actor) {
    if (actor.profile_path == null)
        actorImg = "https://image.ibb.co/jw55Ex/def_face.jpg";
    else
        actorImg = imagePath + actor.profile_path
    return `<div class='actor-card' onclick='aboutTheActor(actors[` + k + `].id)'>
            <img src='` + actorImg + `'>
            <h4 class='card-text' style='text-align:center'><b>` + actor.name + `</b></h4></div>`
}

///////////////////////////////////////////////////////Open Actors Modal Information//////////////////////////////////////////////////////////////
function aboutTheActor(actorId) {
    let apiCall = url + "3/person/" + actorId + "?" + api_key;
    ajaxCall("GET", apiCall, "", getActorSuccessCB, getActorErrorCB);
}

function getActorSuccessCB(actor) {
    openModal();
    let str = "";
    str = "<div class='ActorTitle'>" + actor.name + "</div>"
    str += "<div class='row'>"
    if (actor.profile_path == null)
        actorImg = "https://image.ibb.co/jw55Ex/def_face.jpg";
    else
        actorImg = imagePath + actor.profile_path
    str += "<img class='imgActorAbout' src='" + actorImg + "'/>";
    str += "</div>";
    str += "<p class='aboutActor'>Birthday: " + actor.birthday + "</p>";
    str += "<p class='aboutActor'>Place of birth: " + actor.place_of_birth + "</p>";
    str += "<p>" + actor.biography + "</p>";

    str += "</div></div>";
    $("#actorAbout").html(str);
    document.getElementById("myModal").style.display = "block";
}

function openModal() {
    // Get the modal
    modal = document.getElementById("myModal");
    // Get the button that opens the modal
    var btn = document.getElementsByClassName("actor-card");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close");
    // When the user clicks the button, open the modal
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    // When the user clicks anywhere outside of the modal, close it
}

function getActorErrorCB(err) {
    console.log(err);
}

///////////////////////////////////////////////////////Get Top Rated Movies//////////////////////////////////////////////////////////////
function getTopRated() {
    let apiCall = url + "3/movie/top_rated?" + api_key;
    ajaxCall("GET", apiCall, "", getSuccessTopRated, errorTopRated);
}

r = 0; //index in result array that contain all the tv shows in the TMDB services
topRatedMoviesArr = [];//local arrey to render and play onclick function
function getSuccessTopRated(topRated) {
    topRatedMoviesArr = topRated.results;
    topRatedList = "<div class='container'>";
    topRatedList += "<div class='owl-carousel owl-theme row'>";
    topRatedMoviesArr.forEach(movie => {
        topRatedList += drawTopRated(movie);
        r++;
    });
    topRatedList += "</div></div>";
    $("#topRated").html(topRatedList);
    r = 0;
    carousel();
}

function errorTopRated(err) {
    console.log(err);
}

function drawTopRated(movie) {
    console.log(movie);
    let stars = 5;
    let popularity = movie.popularity;
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
    str = `<div class='recommand-card' onclick = 'showAbout(topRatedMoviesArr[` + r + `])'>
                           <img src='` + imagePath + movie.poster_path + `'>
                           <h4><b>` + movie.title + `</b></h4>
                           <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`
    return str;
}

////////////////////////////////////////////////YouTube Trailer////////////////////////////////////////////////
function loadClient() {
    const keywordInput = movieName + " trailer";
    const maxresultInput = 1;
    const orderInput = "viewCount";
    const videoList = document.getElementById('trailer');
    var pageToken = '';

    gapi.client.setApiKey("AIzaSyDE7XtNQ19WCXi6LvHGtVTf2u4au_X5-yQ");
    //  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    return gapi.client.load('youtube', 'v3')
        .then(function () { console.log("GAPI client loaded for API"); execute(); },
            function (err) { console.error("Error loading GAPI client for API", err); });

    function execute() {
        const searchString = keywordInput;
        const maxresult = maxresultInput;
        const orderby = orderInput;

        var arr_search = {
            "part": 'snippet',
            "type": 'video',
            "order": orderby,
            "maxResults": maxresult,
            "q": searchString
        };

        if (pageToken != '') {
            arr_search.pageToken = pageToken;
        }

        return gapi.client.youtube.search.list(arr_search)
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                const listItems = response.result.items;
                if (listItems) {
                    let output = '';

                    listItems.forEach(item => {
                        const videoId = item.id.videoId;
                        const videoTitle = item.snippet.title;
                        output += `
                                  <li><a data-fancybox href="https://youtube.com/watch?v=${videoId}">
                                    <img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" /></a></li>`; 
                    });
                    output += '</ul>';

                    if (response.result.prevPageToken) {
                        output += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
                    }
                    // Output list
                    videoList.innerHTML = output;
                }
            },
                function (err) { console.error("Execute error", err); });
    }

    function paginate(e, obj) {
        e.preventDefault();
        pageToken = obj.getAttribute('data-id');
        execute();
    }
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