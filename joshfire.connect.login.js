define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {
        FB.login(null, {scope: 'email'});
        return successCallback(intent.data);
      }
    };
  };
});