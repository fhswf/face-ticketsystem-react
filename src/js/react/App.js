import React, {Component} from "react";

import {BrowserRouter, Redirect, Route, Switch, useParams} from "react-router-dom";
import {ActionCreators} from "../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoginView from "./views/LoginView";
import Navigation from "./views/Navigation";
import VisitorForm from "./views/forms/VisitorForm";
import UserDisclosures from "./views/UserDisclosures";
import {emptyVisitorDisclosure} from "../redux/reducers/VisitorDisclosureReducers";

const __webpack_public_path__ = process.env.ASSET_PATH;

class App extends Component {
    constructor(props) {
        super(props);
        this._renderNewVisitorDisclosure = this._renderNewVisitorDisclosure.bind(this);
    }

    _renderNewVisitorDisclosure() {
        console.log("Entering");
        this.props.setVisitorDisclosure(emptyVisitorDisclosure);
        return <VisitorForm/>
    }

    render() {
        // return <BrowserRouter id='browser-router' basename={process.env.ASSET_PATH}>
        return <BrowserRouter id='browser-router'>
            <Navigation/>
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
                        <h1>TEST</h1>
                    </Route>
                    <Route exact path="/disclosures">
                        {
                            !this.props.user.data.loggedIn && <Redirect to="/login"/>
                        }
                        <UserDisclosures/>
                    </Route>
                    <Route exact path="/disclosures/add-visitor" render={this._renderNewVisitorDisclosure}/>
                    <Route exact path="/disclosures/visitor">
                        <VisitorForm readOnly={true}/>
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
