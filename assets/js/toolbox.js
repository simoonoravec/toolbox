class Toolbox {
    static eventTargets = [];

    static registerEvent(target, event, func) {
        $(target).on(event, func);
        Toolbox.eventTargets.push(target);
    }

    static unregisterEvents() {
        for (let i in Toolbox.eventTargets) {
            $(Toolbox.eventTargets[i]).unbind();
        }

        Toolbox.eventTargets = [];
    }

    static registerNavbarEvents() {
        $(".nav-link").on("click", function() {
            $(".nav-link").removeClass("active");
            $(this).addClass("active");
            location.hash = $(this).data("page-name");
        })
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
                $(".nav").empty();
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