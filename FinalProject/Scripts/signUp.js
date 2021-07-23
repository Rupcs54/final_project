let searchInput = 'search_input';
function signUpClick() {
    document.getElementById('modalBox').style.display = 'block';

    $("#pForm").submit(submit); // bind the submit event to a function called addUser


    //////////////////////////////////////////////auto complete -- google maps/////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////Registration Process //////////////////////////////////////////////////////////////
function submit() {
    addUser();
    return false;
}
user = null;
function addUser() {
    user = {
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
    ajaxCall("POST", api, JSON.stringify(user), postSuccess, postError)
}

// Add user unless he does exists in the system
function postSuccess(emailExist) {
    if (emailExist == - 1) {
        alert("email Exist !");
        $("#EmailTB").on("keyup", checkEmail);
        this.validity.valid = false;
        this.setCustomValidity('This email already exists');
    }
    else {
        uploadImage();
        swal("Submitted to the server!", "Great Job", "success");
        setTimeout(function () { location.href = 'login.html'; }, 3000);
    }
}

function postError(err) {
    alert("Error - cant insert user to server");
    console.log(err);
}

function checkEmail(mail) {
    this.validity.valid = false;
    this.setCustomValidity('This email already exists');
}

///////////////////////////////////////////////////Logout and Exit to to home page///////////////////////////////////////////////////
function exitFunc() {
    localStorage.clear();
    document.location = 'homePage.html';
    document.getElementById("pForm").reset();
}


///////////////////////////////////////////////Upload Img to FireBase Storage -- new technology ////////////////////////////////////////////////////////////
function uploadImage() {
    const ref = firebase.storage().ref();

    const file = document.querySelector("#photo").files[0];

    const name = user.Email;
    const metadata = {
        contentType: file.type
    }

    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url)
        })
}

