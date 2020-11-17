import React, {Component} from "react";

import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {ActionCreators} from "../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class App extends Component {
    render() {
        return <div id="page">
            <BrowserRouter>
                <main>
                    <Switch>
                        <Route path="/login">
                            <h1>TODO: Replace me with highorder component</h1>
                        </Route>
                        <Route path="/">
                            <Redirect to="/login" />
                        </Route>
                    </Switch>
                </main>
            </BrowserRouter>
        </div>
    }
}

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
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
