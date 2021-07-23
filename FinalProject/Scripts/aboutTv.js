$(document).ready(function () {
    key = "90f77ef6862d870eb9f5fff3bc587100";

    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";

    if (localStorage.series != null) {
        series = JSON.parse(localStorage["series"]);
        tvId = series.seriesObj.Id;
    }
    initChat(); 
    
    method = "3/tv/";
    api_key = "api_key=" + key;
    getSocialMedia();
    showTVData();
    getCredists();  // Get actors
    getRecommendations(); //    Get recommandation
    getSimilars();  // Get similars Tv show
    getReviews();   // Get the reviews for a TV show

    if (localStorage.user == null)//just members can see chat
        document.getElementById("floatingChat").style.visibility = "hidden";
});

//Header of the page -> Show the basic data of the TV show. Taking it from LS.
function showTVData() {
    let name = series.seriesObj.Name;
    $("#tvTitle").html(name);

    let overview = series.seriesObj.Overview;
    $("#overview").html(overview);

    // getCreateYouTubeTrailer();
    gapi.load("client", loadClient.bind(this));

    let posterURL = series.seriesObj.Poster_path;
    let poster = "<img src='" + posterURL + "'/>";

    let stars = 5;
    let popularity = series.seriesObj.Popularity;
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
    $("#poster").html(poster);

    let backdropImg = "<img src='" + series.extras.Backdrop_path + "'>";
    $("#backgroundPorter").append(backdropImg);
}

//////////////////////////////////////////////////Get Actors from TMDB Api////////////////////////////////////////////////////////////
function getCredists() {
    let apiCall = url + method + tvId + "/credits?" + api_key;
    ajaxCall("GET", apiCall, "", getCastSuccessCB, errorApiDB);
}

