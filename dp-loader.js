(function () {

  var dribbbleProfile, dribbbleId, script,
      apiEndpoint = 'https://api.dribbble.com/v1/',
      token = '';

  //
  // Load stylesheet

  dpAddStylesheet('//nadikun.com/code/dribbble-profile/style.css'); // style.css
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

  sendJsonp(apiEndpoint + 'users/' + dribbbleId + '?callback=displayProfile&access_token=' + token, {
    callbackName: 'displayProfile',
    onSuccess: displayProfile,
    onTimeout: displayProfile,
    timeout: 5
  });


  //
  // Get the last published shot

  sendJsonp(apiEndpoint + 'users/' + dribbbleId + '/shots?callback=displayLastShot&access_token=' + token, {
    callbackName: 'displayLastShot',
    onSuccess: displayLastShot,
    onTimeout: displayLastShot,
    timeout: 5
  });


  //
  // Display Profile

  function displayProfile(response) {
    var profileTop, profileMid, profileBottom, h3, location,
        data = response.data;

    profileTop = '<div id="dp-profile-top">' +
                    '<h3>' + data.name + '</h3>' +
                    '<p><i class="fa fa-map-marker"></i> ' + data.location + '</p>' +
                  '</div>';

    profileMid = '<div id="dp-profile-mid">' +
                    '<a href="' + data.html_url + '">' +
                      '<img src="' + data.avatar_url + '" alt="">' +
                    '</a>' +
                  '</div>';

    profileBottom = '<ul id="dp-profile-bottom">' +
                      '<li class="dp-stat"><i class="fa fa-dribbble"></i><br><b>' + data.shots_count + '</b></li>' +
                      '<li class="dp-stat"><i class="fa fa-heart-o"></i><br><b>' + data.likes_received_count + '</b></li>' +
                      '<li class="dp-stat"><i class="fa fa-hand-spock-o"></i><br><b>' + data.followers_count + '</b></li>' +
                    '</ul>';

    dribbbleBall = '<p id="dp-ball" class="fa fa-dribbble"></p>';

    document.getElementById('dp-left-profile').innerHTML = profileTop + profileMid + profileBottom + dribbbleBall;

    h3 = document.querySelector('#dp-profile-top h3');
    location = document.querySelector('#dp-profile-top p');

    //
    // If name and/or location are too long,
    // reduce their font size

    checkNameLength(data, h3);
    checkLocationLength(data, location);
  }


  //
  // Display last shot

  function displayLastShot(response) {
    var lastShotImg, lastShotEl,
        lastShotData = response.data[0];

    lastShotImg = lastShotData.images.hidpi ? lastShotData.images.hidpi : lastShotData.images.normal;
    lastShotEl = '<a href="' + lastShotData.html_url + '">' +
                    '<img src="' + lastShotImg + '" alt="' + lastShotData.title + '">' +
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

  function sendJsonp(src, opt) {
    var options = opt || {},
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