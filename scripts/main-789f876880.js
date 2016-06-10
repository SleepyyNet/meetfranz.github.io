$(function() {
    var parser = new UAParser(),
    result = parser.getResult(),
    arch = "32bit",
    name,
    icon,
    href,
    elem = $(".btn-primary-download");

    if (result.cpu.architecture == "amd64") {
        arch = "64bit";
    }

    if (result.os.name == "Windows") {
        name = "Windows";
        icon = "windows";
        if (arch == "64bit") {
            href = window.download.win64;
        } else {
            href = window.download.win32;
        }
    } else if (result.os.name == "Ubuntu") {
        name = "Ubuntu";
        icon = "linux";
        if (arch == "64bit") {
            href = window.download.lin64;
        } else {
            href = window.download.lin32;
        }
    } else if (result.os.name == "Mac OS") {
        name = "Mac";
        icon = "apple";
        href = window.download.osx;
    } else {
        name = "your platform";
        icon = "download";
        href = "#download_all";
    }

    elem.find(".fa").attr("class", "").addClass("fa fa-" + icon)
    elem.find("#os_name").text(name);
    elem.attr("href", href);

    elem.click(function() {
        var archLabel = "";
        if(name == "Windows" || name == "Ubuntu") {
            archLabel = " (" + arch + ")";
        }
        GAEvent("Download", "download_preselect", "Download " + name + archLabel);
    });

    $("#windows-select").on("change", function(e) {
        $("#windows-download-link").attr("href", $("#windows-select option:selected").val())
    });

    $("#linux-select").on("change", function(e) {
        $("#linux-download-link").attr("href", $("#linux-select option:selected").val())
    });


    /* GA events */
    $("#windows-download-link").click(function() {
        var arch = $("#windows-select option:selected").data("arch");
        GAEvent("Download", "download_selection", "Download Windows " + arch);
    });

    $("#linux-download-link").click(function() {
        var arch = $("#linux-select option:selected").data("arch");
        GAEvent("Download", "download_selection", "Download Linux " + arch);
    });

    $("#mac-download-link").click(function() {
        GAEvent("Download", "download_selection", "Download Mac");
    });

    $("#mc-embedded-subscribe-form").submit(function() {
        GAEvent("Newsletter", "newsletter_signup", "Newsletter signup");
    });


    var newsletterClosed = false;
    $(window).scroll(function(e) {
        var distance = $(this).scrollTop();

        if(!newsletterClosed) {
            if(distance >= 640 && !$(".newsletter-container").hasClass("newsletter-floating")) {
                $(".newsletter-container").addClass("move newsletter-floating");

                window.setTimeout(function() {
                    $(".newsletter-container").removeClass("move");
                }, 10);

                GAEvent("Newsletter", "newsletter_open", "Open Newsletter Overlay (automatically)");

            } else if(distance <= 560 && $(".newsletter-container").hasClass("newsletter-floating")) {
                $(".newsletter-container").addClass("move");

                window.setTimeout(function() {
                    $(".newsletter-container").removeClass("move newsletter-floating");
                }, 1000);

                newsletterClosed = true;
            }
        }
    });

    $("#closeNewsletterOverlay").click(function(e) {
        e.preventDefault();

        $(".newsletter-container").addClass("move");

        window.setTimeout(function() {
            $(".newsletter-container").removeClass("move newsletter-floating");
        }, 1000);

        newsletterClosed = true;

        GAEvent("Newsletter", "newsletter_close", "Close Newsletter Overlay (user action)");
    });
});

function GAEvent(category, action, label) {
    return ga('send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
    });
}
