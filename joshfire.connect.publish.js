/* useful data to pass with this intent :
 * link, picture, name, caption, description
 */
define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {
        var obj = {
          method: 'feed',
          link: intent.data.link ? intent.data.link : '',
          picture: intent.data.picture ? intent.data.picture : '',
          name: intent.data.name ? intent.data.name : '',
          caption: intent.data.caption ? intent.data.caption : '',
          description: intent.data.description ? intent.data.description : ''
        };

        FB.ui(obj, function(){
          return successCallback(intent.data);
        });
      }
    };
  };
});