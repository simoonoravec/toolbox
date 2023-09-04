$(function() {
    Toolbox.setDarkMode(Toolbox.getDarkMode());
    $("#darkmode-switch").on("click", Toolbox.toggleDarkMode);

    $(window).on("hashchange", Toolbox.updatePage);

    $("#loading").show();
    initTooltips();

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