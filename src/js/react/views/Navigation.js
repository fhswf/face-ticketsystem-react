import React, {Component} from "react";
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

class Navigation extends Component {

    constructor(props) {
        super(props);
        this._logout = this._logout.bind(this);
        this.state = {
            activeLink: "home"
        }
    }

    _logout() {
        this.props.logout()
            .then(() => {
                return this.props.history.push("/");
            });
    }

    render() {
        return (
            <Navbar bg="light" variant="pills" className="d-flex rounded mb-5">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav variant="pills" activeKey={this.state.activeLink} onSelect={key => this.setState({activeLink: key})} className="">
                    <Nav.Link onSelect={() => this.props.history.push("/")} eventKey="home" className="align-self-center">
                        {I18n.t('nav.home')}
                    </Nav.Link>
                    {
                        (this.props.user.data.loggedIn) &&
                        <Nav.Link onSelect={() => this.props.history.push("/tickets")} eventKey="tickets" className="align-self-center">
                            {I18n.t('nav.tickets')}
                        </Nav.Link>
                    }
                    {
                        (this.props.user.data.loggedIn) &&
                        <NavDropdown title={I18n.t('nav.disclosures')} id="basic-navbar-nav" className="ml-auto align-self-center">
                            <NavDropdown.Item onSelect={() => { this.props.history.push("/disclosures") }} eventKey="showDisclosures">
                                {I18n.t('nav.showDisclosures')}
                            </NavDropdown.Item>
                            <NavDropdown.Item onSelect={() => { this.props.history.push("/disclosures/add-visitor") }} eventKey="createDisclosure">
                                {I18n.t('nav.addVisitorDisclosure')}
                            </NavDropdown.Item>
                        </NavDropdown>
                    }
                    {
                        (this.props.user.data.loggedIn) &&
                        <NavDropdown title={I18n.t('nav.account')} id="basic-navbar-nav" className="ml-auto align-self-center">
                            <NavDropdown.Item onSelect={() => { this.props.history.push("/account") }} eventKey="showaccount">
                                {I18n.t('nav.showaccount')}
                            </NavDropdown.Item>
                            <NavDropdown.Item onSelect={() => { this.props.history.push("/account/edit") }} eventKey="editaccount">
                                {I18n.t('nav.editaccount')}
                            </NavDropdown.Item>
                            <NavDropdown.Item onSelect={this._logout} eventKey="logout">
                                {I18n.t('nav.logout')}
                            </NavDropdown.Item>
                        </NavDropdown>
                    }
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));