k = 0;
actors = null;
function getCastSuccessCB(credit) {
    actors = credit.cast; //arr of all the actors
    actorsList = "<div class='container'>";
    if (actors.length > 7)
        classStyle = 'owl-carousel owl-theme actors-row';
    else
        classStyle = 'actors-row';
    actorsList += "<div class=" + classStyle + ">";
    actors.forEach(actor => {
        actorsList += drawActor(actor);
        k++;
    });
    
    actorsList += "</div></div>";
    $("#actors").html(actorsList);
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

function aboutTheActor(actorId) {
    let apiCall = url + "3/person/" + actorId + "?" + api_key;
    ajaxCall("GET", apiCall, "", getActorSuccessCB, errorApiDB);
}

function getActorSuccessCB(actor) {
    openModal();
    let str = "";
    str += "<div class='ActorTitle'>" + actor.name + "</div>"
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

    carousel();

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
}

////////////////////////////////Get Recommendations from TMDB Api accoreding to current series////////////////////////////////////

//Reocommanded Series
function getRecommendations() {
    let apiCall = url + method + tvId + "/recommendations?" + api_key;
    ajaxCall("GET", apiCall, "", getSuccessRecommendationsCB, errorApiDB);
}

//Get all the tv shows recommand to the user, according to his choises
r = 0; //index in result array that contain all the tv shows in the TMDB services
recArr = [];
function getSuccessRecommendationsCB(recommendations) {
    let recList = "<div class='container'>";
    recList += "<div class='owl-carousel owl-theme row'>";
    recArr = recommendations.results;
    recArr.forEach(recommand => {
        recList += drawRecommand(recommand);
        r++;
    });
    recList += "</div></div>";
    $("#recommendations").html(recList);
    r = 0;
    //carousel();
}

function drawRecommand(rec) {
    let stars = 5;
    let popularity = rec.popularity;
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
    str = `<div class='item recommand-card' onclick = 'showAbout(recArr[` + r + `])'>
        <img src='` + imagePath + rec.poster_path + `'>
        <h4><b>` + rec.name + `</b></h4>
        <h4>` + rec.origin_country[0] + `, ` + rec.original_language + `</h4>
        <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`
    return str;
}

////////////////////////////////Get Similar series from TMDB Api accoreding to current series////////////////////////////////////
///////////////////////Get a list of similar TV shows. These items are assembled by looking at keywords and genres///////////////

function getSimilars() {
    let apiCall = url + method + tvId + "/similar?" + api_key;
    ajaxCall("GET", apiCall, "", getSuccessSimilarsCB, errorApiDB);
}

similarArr = null;
function getSuccessSimilarsCB(similars) {
    similarArr = similars.results;
    let similarList = "<div class='container'>";
    similarList += "<div class='owl-carousel owl-theme row'>";
    similarArr.forEach(similarShow => {
        similarList += drawSimilar(similarShow);
        r++;
    });
    similarList += "</div></div>";
    $("#similars").html(similarList);
    r = 0;
    carousel();
}

function drawSimilar(similar) {
    let stars = 5;
    let popularity = similar.popularity;
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
    str = `<div class='item recommand-card' onclick = 'showAbout(similarArr[` + r + `])'>
        <img src='` + imagePath + similar.poster_path + `'>
        <h4><b>` + similar.name + `</b></h4>
        <h4>` + similar.origin_country[0] + `, ` + similar.original_language + `</h4>
        <img class='starsPopularity' src= '../images/` + stars + `stars.png'/></div>`
    return str;
}
/////////////////////////////////////////////Show the about page of this tvShow that was clicked////////////////////////////////////
function showAbout(tvShow) {
    storeToLS(tvShow);
    location.reload();
}

//Store to Local Storage the tvShow that was clicked
function storeToLS(tvShow) {
    seriesObj = {
        Id: tvShow.id,
        First_air_date: tvShow.first_air_date,
        Name: tvShow.name,
        Origin_country: tvShow.origin_country[0],
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

////////////////////////////////////////////////Get Social Media Links from TMDB Api////////////////////////////////////////////////
function getSocialMedia() {
    let apiCall = url + method + tvId + "/external_ids?" + api_key;
    ajaxCall("GET", apiCall, "", getSocialSuccessCB, errorApiDB);
}

function getSocialSuccessCB(socialLinks) {
    str = "<ul>";
    if (socialLinks.facebook_id != null) {
        str += ` <li class="facebook"><a href="https://www.facebook.com/` + socialLinks.facebook_id + `"target="_blank">
                        <i class="fa fa-facebook" aria-hidden="true"></i></a>
                    <div class="slider">
                        <p>facebook</p>
                    </div>
                </li>`;
    }
    if (socialLinks.instagram_id != null) {
        str += `<li class="instagram"><a href="https://www.instagram.com/` + socialLinks.instagram_id + `/"target="_blank">
                            <i class="fa fa-instagram" aria-hidden="true"></i></a>
                            <div class="slider">
                                <p>instagram</p>
                            </div>
                        </li>`;
    }
    if (socialLinks.twitter_id != null) {
        str += ` <li class="twitter"><a href="https://twitter.com/` + socialLinks.twitter_id + `" target="_blank">
                            <i class="fa fa-twitter" aria-hidden="true"></i></a>
                            <div class="slider">
                                 <p>twitter</p>
                            </div>
                        </li>`;
    }

    str += "</ul>";
    $('#mediaLinks').html(str);
}


///////////////////////////////////////////Get Reviews from TMDB Api accoreding to current series/////////////////////////////////////
function getReviews() {
    let apiCall = url + method + tvId + "/reviews?" + api_key;
    ajaxCall("GET", apiCall, "", getSuccessReviewsCB, errorApiDB);
}

function getSuccessReviewsCB(reviewsArr) {
    let reviewsList = "<div class='reviews'>";
    reviewsList = `<div class="carousel">`;
    if (reviewsArr.results != undefined) {
        var reviews = reviewsArr.results;

        //if (reviews[r].author_details['avatar_path'].slice(0, 5) != '"/https:')
        //    imgAvatar = "https://image.ibb.co/jw55Ex/def_face.jpg";
        //else
        //    imgAvatar = imagePath + reviews[r].author_details['avatar_path'];
        // imgAvatar = "https://image.ibb.co/jw55Ex/def_face.jpg";

        reviews.forEach(review => {
            reviewsList += drawReview(review);
        });

        reviewsList += "</div>";
        $("#reviews").html(reviewsList);

        setCarousel();
    }
}

function drawReview(review) {
    //if (review.author_details['avatar_path'].startsWith() == '"/https:')
    //    imgAvatar = "https://image.ibb.co/jw55Ex/def_face.jpg";//review.author_details['avatar_path'].slice(1);//"https://image.ibb.co/jw55Ex/def_face.jpg";
    //else
    imgAvatar = imagePath + review.author_details['avatar_path'];
    return `<div class="carousel-cell">
            <div class="review-avatar">
                <img class="p" src="`+ imgAvatar + `">
                <p class= "n">`+ review.author + `</p>
            </div>
            <p class="content">`+ review.content + `</p>
            <p class= "b">read allready</p>
            </div>`;
}

//Reviews Carousel
function setCarousel() {
    $(".b").click(function () {
        $(this).toggleClass("b");
        $(this).toggleClass("b-selected");
    });
    var elem = document.querySelector('.carousel');
    flkty = new Flickity(elem, {
        // options
        cellalign: 'right',
        pageDots: false,
        groupCells: '20%',
        selectedAttraction: 0.03,
        friction: 0.15
    });
    flkty = new Flickity('.carousel', {
    });
}

//Error function to all TMDB Api
function errorApiDB(err) {
    console.log("TMDB Api Error");
    console.log(err);
}

////////////////////////////////////////////////YouTube Trailer////////////////////////////////////////////////
function loadClient() {
    const keywordInput = series.seriesObj.Name + " trailer";
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
                                    <li><a data-fancybox href="https://youtube.com/watch?v=${videoId}"><img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" /></a></li>
                                `;
                    });
                    output += '</ul>';

                    if (response.result.prevPageToken) {
                        output += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
                    }

                    if (response.result.nextPageToken) {
                        output += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
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


////////////////////////////////////////////////Chat////////////////////////////////////////////////
function initChat() {
/*    msgArr = [];*/
    var seriesName;
    if (localStorage.series != null) {
        var series = JSON.parse(localStorage["series"]);
        seriesName = series.seriesObj.Name;
    }
    
    if (localStorage.user != null) {
        document.getElementById("chat").style.visibility = "visibility";
        let tmp = JSON.parse(localStorage["user"]);
        userName = tmp.FirstName + " " + tmp.LastName;
        userId = tmp.Id;
        if (localStorage.profileSrc != undefined)
            userProfile = JSON.parse(localStorage.profileSrc);
        else
            userProfile = "https://image.ibb.co/jw55Ex/def_face.jpg";
        userTmp = {
            name: userName,
            id: userId,
            profile: userProfile
        }
    }
    else {
        document.getElementById("chat").style.visibility = "hidden";
    }

    //pulling the name of tvshow from ls and insert there too
    ref = firebase.database().ref(seriesName);
    // listen to incoming messages
    listenToNewMessages();

    chat = document.getElementById("chat");
    date = calcDay();
}

function scrollChatDown() {
    var element = document.getElementById("chat-content");
    element.scrollTop = element.scrollHeight;
}

//Get the cuurent date
function calcDay() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return today = mm + '/' + dd + '/' + yyyy;
}
function listenToNewMessages() {
    // child_added will be evoked for every child that was added
    // on the first entry, it will bring all the childs
    ref.on("child_added", snapshot => {
        msg = {
            user: snapshot.val().user,
            content: snapshot.val().msg,
            date: snapshot.val().date,
        }
        classStyle = "", imgAvatar = "";
        if (userId == msg.user.id) {
            classStyle = ` media-chat-reverse`;
        }
        printMessage(msg);
    })
}

function printMessage(msg) {
    chat.innerHTML += printToChat(msg);
}

function addMSG() { //add msg to the array of messages
    let content = document.getElementById("msgTB").textContent;
    let name = userName;

    //insert new msg
    ref.push().set({ "msg": content, "user": userTmp, "date": date })
    setTimeout(scrollChatDown, 1);
    document.getElementById("msgTB").textContent = "";
}

function printToChat(msg) {
    if (classStyle == ` media-chat-reverse`)
        float = "right";
    else
        float = "left";
    return `<div class="media media-meta-day">` + msg.date + `</div>
                <div class="media media-chat `+ classStyle + `">
                    <div class="media-body"><img class= "avatarChat" src="` + msg.user.profile + `" style= "height: 46px; width: 43px; border-radius: 25px; float:` + float + `;">
                        <div id="name" style="padding-top: 13px;"> ` + msg.user.name + `</div>
                        <p> ` + msg.content + `</p>
                </div>
            </div>`;
}

/////////////////////////////////////////////////////////Tabs Bar////////////////////////////////////////////////////////
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    document.getElementById(tabName).scrollIntoView();
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