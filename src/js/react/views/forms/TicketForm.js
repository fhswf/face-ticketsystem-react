import React, {Component} from 'react';
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import produce from "immer";
import _ from "lodash";
import CurrencyPicker from "../../components/CurrencyPicker/CurrencyPicker";

class TicketForm extends Component {
    constructor(props) {
        super(props);
        this._finalize = this._finalize.bind(this);
        this._renderTextFieldFormGroup = this._renderTextFieldFormGroup.bind(this);
        this.state = {
            validated: false
        };
    }

    _finalize(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validated: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validated: true});
        }
        else {
            this.props.createTicket();
        }
    }

    _renderTextFieldFormGroup(valueProperty, labelProperty, feedbackProperty, updateFieldFn, required = true) {
        return <Form.Group as={Row}>
            <Form.Label column sm="4">{I18n.t(labelProperty)}:</Form.Label>
            <Col>
                <Form.Control type="text" placeholder={I18n.t(labelProperty)}
                              onChange={(event) => {
                                  updateFieldFn(valueProperty, event.target.value)
                              }}
                              required={required}
                              disabled={this.props.readOnly}
                              value={_.get(this.props.ticket.value, valueProperty) || ''}
                />
                <Form.Control.Feedback type="invalid">
                    {I18n.t(feedbackProperty)}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    }

    render() {
        return <Container id="basic-form">
            <Row>
                <Col>
                    <h2 id='special-title'>{I18n.t('header.ticket.create')}</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4>{I18n.t('header.ticket.details')}</h4>
                    <Form onSubmit={this._finalize} noValidate validated={this.state.validated}>
                        {this._renderTextFieldFormGroup(
                            'name',
                            'data.ticket.name',
                            'feedback.ticket.name',
                            this.props.updateTicketField)}
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">{I18n.t('data.ticket.price.value')}:</Form.Label>
                            <Col className='d-inline-flex'>
                                <Form.Control type="text" placeholder={I18n.t('data.ticket.price.value')}
                                              onChange={(event) => {
                                                  this.props.updateTicketField('price.value', event.target.value)
                                              }}
                                              className='mr-2'
                                              required={true}
                                              disabled={this.props.readOnly}
                                              value={this.props.ticket.value.price.value || ''}
                                />
                                <CurrencyPicker
                                    onSelect={(country, currency) => {
                                        this.props.updateTicketField('price.currency', currency);
                                    }}
                                    currency={this.props.ticket.value.price.currency || 'EUR'}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {I18n.t('feedback.ticket.price.currency')}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        {this._renderTextFieldFormGroup(
                            'status',
                            'data.ticket.status',
                            'feedback.ticket.status',
                            this.props.updateTicketField)}
                    </Form>
                </Col>
            </Row>
        </Container>
    }
}

TicketForm.propTypes = {
    readOnly: PropTypes.bool    // Whether or not the Form is editable or not
};


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        ticket: state.ticket
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TicketForm));