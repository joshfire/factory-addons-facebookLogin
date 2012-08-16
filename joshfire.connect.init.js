/* fbconnect uses an intent structure, because we need to pass callback functions
 * from the template to the addon : 
 * - onLogin(userData)
 * - onLogout()
 * - onInitialStatusCheck(status, userData)
 */

define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {

        /* This function is a callback to the FB SDK loading 
         */
        window.fbAsyncInit = function() {

          /* init the widget with app specific parameters
           */
          FB.init({
            appId      : config.options.fbAppId, // App ID
            channelUrl : (config.options.fbChannelUrl ? config.options.fbChannelUrl : ''), // Channel File
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true // parse XFBML
          });

          /* subscribe to login & logout events, and bind callbacks specified
           * by the caller intent
           */
          FB.Event.subscribe('auth.login', function(response) {
            if(intent.data.onLogin){
              fetchCurrentUser(function(err, user) {
                 intent.data.onLogin(user);
              });
            }
          });
          FB.Event.subscribe('auth.logout', function(response) {
            if(intent.data.onLogout) intent.data.onLogout();
          });

          /* on page load, check login status and call intent event callback 
           * the callback function is called with fetched status and current 
           * user data if connected
           */
          FB.getLoginStatus(function(response) {
            // var uid = response.authResponse.userID;
            // var accessToken = response.authResponse.accessToken;
            if(intent.data.onInitialStatusCheck){
              if(response.status == "connected"){
                fetchCurrentUser(function(err, user){
                  intent.data.onInitialStatusCheck(response.status, user);
                });
              } else {
                intent.data.onInitialStatusCheck(response.status, {});
              }
            }
          });

          /* fetches connected user infos from FB 
           * intent callback is called with current user 
           * fb data (augmented with picture)
           */
          var fetchCurrentUser = function(callback){
            FB.api("/me", function(currentUser){
              FB.api("/me/picture", function(picture){
                currentUser.picture = picture.data.url;
                callback(null, currentUser);
              });
            });
          };

          /* fetches connected user friends list from FB 
           */
          var fetchFriends = function(callback){
            FB.api("/me/friends", function(friends) {
              callback(null, friends);
            });
          };

        };

        // Loads the FB SDK Asynchronously
        (function(d){
           var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = "//connect.facebook.net/en_US/all.js";
           ref.parentNode.insertBefore(js, ref);
         }(document));

        return successCallback(intent.data);
      }
    };
  };
});