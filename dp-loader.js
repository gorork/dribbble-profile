(function () {

  var dribbbleProfile, dribbbleId, script;


  //
  // Load stylesheet

  dpAddStylesheet('//nadikun.com/code/dribbble-profile/style.min.css');
  dpAddStylesheet('//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css');


  //
  // Create top-level element for Dribble Profile

  dribbbleProfile = document.createElement('div');
  dribbbleProfile.setAttribute('id', 'dribbble-profile');

  script = document.querySelector("[data-dribbble-id]");
  dribbbleId = script.getAttribute('data-dribbble-id');
  script.parentNode.insertBefore(dribbbleProfile, script);

  dribbbleProfile.innerHTML = '<div id="dp-left-profile"></div>' +
                              '<div id="dp-right-shot"></div>';


  //
  // Get profile details

  sendJsonp('http://api.dribbble.com/players/' + dribbbleId + '?callback=displayProfile', {
    callbackName: 'displayProfile',
    onSuccess: displayProfile,
    onTimeout: displayProfile,
    timeout: 5
  });


  //
  // Get the last published shot

  sendJsonp('http://api.dribbble.com/players/' + dribbbleId + '/shots?callback=displayLastShot', {
    callbackName: 'displayLastShot',
    onSuccess: displayLastShot,
    onTimeout: displayLastShot,
    timeout: 5
  });


  //
  // Display Profile

  function displayProfile(response) {
    var profileTop, profileMid, profileBottom, h3, location;

    profileTop = '<div id="dp-profile-top">' +
                    '<h3>' + response.name + '</h3>' +
                    '<p><i class="fa fa-map-marker"></i> ' + response.location + '</p>' +
                  '</div>';

    profileMid = '<div id="dp-profile-mid">' +
                    '<a href="' + response.url + '">' +
                      '<img src="' + response.avatar_url + '" alt="">' +
                    '</a>' +
                  '</div>';

    profileBottom = '<ul id="dp-profile-bottom">' +
                      '<li class="dp-stat"><i class="fa fa-dribbble"></i><br><b>' + response.shots_count + '</b></li>' +
                      '<li class="dp-stat"><i class="fa fa-heart-o"></i><br><b>' + response.likes_received_count + '</b></li>' +
                      '<li class="dp-stat"><i class="fa fa-hand-spock-o"></i><br><b>' + response.followers_count + '</b></li>' +
                    '</ul>';

    dribbbleBall = '<p id="dp-ball" class="fa fa-dribbble"></p>';

    document.getElementById('dp-left-profile').innerHTML = profileTop + profileMid + profileBottom + dribbbleBall;

    h3 = document.querySelector('#dp-profile-top h3');
    location = document.querySelector('#dp-profile-top p');

    //
    // If name and/or location are too long,
    // reduce their font size

    checkNameLength(response, h3);
    checkLocationLength(response, location);
  }


  //
  // Display last shot

  function displayLastShot(response) {

    var lastShotData = response.shots[0];
    var lastShotEl = '<a href="' + lastShotData.url + '">' +
                        '<img src="' + lastShotData.image_url + '" alt="' + lastShotData.title + '">' +
                      '</a>';

    document.getElementById('dp-right-shot').innerHTML = lastShotEl;
  }


  //
  // Check name and location length

  function checkNameLength(response, el) {
    var n = response.name.length;

    switch (true) {
      case (n > 15 && n <= 20):
        el.className = el.className + " font-18";
        break;
      case (n > 20 && n <= 25):
        el.className = el.className + " font-16";
        break;
      case (n > 25 && n <= 30):
        el.className = el.className + " font-14";
        break;
      case (n > 30):
        el.className = el.className + " font-10";
        break;
      default: // do nothing
    }
  }


  //
  // Check location length

  function checkLocationLength(response, el) {
    var l = response.location.length;
    console.log('l', l);

    switch (true) {
      case (l > 20 && l <= 29):
        el.className = el.className + " font-12";
        break;
      case (l > 29 && l <= 40):
        el.className = el.className + " font-10";
        break;
      case (l > 40):
        el.className = el.className + " font-8";
        break;
      default: // do nothing
    }
  }


  // Create stylesheet

  function dpAddStylesheet(src) {
    var header, dpStylesheet;

    header = document.getElementsByTagName('head').item(0);

    dpStylesheet = document.createElement('link');
    dpStylesheet.rel = 'stylesheet';
    dpStylesheet.href = src;

    header.appendChild(dpStylesheet);
  }


  // Send JSONP request

  function sendJsonp(src, options) {
    var options = options || {},
      callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function () {},
      on_timeout = options.onTimeout || function () {},
      timeout = options.timeout || 10;

    var timeout_trigger = window.setTimeout(function () {
      window[callback_name] = function () {};
      on_timeout();
    }, timeout * 1000);

    window[callback_name] = function (data) {
      window.clearTimeout(timeout_trigger);
      on_success(data);
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
  }

})();