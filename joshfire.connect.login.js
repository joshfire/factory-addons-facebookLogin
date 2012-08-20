define([], function () {
  return function (config) {
    return {
      startActivity: function (intent, successCallback, failureCallback) {
        FB.login(function(){}, {scope: 'email'});
        return successCallback(intent.data);
      }
    };
  };
});