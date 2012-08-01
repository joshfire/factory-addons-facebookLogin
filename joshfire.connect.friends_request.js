define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {
        FB.ui({method: 'apprequests',
          message: 'Viens jouer au bingo !'
        }, function(){});
        return successCallback(intent.data);
      }
    };
  };
});