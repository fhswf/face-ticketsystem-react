import React, {Component} from 'react';
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import TicketBox from "../components/TicketBox";

/**
 * A high order Component for displaying every ticket available.
 */
class TicketsView extends Component {
    /**
     * Create a new TIcketsView Component.
     * @param props The properties of the Component.
     */
    constructor(props) {
        super(props);
        this._renderTickets = this._renderTickets.bind(this);
        this.state = {
            currentTicket: ''
        }
    }

    /**
     * React lifecycle method, used to fetch the tickets.
     */
    componentDidMount() {
        this.props.fetchTickets();
    }

    /**
     * Render all the tickets as a <TicketBox>.
     * @returns {*} The TicketBoxes to be rendered.
     * @private
     */
    _renderTickets() {
        if (!this.props.ticketList)
            return <></>;
        return this.props.ticketList.map(ticket => {
            return <TicketBox key={ticket._id} ticket={ticket} />
        })
    }

    /**
     * Render the TicketsView Component.
     * @returns {*} The Component to be renderd.
     */
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