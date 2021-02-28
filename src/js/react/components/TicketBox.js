import React, {Component} from 'react'
import {I18n} from 'react-redux-i18n';
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";

/**
 * A simple component to render Ticket information.
 */
class TicketBox extends Component {
    /**
     * Create a new TicketBox.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
    }

    /**
     * Determine the price to be displayed.
     * @returns {string} The readable price.
     * @private
     */
    _getPrice() {
        if (!this.props.ticket.hasOwnProperty('price') || !this.props.ticket.price.hasOwnProperty('value')
            || !this.props.ticket.price.hasOwnProperty('currency')) {
            return '- EUR';
        }
        let cents = this.props.ticket.price.value % 100;
        let euros = Math.floor(this.props.ticket.price.value / 100);
        return euros + ',' + cents + ' ' + this.props.ticket.price.currency;
    }

    /**
     * Get the status to be rendered.
     * @returns {string|*} The translated status.
     * @private
     */
    _getStatus() {
        if(this.props.ticket.hasOwnProperty('status')) {
            return I18n.t('data.ticket.status.' + this.props.ticket.status);
        }
        return '-';
    }

    /**
     * Determine whether or not the ticket is purchasable.
     * @returns {boolean} True, is the ticket can be yet purchased.
     * @private
     */
    _isPurchasable() {
        return !!(this.props.ticket.hasOwnProperty('status') && this.props.ticket.status === 'purchasable');
    }

    /**
     * Render the component.
     * @returns {*} The Component to be rendered.
     */
    render() {
        return <div className='ticketBox'>
            <h3>{this.props.ticket.hasOwnProperty('name') ? this.props.ticket.name : I18n.t('header.ticket.ticket')}</h3>
            <span className='leftItem'>{I18n.t('data.ticket.price.value')}: </span>
            <span className='rightItem'>{this._getPrice()}</span>
            <br/>
            <span className='leftItem'>{I18n.t('data.ticket.status.title')}: </span>
            <span className='rightItem'>{this._getStatus()}</span>
            <br/>
            <Button className='rightItem align-bottom' disabled={this._isPurchasable()}>
                {I18n.t('controls.buyTicket')}
            </Button>
        </div>
    }
}

TicketBox.propTypes = {
    ticket: PropTypes.object.isRequired
};

export default TicketBox;