/* fbconnect uses an intent structure, because we need to pass callback functions
 * from the template to the addon : 
 * - onLogin(userData)
 * - onLogout()
 * - onInitialStatusCheck(status, userData)
 * there is also a device field in the intent data, which lets us make the right calls depending
 * on whether we are using the FB JS SDK or the 
 */

define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {

        /* fetches connected user infos from FB 
         * intent callback is called with current user 
         * fb data (augmented with picture)
         */
        var fetchCurrentUser = function(callback){
          FB.api("/me", {
            'fields': 'email, first_name, last_name, name, id, username'
            }, 
            function (currentUser) {
              callback(null, currentUser);
            }
          );
        };

        /* fetches connected user friends list from FB 
         */
        var fetchFriends = function(callback){
          FB.api("/me/friends", function(friends) {
            callback(null, friends);
          });
        };

        var subscribeToFBEvents = function() {
          /* subscribe to login & logout events, and bind callbacks specified
           * by the caller intent
           */
          FB.Event.subscribe('auth.login', function (response) {
            if (intent.data.onLogin) {
              fetchCurrentUser(function (err, user) {
                 intent.data.onLogin(user);
              });
            }
          });

          FB.Event.subscribe('auth.logout', function (response) {
            if (intent.data.onLogout) intent.data.onLogout();
          });

          /* on page load, check login status and call intent event callback 
           * the callback function is called with fetched status and current 
           * user data if connected
           * it seems to be needed only for desktop
           */
          FB.getLoginStatus(function (response) {
            // var uid = response.authResponse.userID;
            // var accessToken = response.authResponse.accessToken;
            if (intent.data.onInitialStatusCheck) {
              if (response.status == "connected") {
                fetchCurrentUser(function (err, user) {
                  if (!err) {
                    intent.data.onInitialStatusCheck(response.status, user);
                  } else {
                    console.log("error on fetchCurrentUser");
                  }
                });
              } else {
                intent.data.onInitialStatusCheck(response.status, {});
              }
            }
          }, true);

        };

        if (!intent.data.device || intent.data.device == "desktop") {

          /* This function is a callback to the FB SDK loading 
           */
          window.fbAsyncInit = function() {
            /* init the widget with app specific parameters
             */
            FB.init({
              appId      : config.options.fbAppId, // App ID
              channelUrl : (config.options.fbChannelUrl ? config.options.fbChannelUrl : ''), // Channel File
              status     : true, // check login status<
              cookie     : true, // enable cookies to allow the server to access the session
              xfbml      : true // parse XFBML
            });
            subscribeToFBEvents();
          };

          // Loads the FB SDK Asynchronously
          (function(d){
             var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement('script'); js.id = id; js.async = true;
             js.src = "//connect.facebook.net/en_US/all.js";
             ref.parentNode.insertBefore(js, ref);
           }(document));
          
        }
        else if (intent.data.device == "smartphone" || intent.data.device == "tablet") {

          if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
          if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included pg-plugin-fb-connect.js correctly');
          if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
          
          document.addEventListener('deviceready', function() {
            try {
              FB.init({
                appId: config.options.fbAppId, // App ID
                channelUrl: (config.options.fbChannelUrl ? config.options.fbChannelUrl : ''), // Channel File
                nativeInterface: CDV.FB,
                status     : true, // check login status<
                cookie     : true, // enable cookies to allow the server to access the session
                useCachedDialogs: false,
                xfbml: true // parse XFBML
              });
              subscribeToFBEvents();
            } catch (e) {
              alert(e);
            }
          }, false);
        }
      
        return successCallback(intent.data);
      }
    };
  };
});