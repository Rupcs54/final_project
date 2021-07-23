var element = document.getElementById('floatingChat');

setTimeout(function () {
    element.classList.add('enter');
}, 1000);

element.onclick = openElement;

function openElement() {
    element.getElementsByTagName('i')[0].style.display = 'none';
    element.classList.add('expand');
    element.getElementsByClassName('chat')[0].classList.add('enter');

    element.onclick = null;
    element.getElementsByClassName('header')[0].getElementsByTagName('button')[0].onclick = closeElement;
}

function closeElement() {
    element.getElementsByClassName('chat')[0].classList.remove('enter');
    element.getElementsByClassName('chat')[0].style.display = 'none';
    element.getElementsByTagName('i')[0].style.display = 'block';
    element.classList.remove('expand');
    element.getElementsByClassName('header')[0].getElementsByTagName('button')[0].onclick = null;
    setTimeout(function () {
        element.getElementsByClassName('chat')[0].classList.remove('enter');
        element.getElementsByClassName('chat')[0].style.display = 'flex';
        element.onclick = openElement;
    }, 500);
} 