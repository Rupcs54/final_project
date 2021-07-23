$(document).ready(function () {
    //Get the user from the local storage (with id)
    let user = JSON.parse(localStorage.user);
    userId = user.Id;

    //get the details and render it to the text box;
    getUserData();
    addressAutoComplete()
    $("#pForm").submit(submit); // bind the submit event to a function called addUser
});

//////////////////////////////////////////////////Auto Complete//////////////////////////////////////////////////////
function addressAutoComplete() {
    let searchInput = 'search_input';
    var autocomplete;
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
        types: ['geocode'],

    });
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
        document.getElementById('loc_lat').value = near_place.geometry.location.lat();
        document.getElementById('loc_long').value = near_place.geometry.location.lng();
    });
}

/////////////////////////////////////////////////////Get the User and his Details///////////////////////////////////////////////
function getUserData() {
    let api = "../api/Users?id=" + userId;
    ajaxCall("GET", api, "", getSuccessCB, getErrorCB)
}
function getSuccessCB(user) {
    console.log(user.Id);
    renderDataToTB(user);
}
function getErrorCB(err) {
    if (err.status == 404)
        console.log();
}
function renderDataToTB(user) {
    $('#fnameTB').val(user.FirstName);
    $('#lnameTB').val(user.LastName);
    $('#emailTB').val(user.Email);
    $('#passwordTB').val(user.Password);
    $('#phoneTB').val(user.PhoneNum);
    $('#gender').val(user.Gender);
    $('#yearOfBirthTB').val(user.YearOfBirth);
    $('#genreTB').val(user.Genre);
    $('#search_input').val(user.Address);
}

////////////////////////////////////////////////////////Update The User In the User DB tbl///////////////////////////////////////////////////////////
function updateUser() {
    user = {
        Id: userId,
        FirstName: $('#fnameTB').val(),
        LastName: $('#lnameTB').val(),
        Email: $('#emailTB').val(),
        Password: $('#passwordTB').val(),
        PhoneNum: $('#phoneTB').val(),
        Gender: $('#gender').val(),
        YearOfBirth: $('#yearOfBirthTB').val(),
        Genre: $('#genreTB').val(),
        Address: $('#search_input').val()
    }

    let api = "../api/Users";
    ajaxCall("PUT", api, JSON.stringify(user), updateSuccess, updateError)
}
function updateSuccess(userData) {
    if (localStorage.user != null) {
        user = JSON.parse(localStorage["user"]);
        user.FirstName = $('#fnameTB').val();
        user.LastName = $('#lnameTB').val();
        localStorage.setItem("user", JSON.stringify(user));
    }
    swal("Updated Successfuly!", "Great Job", "success");

    window.location.href = "homePage.html";
    clearForm();
}

function updateError(err) {
    if (err.status == 404)
        console.log("Can't find the user");
    console.log(err);
}

function submit() {
    updateUser();
    return false;
}

function clearForm() {
    document.getElementById("pForm").reset();
}

function backHome() {
    clearForm();
    window.location.replace("homePage.html");
}