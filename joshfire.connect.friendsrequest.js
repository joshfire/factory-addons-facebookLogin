define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {
        var fbTo = "";
        if(intent.data.facebookIds && intent.data.facebookIds.length > 0) {
          fbTo = intent.data.facebookIds.join(",");
        }
        FB.ui({method: 'apprequests',
          message: intent.data.message,
          to: fbTo
        }, function(){});
        return successCallback(intent.data);
      }
    };
  };
});