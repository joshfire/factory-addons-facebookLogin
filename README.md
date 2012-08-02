# Factory Addon for Facebook Connect

Defines three hooks / intents : 
* *init* : asynchronously loads the FB SDK, inits the FB App, and binds callbacks to several events (onLogin, onLogout, onInitialStatusCheck)
* *logout* : Triggers logout from Facebook
* *friends-request* : Lets user invite friends
* *publish* : Publish a post on the wall.

There's no need for a 'login' intent, since the FB SDK Loading automatically creates a FB Login button in the DOM. The login action isn't manually triggered, as opposed to the others. (it could be though).