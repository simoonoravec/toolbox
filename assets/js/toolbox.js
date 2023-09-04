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
        return new Promise(async (resolve, reject) => {
            try {
                const req = await fetch("assets/navbar.json");
                const data = await req.json();

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
            } catch (e) {
                reject();
            }
        });
    }

    static getDarkMode() {
        if (typeof localStorage.getItem("darkMode") == 'undefined') {
            return true;
        }

        return Toolbox.parseBoolean(localStorage.getItem("darkMode"));
    }

    static toggleDarkMode() {
        Toolbox.setDarkMode(!Toolbox.getDarkMode());
    }

    static setDarkMode(val) { 
        if (val) {
            localStorage.setItem("darkMode", true);

            $("html").attr("data-bs-theme", "dark");

            $("#darkmode-switch").removeClass("bi-sun-fill").addClass("bi-sun");
            $("#loading-img").removeClass("filter-invert");
        } else {
            localStorage.setItem("darkMode", false);

            $("html").attr("data-bs-theme", "light");

            $("#darkmode-switch").removeClass("bi-sun").addClass("bi-sun-fill");
            $("#loading-img").addClass("filter-invert");
        }
    }

    static parseBoolean(val) {
        return /^true$/i.test(val) ? true : false;
    }
}