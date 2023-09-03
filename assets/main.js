$(function() {
    document.addEventListener("htmx:responseError", function(evt) {
        showError();
    });

    generateNavbar().then(() => {
        console.log("got here");
        htmx.process(".nav");
        registerNavbarEvents();

        setTimeout(() => {
            let hash = location.hash.replace("#", "");
            if (hash.length == 0 || $(`#navlink-${hash}`).length == 0) {
                htmx.trigger(`#${$(".nav-link").first().attr("id")}`, "click");
            } else {
                htmx.trigger(`#${$(`#navlink-${hash}`).attr("id")}`, "click");
            }

            $("#loading").fadeOut(300);
            $("#app").delay(100).fadeIn(300);
        }, 100);
    });
});

const registerNavbarEvents = () => {
    let elements = document.getElementsByClassName("nav-link");
    for(let i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            for(let j = 0; j < elements.length; j++) elements[j].classList.remove("active");
            this.classList.add("active");

            location.hash = $(this).attr(`id`).replace("navlink-", "");
        }
    }
}

const showError = () => {
    $("#app").fadeOut(100);
    $("#loading").fadeOut(200);
    $("#error").delay(100).fadeIn(200);
}

const generateNavbar = () => {
    return new Promise((resolve, reject) => {
        $.ajaxSetup({
            error: function(xhr, status, error) {
                reject();
                showError();
            }
        });
        $.get("assets/navbar.json", function(data) {
            for (i in data) {
                let item = data[i];

                $(".nav").append(`
                    <li class="nav-item">
                        <a
                            role="button"
                            class="nav-link"
                            id="navlink-${item.name}"
                            hx-get="pages/${item.html}"
                            hx-trigger="click"
                            hx-swap="innerHTML transition:true"
                            hx-target="#page"
                        >
                            <i class="bi bi-${item.icon} me-2"></i>
                            ${item.title}
                        </a>
                    </li>
                `);
            }

            resolve();
        });
    });
}