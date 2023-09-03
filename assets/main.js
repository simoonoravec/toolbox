$(function() {
    $("#loading").show();

    document.addEventListener("htmx:responseError", function(evt) {
        Toolbox.showError();
    });

    document.addEventListener("htmx:beforeSwap", function(evt) {
        if (evt.detail.requestConfig.parameters.noUnregisterEvents) {
            return;
        }

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