import React, {Component} from 'react';
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Row, Col, Form, Button, Table, Modal} from "react-bootstrap";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import config from "../../config/Config";
import TicketBox from "../components/TicketBox";

class TicketsView extends Component {
    constructor(props) {
        super(props);
        this._renderTickets = this._renderTickets.bind(this);
        this.state = {
            currentTicket: ''
        }
    }

    componentDidMount() {
        this.props.fetchTickets();
    }

    _renderTickets() {
        if (!this.props.ticketList)
            return <></>;
        return this.props.ticketList.map(ticket => {
            return <TicketBox key={ticket._id} ticket={ticket} />
        })
    }

    render() {
        return <Container>
            <Row>
                <Col className="d-flex justify-content-center">
                    <h1>{I18n.t('header.ticket.availableTickets')}</h1>
                </Col>
            </Row>
            <Row className="d-flex flex-wrap">
                {this._renderTickets()}
            </Row>
        </Container>
    }
}


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        user: state.user,
        ticketList: state.ticketList.items
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TicketsView));