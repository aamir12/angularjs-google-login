// essential reads:
// http://stackoverflow.com/a/13016081/1161948
// https://developers.google.com/identity/sign-in/web/backend-auth#send-the-id-token-to-your-server

var app = angular.module('ga',[]);

app.controller('gac', function($scope, $window) {
    
    var auth2;
    $scope.notLoggedIn= false;
    $scope.user = {};
    $window.appStart = function() {
        console.log('appStart()');
        gapi.load('auth2', initSigninV2);
    };

    var initSigninV2 = function() {
        console.log('initSigninV2()');
        auth2 = gapi.auth2.getAuthInstance();
        auth2.isSignedIn.listen(signinChanged);
        auth2.currentUser.listen(userChanged);

        if(auth2.isSignedIn.get() == true) {
            auth2.signIn();
        }
    };

    var signinChanged = function(isSignedIn) {
        console.log('signinChanged() = ' + isSignedIn);
        console.log(isSignedIn);
        if(isSignedIn) {
            console.log('the user must be signed in to print this');
            var googleUser = auth2.currentUser.get();
            var authResponse = googleUser.getAuthResponse();
            var profile = googleUser.getBasicProfile();
            $scope.user.id          = profile.getId();
            $scope.user.fullName    = profile.getName();
            $scope.user.firstName   = profile.getGivenName();
            $scope.user.lastName    = profile.getFamilyName();
            $scope.user.photo       = profile.getImageUrl();
            $scope.user.email       = profile.getEmail();
            $scope.user.domain      = googleUser.getHostedDomain();
            $scope.user.timestamp   = moment().format('x');
            $scope.user.idToken     = authResponse.id_token;
            $scope.user.expiresAt   = authResponse.expires_at;
            $scope.notLoggedIn= false;
            $scope.$digest();
        } else {
            console.log('the user must not be signed in if this is printing');
            $scope.user = {};
            $scope.notLoggedIn= true;
            $scope.$digest();
        }
    };

    var userChanged = function(user) {
        console.log('userChanged()');
        console.log(user);
       
        if(auth2.isSignedIn.get() == false) {
            signinChanged(false);
        }
    };
    
    $scope.signOut = function() {
        console.log('signOut()');
        auth2.signOut().then(function() {
            signinChanged(false);  

        });
        console.log(auth2);
    };
    
    $scope.disconnect = function() {
        console.log('disconnect()');
        auth2.disconnect().then(function() {
            signinChanged(false);
        });
        console.log(auth2);
    };
});

