//Run when the page has finished loading
$(function() {
    //Set the page color mode
    Toolbox.setDarkMode(Toolbox.getDarkMode());

    //Register events
    $(window).on("hashchange", Toolbox.updatePage);
    $("#darkmode-switch").on("click", Toolbox.toggleDarkMode);

    //Register HTMX events
    document.addEventListener("htmx:responseError", function(evt) {
        Toolbox.showError();
    });

    document.addEventListener("htmx:beforeSwap", function(evt) {
        if (evt.detail.requestConfig.parameters.noUnregisterEvents) {
            return;
        }

        Toolbox.unregisterEvents();
    });

    document.addEventListener("htmx:afterSwap", function(evt) {
        Toolbox.disablePageUpdate = false;

        initTooltips();
    });

    //Show loading
    $("#loading").show();

    //Initialize Bootstrap tooltips
    initTooltips();

    //Generate navigation bar
    Toolbox.generateNavbar().then(() => {
        htmx.process(".nav");
        Toolbox.registerNavbarEvents();

        setTimeout(() => {
            Toolbox.updatePage();

            $("#loading").fadeOut(300);
            $("#app").delay(100).fadeIn(300);
        }, 100);
    }).catch(() => Toolbox.showError());
});

const initTooltips = () => document.querySelectorAll("[data-bs-toggle='tooltip']").forEach((el) => new bootstrap.Tooltip(el));