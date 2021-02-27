import React, {Component} from 'react';
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Row, Col, Form, Button, DropdownButton, Dropdown, Tooltip, OverlayTrigger} from "react-bootstrap";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import produce from "immer";
import _ from "lodash";
import CurrencyPicker from "../../components/CurrencyPicker/CurrencyPicker";
import {getSalutationDropdownTitle, handleDropdown} from "../../accountReactFunctions";
import SimpleDialog from "../../components/SimpleDialog";

class TicketForm extends Component {
    constructor(props) {
        super(props);
        this._finalize = this._finalize.bind(this);
        this._renderTextFieldFormGroup = this._renderTextFieldFormGroup.bind(this);
        this._getStatusDropdownTitle = this._getStatusDropdownTitle.bind(this);
        this.state = {
            validated: false,
            saveFailed: false,
            saveSuccess: false,
            price: {
                euros: '',
                cents: ''
            }
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
            this.props.createTicket()
                .then(ticket => {
                    this.setState({saveSuccess: true})
                })
                .catch(err => {
                    this.setState({saveFailed: true})
                });
        }
    }

    /**
     * Renders a <Form.Group> for text fields.
     * @param valueProperty The value of the ticket to be updated.
     * @param labelProperty The i18n label property to be shown.
     * @param feedbackProperty The i18n feedback property.
     * @param updateFieldFn The update function to be called onChange (2 params: valueProperty, value)
     * @param required Whether or not it's an required field. Default true.
     * @param isNumeric Whether or not the input is numeric. Default false.
     * @returns {*} The <Form.Group> to be rendered.
     * @private
     */
    _renderTextFieldFormGroup(valueProperty, labelProperty, feedbackProperty, updateFieldFn, required = true, isNumeric = false) {
        return <Form.Group as={Row}>
            <Form.Label column sm="4">{I18n.t(labelProperty)}:</Form.Label>
            <Col>
                <Form.Control type="text" placeholder={I18n.t(labelProperty)}
                              onChange={(event) => {
                                  let value = event.target.value;
                                  if (isNumeric) {
                                      value = value.replace(/[^\d]*/g, '');
                                  }
                                  updateFieldFn(valueProperty, value)
                              }}
                              required={required}
                              disabled={this.props.readOnly}
                              value={_.get(this.props.ticket, valueProperty) || ''}
                />
                <Form.Control.Feedback type="invalid">
                    {I18n.t(feedbackProperty)}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    }

    _getStatusDropdownTitle() {
        if (!this.props.ticket.status) {
            return I18n.t('data.ticket.status.title');
        }
        return I18n.t('data.ticket.status.' + this.props.ticket.status);
    }

    // _renderCustomFields() {
    //     return this.props.ticket.customFields.map(customField => {
    //         return this._renderTextFieldFormGroup(
    //             'customField.' + customField.name,
    //             ''
    //             )
    //     })
    // }

    render() {
        let self = this;
        return <Container id="basic-form">
            <SimpleDialog show={this.state.saveFailed}
                          handleClose={() => {
                              self.setState({saveFailed: false})
                          }}
                          title={I18n.t('message.saveTicketFailTitle')}
                          text={I18n.t('message.saveTicketFailText')}
            />
            <SimpleDialog show={this.state.saveSuccess}
                          handleClose={() => {
                              self.setState({saveSuccess: false});
                              self.props.history.push('/tickets');
                          }}
                          title={I18n.t('message.saveTicketSuccessTitle')}
                          text={I18n.t('message.saveTicketSuccessText')}
            />
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
                                <Form.Control type="text" placeholder={I18n.t('0')}
                                              onChange={event => {
                                                  let euros = event.target.value.replace(/[^\d]*/g, '') * 100;
                                                  let cents = this.props.ticket.price.value % 100;
                                                  this.props.updateTicketField('price.value', euros + cents);
                                              }}
                                              sm="1"
                                              className='mr-2'
                                              required={true}
                                              disabled={this.props.readOnly}
                                              value={Math.floor(this.props.ticket.price.value / 100) || ''}
                                />
                                <Form.Control type="text" placeholder={I18n.t('0')}
                                              onChange={event => {
                                                  let currentCents = this.props.ticket.price.value % 100;
                                                  let inputCents = event.target.value.replace(/[^\d]*/g, '');
                                                  inputCents = inputCents.replace(/^(.)0(.)/, '$1$2');
                                                  inputCents %= 100;

                                                  if(currentCents.toString().length < 2 || inputCents.toString().length < 2) {
                                                      let euros = Math.floor(this.props.ticket.price.value / 100) * 100;
                                                      this.props.updateTicketField('price.value', euros + inputCents);
                                                  }
                                              }}
                                              sm="1"
                                              className='mr-2'
                                              required={true}
                                              disabled={this.props.readOnly}
                                              value={
                                                  // this.props.ticket.price.value % 100
                                                  (this.props.ticket.price.value % 100 < 10
                                                      ? '0' + this.props.ticket.price.value % 100
                                                      : this.props.ticket.price.value % 100)
                                                  || ''}
                                />
                                <CurrencyPicker
                                    onSelect={(country, currency) => {
                                        this.props.updateTicketField('price.currency', currency);
                                    }}
                                    currency={this.props.ticket.price.currency || 'EUR'}
                                />
                                {/*<Form.Control.Feedback type="invalid">*/}
                                {/*    {I18n.t('feedback.ticket.price.value')}*/}
                                {/*</Form.Control.Feedback>*/}
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="statusForm" as={Row}>
                            <Form.Label column sm="4">{I18n.t('data.ticket.status.title')}:</Form.Label>
                            <Col>
                                <DropdownButton
                                    disabled={this.props.readOnly}
                                    title={this._getStatusDropdownTitle()}
                                    variant="outline-primary"
                                    onSelect={(eventKey, event) => {
                                        this.props.updateTicketField('status', eventKey)
                                    }}>
                                    <Dropdown.Item eventKey='purchasable'>
                                        {I18n.t('data.ticket.status.purchasable')}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey='inactive'>
                                        {I18n.t('data.ticket.status.inactive')}
                                    </Dropdown.Item>
                                </DropdownButton>
                                <Form.Control.Feedback type="invalid">
                                    {I18n.t('feedback.ticket.enterStatus')}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        {this._renderTextFieldFormGroup(
                            'buyLimit',
                            'data.ticket.buyLimit',
                            'feedback.ticket.buyLimit',
                            this.props.updateTicketField,
                            true,
                            true
                        )}
                        <Button variant="primary" type="submit">
                            {I18n.t('controls.createTicket')}
                        </Button>
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
        ticket: state.ticket.value
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