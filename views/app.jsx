'use strict'

var React = require('react');
var googleApiLoader = require('../actions/GoogleAPILoader');
var $ = require('jquery');


module.exports = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        var _this = this;

        googleApiLoader.authLoaded(function () {
            _this.setState({authLoaded: true});

            googleApiLoader.getAuth2().currentUser.listen(function (user) {
                _this.setState({finishedLoading: true});
                if (user.getBasicProfile()) {
                    var profile = user.getBasicProfile();
                    var profileProxy = {};
                    profileProxy.id = profile.getId();
                    profileProxy.name = profile.getName();
                    profileProxy.thumb = profile.getImageUrl();
                    profileProxy.email = profile.getEmail();
                    var token = user.po.access_token
                    // var urlLocation = 'spreadsheets/d/1IMnGdtXUUPK_VQWIZTsiGn8xFiDOE6PF4rVmcF6eOEU/edit#gid=1272458453'
                    // var url = 'https://spreadsheets.google.com/feeds/list/1IMnGdtXUUPK_VQWIZTsiGn8xFiDOE6PF4rVmcF6eOEU/1/private/full?alt=json-in-script&access_token=' + token;
                    
                    _this.setState({loggedInUser: profileProxy});
                }
                _this.setState({isLoggedIn: user.getBasicProfile() ? true : false});
            });
        });

        googleApiLoader.clientsLoaded(function () {
            _this.setState({clientsLoaded: true});
        });
    },
    toggleSignIn: function () {
        if (!googleApiLoader.getAuth2().isSignedIn.get())
            googleApiLoader.signIn();
    },
    getSheets() {
        var urlLocation = '1IMnGdtXUUPK_VQWIZTsiGn8xFiDOE6PF4rVmcF6eOEU'; 
        var url = 'https://spreadsheets.google.com/feeds/list/' + urlLocation + '/od6/public/values?alt=json';

        console.log(url);
        $.get(url, function(data) {
            console.log(data);
        });
    },
    render: function () {

        var loggedInUserThumb = null;

        if (this.state.loggedInUser)
            loggedInUserThumb = <img src={this.state.loggedInUser.thumb} />

        var toggleLoginButton = <button onClick={this.toggleSignIn}>Login to Google</button>

        if (this.state.finishedLoading) {

            if (this.state.isLoggedIn) {

                return <div>
                {loggedInUserThumb}
                {this.state.loggedInUser.name}
                    <hr />
                    Authorized.
                    <button onClick={this.getSheets}>Get Sheets</button>
                </div>
            }
            else
                return toggleLoginButton;
        }
        else {
            return <div>Loading...</div>
        }
    }
});
