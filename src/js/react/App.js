import React, { Component } from "react";

import { BrowserRouter, Redirect, Route, Switch, useParams } from "react-router-dom";
import { ActionCreators } from "../redux/actions/ActionCreators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoginView from "./views/LoginView";
import Navigation from "./views/Navigation";
import VisitorForm from "./views/forms/VisitorForm";
import ContractorForm from "./views/forms/ContractorForm";
import UserDisclosures from "./views/UserDisclosures";
import { emptyVisitorDisclosure, emptyContractorDisclosure } from "../redux/reducers/DisclosureReducers";
import TicketForm from "./views/forms/TicketForm";
import EditAccount from "./views/EditAccount";
import TicketsView from "./views/TicketsView";

const __webpack_public_path__ = process.env.ASSET_PATH;

class App extends Component {
    constructor(props) {
        super(props);
        this._renderNewVisitorDisclosure = this._renderNewVisitorDisclosure.bind(this);
        this._renderNewContractorDisclosure = this._renderNewContractorDisclosure.bind(this);
        this._renderEditAccount = this._renderEditAccount.bind(this);
    }

    _renderNewVisitorDisclosure() {
        this.props.setVisitorDisclosure(emptyVisitorDisclosure);
        return (<VisitorForm />)
    }

    _renderNewContractorDisclosure() {
        this.props.setContractorDisclosure(emptyContractorDisclosure);
        return <ContractorForm />
    }

    _renderEditAccount(readOnly = false) {
        this.props.setUser(this.props.user.data.value);
        return <EditAccount readOnly={readOnly} />
    }

    render() {
        // return <BrowserRouter id='browser-router'>
        return <BrowserRouter id='browser-router' basename={process.env.ASSET_PATH}>
            <Navigation />
            <main>
                <Switch>
                    <Route path="/login">
                        {
                            this.props.user.data.loggedIn && <Redirect to="/home" />
                        }
                        <LoginView />
                    </Route>

                    <Route path="/home">
                        {
                            !this.props.user.data.loggedIn && <Redirect to="/login" />
                        }
                        <TicketsView />
                    </Route>

                    <Route exact path="/tickets" render={() => {
                        return <TicketsView />
                    }} />
                    <Route exact path="/tickets/add-ticket" render={() => {
                        this.props.resetTicket();
                        return <TicketForm />
                    }} />

                    <Route exact path="/disclosures">
                        {
                            !this.props.user.data.loggedIn && <Redirect to="/login" />
                        }
                        <UserDisclosures />
                    </Route>
                    <Route exact path="/disclosures/add-visitor" render={this._renderNewVisitorDisclosure} />
                    <Route exact path="/disclosures/add-contractor" render={this._renderNewContractorDisclosure} />
                    <Route exact path="/disclosures/visitor">
                        <VisitorForm readOnly={true} />
                    </Route>
                    <Route exact path="/disclosures/contractor">
                        <ContractorForm readOnly={true} />
                    </Route>

                    <Route exact path="/account" render={() => this._renderEditAccount(true)} />
                    <Route exact path="/account/edit" render={() => this._renderEditAccount(false)} />

                    <Route path="/">
                        {
                            this.props.user.data.loggedIn && <Redirect to="/home" />
                        }
                        {
                            !this.props.user.data.loggedIn && <Redirect to="/login" />
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
