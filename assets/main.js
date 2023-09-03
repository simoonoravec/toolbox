$(function() {
    $("#loading").show();

    document.addEventListener("htmx:responseError", function(evt) {
        Toolbox.showError();
    });

    document.addEventListener("htmx:beforeSwap", function(evt) {
        Toolbox.unregisterEvents();
    });

    Toolbox.generateNavbar().then(() => {
        htmx.process(".nav");
        Toolbox.registerNavbarEvents();

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

class Toolbox {
    static eventTargets = [];

    static registerEvent(target, event, func) {
        let e = $(target).on(event, func);
        Toolbox.eventTargets.push(target);
    }

    static unregisterEvents() {
        for (let i in Toolbox.eventTargets) {
            $(Toolbox.eventTargets[i]).unbind();
            console.log("removed "+Toolbox.eventTargets[i]);
        }

        console.log("Cleared events.");
        Toolbox.eventTargets = [];
    }

    static registerNavbarEvents() {
        let elements = document.getElementsByClassName("nav-link");
        for(let i = 0; i < elements.length; i++) {
            elements[i].onclick = function () {
                for(let j = 0; j < elements.length; j++) elements[j].classList.remove("active");
                this.classList.add("active");
    
                location.hash = $(this).data("page-name");
            }
        }
    }

    static showError() {
        $("#app").fadeOut(100);
        $("#loading").fadeOut(200);
        $("#error").delay(100).fadeIn(200);
    }

    static generateNavbar() {
        return new Promise((resolve, reject) => {
            $.ajaxSetup({
                error: function(xhr, status, error) {
                    reject();
                    showError();
                }
            });
            $.get("assets/navbar.json", (data) => {
                console.log(data);
                for (let i in data) {
                    let item = data[i];
    
                    $(".nav").append(`
                        <li class="nav-item">
                            <a
                                role="button"
                                class="nav-link"
                                id="navlink-${item.name}"
                                data-page-name="${item.name}"
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
}