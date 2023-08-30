$(function() {
    let elements = document.getElementsByClassName("nav-link");

    elements[0].classList.add("active");
    for(let i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            for(let j = 0; j < elements.length; j++) elements[j].classList.remove("active");
            this.classList.add("active");
        }
    }
});