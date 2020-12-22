import React, {Component} from "react";

import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {ActionCreators} from "../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoginView from "./views/LoginView";
import Navigation from "./views/Navigation";
import config from '../config/Config';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <BrowserRouter id='browser-router' basename={config.basepath}>
            <Navigation />
            <main>
                <Switch>
                    <Route path="/login">
                        {
                            this.props.user.data.loggedIn && <Redirect to="/home"/>
                        }
                        <LoginView/>
                    </Route>
                    <Route path="/home">
                        {
                            !this.props.user.data.loggedIn && <Redirect to="/login"/>
                        }
                        <div>
                            <h1>TEST</h1>
                        </div>
                    </Route>
                    <Route path="/">
                        {
                            this.props.user.data.loggedIn && <Redirect to="/home"/>
                        }
                        {
                            !this.props.user.data.loggedIn && <Redirect to="/login"/>
                        }
                    </Route>
                </Switch>
            </main>
        </BrowserRouter>
    }
}

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        user: state.user
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
