/**
 * This class contains methods that ensure the basic functionality of the Toolbox
 */

class Toolbox {
    //Initialize variables
    static eventTargets = [];
    static disablePageUpdate = false;

    /**
     * Always use this function to bind events for utilities to make sure that
     * the events get unbound when the user switches to anothe utility
     * @param {String} target Target element ID or class name
     * @param {String} event Event to listen for
     * @param {Object} func Function to execute
     */
    static registerEvent(target, event, func) {
        $(target).on(event, func);
        Toolbox.eventTargets.push(target);
    }

    /**
     * Unbind all registered events
     */
    static unregisterEvents() {
        for (let i in Toolbox.eventTargets) {
            $(Toolbox.eventTargets[i]).unbind();
        }

        Toolbox.eventTargets = [];
    }

    /**
     * Bind events for the navigation bar
     */
    static registerNavbarEvents() {
        $(".nav-link").on("click", function() {
            Toolbox.disablePageUpdate = true;

            $(".nav-link").removeClass("active");
            $(this).addClass("active");
            location.hash = $(this).data("page-name");
        })
    }

    /**
     * Hide the page and show a fatal error message
     * @param {String} text The error message
     */
    static showError(text = null) {
        text == null ? $("#error-msg").text('An internal error has occured!') : $("#error-msg").text(text);

        $("#app").fadeOut(100);
        $("#loading").fadeOut(200);
        $("#error").delay(100).fadeIn(200);
    }

    /**
     * Generate the navigation bar based on the 'navbar.json' file
     * @returns {Promise}
     */
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

    /**
     * Check if dark mode for the page is enabled
     * @returns {Boolean}
     */
    static getDarkMode() {
        if (localStorage.getItem("darkMode") == null) {
            return true;
        }

        return Toolbox.parseBoolean(localStorage.getItem("darkMode"));
    }

    /**
     * Toggle the dark mode
     */
    static toggleDarkMode() {
        Toolbox.setDarkMode(!Toolbox.getDarkMode());
    }

    /**
     * Set the dark mode state
     * @param {Boolean} val 
     */
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

    /**
     * Parse a String to a Boolean
     * @param {String} val 
     * @returns {Boolean}
     */
    static parseBoolean(val) {
        return /^true$/i.test(val) ? true : false;
    }

    /**
     * Update the displayed page (used when user changes the hash in the address bar)
     */
    static updatePage() {
        if (Toolbox.disablePageUpdate) {
            return;
        }

        let hash = location.hash.replace("#", "");
        if (hash.length == 0 || $(`#navlink-${hash}`).length == 0) {
            htmx.trigger(`#${$(".nav-link").first().attr("id")}`, "click");
        } else {
            htmx.trigger(`#${$(`#navlink-${hash}`).attr("id")}`, "click");
        }
    }

    /**
     * This method registers all needed HTMX events
     */
    static registerHTMXevents() {
        document.addEventListener("htmx:responseError", function(evt) {
            let status = evt.detail.xhr.status || 0;
            
            if (status == 404) {
                Toolbox.showError('The requested page could not be found.');
            } else {
                Toolbox.showError();
            }
        });
    
        document.addEventListener("htmx:beforeSwap", function(evt) {
            if (evt.detail.requestConfig.parameters.noUnregisterEvents) {
                return;
            }
    
            Toolbox.unregisterEvents();
        });
    
        document.addEventListener("htmx:afterSwap", function(evt) {
            Toolbox.disablePageUpdate = false;
    
            Toolbox.initTooltips();
        });
    }

    /**
     * This method initializes all Bootstrap tooltips
     */
    static initTooltips() {
        document.querySelectorAll("[data-bs-toggle='tooltip']").forEach((el) => new bootstrap.Tooltip(el));
    }
}