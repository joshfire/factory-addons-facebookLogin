define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {
        FB.logout();
        return successCallback(intent.data);
      }
    };
  };
});