//  document.getElementById("myModal").style.display = "block";
// Get the modal
function modal() {
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("livechat-compact-container");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close");

    // When the user clicks the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }
     

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function initChat(selectedSeries) {
    msgArr = [];
    //catch the series name
    console.log(selectedSeries);
    ref = firebase.database().ref(selectedSeries);
    // listen to incoming messages
    listenToNewMessages();
    chat = document.getElementById("chat");
    //setTimeout(scrollChatDown, 1000);
    date = calcDay();
}

function scrollChatDown() {
    var element = document.getElementById("chat-content");
    element.scrollTop = element.scrollHeight;
}

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
            date: snapshot.val().date
        }
        msgArr.push(msg)
        classStyle = "", imgAvatar = "";
        if (userId == msg.user.id)
            classStyle = ` media-chat-reverse`;
        else
            imgAvatar = `<img class="avatar" src="https://image.ibb.co/jw55Ex/def_face.jpg">`
        printMessage(msg);
    })
}

function printMessage(msg) {
    chat.innerHTML += printToChat(msg);
}

function printMessages(msgArr) {
    var str = "";
    for (let index = 0; index < msgArr.length; index++) {
        const msg = msgArr[index];
    }
    chat.innerHTML += str;
}

function addMSG() { //add msg to the array of messages
    let content = document.getElementById("msgTB").value;

    ref.push().set({ "msg": content, "user": userTmp, "date": date });
    setTimeout(scrollChatDown, 1);
    document.getElementById("msgTB").value = "";
}

function printToChat(msg) {/*class="media-body"*/
    // <p>`+ msg.user.name + `</p>
    return `<div class="media media-meta-day">` + msg.date + `</div>
                <div class="media media-chat `+ classStyle + `">
                    <div class="media-body">` + imgAvatar + `
                        <p> ` + msg.content + `</p>
                </div>
            </div>`;
}