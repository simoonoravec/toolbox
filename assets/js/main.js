//Run when the page has finished loading
$(function() {
    Toolbox.setDarkMode(Toolbox.getDarkMode()); //Set the page color mode

    //Register global events
    $(window).on("hashchange", Toolbox.updatePage);
    $("#darkmode-switch").on("click", Toolbox.toggleDarkMode);

    Toolbox.registerHTMXevents();
    //

    $("#loading").show(); //Show loading

    Toolbox.initTooltips(); //Initialize Bootstrap tooltips

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