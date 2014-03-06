/* This is JavaScript code that works with jQuery, jQuery UI and Jribbble libraries.
Please don't forget to download them and put in the same folder with other Dribbble Profile files. */

$(document).ready(function(){

    /* Let's render your profile */

    $.jribbble.getPlayerById ('rork', function (player) {  /* Change 'rork' to your dribbble username in this line */

        var html = [];

        html.push('<div id="check-name"><h3 id="name">' + player.name + '</h3>');
        html.push('<p id="location"><i class="fa fa-map-marker"> </i> ' + player.location + '</p></div>');
        html.push('<div id="static"><a href="' + player.url + '"><img src="' + player.avatar_url + '" class="avatar" alt=""></a>');
        html.push('<ul><li class="stat"><i class="fa fa-dribbble icons"></i><br><b>' + player.shots_count + '</b></li>');
        html.push('<li class="stat"><i class="fa fa-heart icons"></i><br><b>' + player.likes_received_count + '</b></li>');
        html.push('<li class="stat" id="last"><i class="fa fa-beer icons"></i><br><b>' + player.followers_count + '</b></li></ul></div>');

        $('#playerProfile').html(html.join(''));

        /* If your name or location is too long, we reduce their font size */

        var l = player.location.length;
        var n = player.name.length;
        if (n <= 15) {
            //do nothing
        } else if (n > 15 && n <= 20){
            $("#container #name").css("font-size", "18px");
        } else if (n > 20 && n <=25){
            $("#container #name").css("font-size", "16px");
        } else if (n > 25 && n <= 30){
            $("#container #name").css("font-size", "14px");
        } else if (n > 30){
            $("#container #name").css("font-size", "10px");
        }

        if (l <= 20) {
            //do nothing
        } else if (l > 20 && l <= 29){
            $("#container #location").css("font-size", "12px");
        } else if (l > 29 && l <= 40){
            $("#container #location").css("font-size", "10px");
        } else {
            $("#container #location").css("font-size", "8px");
        }

        /* End of reducing font size */

    }),


    $.jribbble.getShotsByPlayerId('rork', function (playerShots) {  /* Change 'rork' to your dribbble username in this line */
              var html = [];

               $.each(playerShots.shots, function (i, shot) {

                 html.push('<a href="' + shot.url + '">');
                 html.push('<img src="' + shot.image_url + '" ');
                 html.push('alt="' + shot.title + '" class="image"></a>');
               });

               $('#lastShot').html(html.join(''));

    }, {page: 1, per_page: 1})

});

