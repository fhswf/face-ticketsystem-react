import React, {Component} from 'react';
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Tab, Tabs, Row, Col, Form, Button, Dropdown, DropdownButton, Alert, Spinner} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import {emptyUser} from "../../redux/reducers/AccountReducers";
import PropTypes from "prop-types";
import produce from "immer";
import _ from 'lodash';
import SimpleDialog from "../components/SimpleDialog";
import CameraImageUploader from "../components/CameraImageUploader/CameraImageUploader";
import config from "../../config/Config";
import {
    getSalutationDropdownTitle,
    handleChange, handleDropdown,
    handleNewEmailChange,
    isEmailValid, isFieldValid, isNameValid,
    isPasswordValid,
    isRepeatedPasswordValid
} from "../accountReactFunctions";

class EditAccount extends Component {
    constructor(props) {
        super(props);
        this._updateUser = this._updateUser.bind(this);
        this.state = {
            validated: false,
            user: emptyUser,
            isTryingToUpdate: false,
            isEmailOccupied: false
        }
    }

    componentDidMount() {
        this.setState({
            user: this.props.user.data.value
        })
    }

    _updateUser(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validated: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validated: true});
        }
        else {
            this.setState({
                isTryingToUpdate: true
            });

            this.props.updateUser(this.state.user)
                .then(() => {
                    // TODO Dialog n stuff
                    this.setState({isTryingToUpdate: false});
                })
                .catch(() => {
                    // TODO Dialog n stuff
                    this.setState({isTryingToUpdate: false});
                })
        }
    }

    render() {
        let self = this;
        return <Container id="basic-form">
            <h2>{I18n.t('header.updateUser')}</h2>
            <h3>{I18n.t('header.loginData')}</h3>
            <Form onSubmit={this._updateUser} noValidate>
                <Form.Group controlId="emailForm" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.email')}*:</Form.Label>
                    <Col>
                        <Form.Control type="email" placeholder={I18n.t('placeholder.email')}
                                      onChange={handleNewEmailChange(self)}
                                      isValid={isEmailValid(this)}
                                      isInvalid={(this.state.validated || this.state.user.email) && !isEmailValid(this)}
                                      value={this.state.user.email}/>
                        <Form.Control.Feedback type="invalid">
                            {
                                this.state.isEmailOccupied
                                    ? I18n.t('feedback.emailOccupied')
                                    : I18n.t('feedback.enterEmailRegister')
                            }
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <h3>{I18n.t('header.personalData')}</h3>
                <Form.Group controlId="salutationForm" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.salutation')}:</Form.Label>
                    <Col>
                        <DropdownButton
                            title={getSalutationDropdownTitle(this.state.user.personal.salutation)}
                            variant="outline-primary"
                            onSelect={handleDropdown(this, 'user.personal.salutation')}>
                            <Dropdown.Item eventKey={I18n.t('data.salutations.man')}>
                                {I18n.t('data.salutations.man')}
                            </Dropdown.Item>
                            <Dropdown.Item eventKey={I18n.t('data.salutations.woman')}>
                                {I18n.t('data.salutations.woman')}
                            </Dropdown.Item>
                            <Dropdown.Item eventKey={I18n.t('data.salutations.na')}>
                                {I18n.t('data.salutations.na')}
                            </Dropdown.Item>
                        </DropdownButton>
                        <Form.Control.Feedback type="invalid">
                            {I18n.t('feedback.enterSalutation')}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group controlId="firstnameForm" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.firstname')}*:</Form.Label>
                    <Col>
                        <Form.Control type="text" required
                                      placeholder={I18n.t('placeholder.firstname')}
                                      isValid={isNameValid(this.state.user.personal.firstname)}
                                      isInvalid={
                                          (this.state.validated || this.state.user.personal.firstname)
                                          && !isNameValid(this.state.user.personal.firstname)
                                      }
                                      onChange={handleChange(this, 'user.personal.firstname')}
                                      value={this.state.user.personal.firstname}/>
                        <Form.Control.Feedback type="invalid">
                            {I18n.t('feedback.enterFirstName')}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group controlId="lastnameForm" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.lastname')}*:</Form.Label>
                    <Col>
                        <Form.Control type="text" required
                                      placeholder={I18n.t('placeholder.lastname')}
                                      isValid={isNameValid(this.state.user.personal.lastname)}
                                      isInvalid={
                                          (this.state.validated || this.state.user.personal.lastname)
                                          && !isNameValid(this.state.user.personal.lastname)
                                      }
                                      onChange={handleChange(this, 'user.personal.lastname')}
                                      value={this.state.user.personal.lastname}/>
                        <Form.Control.Feedback type="invalid">
                            {I18n.t('feedback.enterLastName')}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group controlId="phoneForm" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.phone')}*:</Form.Label>
                    <Col>
                        <Form.Control type="text" required
                                      placeholder={I18n.t('placeholder.phone')}
                                      isValid={isFieldValid(this.state.user.personal.phonenumber, config.controls.user.phone.min)}
                                      isInvalid={
                                          (this.state.validated || this.state.user.personal.phonenumber)
                                          && !isFieldValid(this.state.user.personal.phonenumber, config.controls.user.phone.min)
                                      }
                                      onChange={handleChange(this, 'user.personal.phonenumber', true)}
                                      value={this.state.user.personal.phonenumber}/>
                        <Form.Control.Feedback type="invalid">
                            {I18n.t('feedback.enterPhone')}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <h3>{I18n.t('header.addressData')}</h3>
                <Form.Group controlId="zipForm" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.zipcode')}*:</Form.Label>
                    <Col>
                        <Form.Control type="text" required
                                      placeholder={I18n.t('placeholder.zipcode')}
                                      isValid={isFieldValid(this.state.user.personal.zipcode, config.controls.user.zip.min)}
                                      isInvalid={
                                          (this.state.validated || this.state.user.personal.zipcode)
                                          && !isFieldValid(this.state.user.personal.zipcode, config.controls.user.zip.min)
                                      }
                                      onChange={handleChange(this, 'user.personal.zipcode', true)}
                                      value={this.state.user.personal.zipcode}/>
                        <Form.Control.Feedback type="invalid">
                            {I18n.t('feedback.enterZip')}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group controlId="cityForm" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.city')}*:</Form.Label>
                    <Col>
                        <Form.Control type="text" required
                                      placeholder={I18n.t('placeholder.city')}
                                      isValid={isFieldValid(this.state.user.personal.city, 1)}
                                      isInvalid={
                                          (this.state.validated || this.state.user.personal.city)
                                          && !isFieldValid(this.state.user.personal.city, 1)
                                      }
                                      onChange={handleChange(this, 'user.personal.city')}
                                      value={this.state.user.personal.city}/>
                        <Form.Control.Feedback type="invalid">
                            {I18n.t('feedback.enterCity')}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group controlId="address1Form" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.address1')}*:</Form.Label>
                    <Col>
                        <Form.Control type="text" required
                                      placeholder={I18n.t('placeholder.address1')}
                                      isValid={isFieldValid(this.state.user.personal.address1, 1)}
                                      isInvalid={
                                          (this.state.validated || this.state.user.personal.address1)
                                          && !isFieldValid(this.state.user.personal.address1, 1)
                                      }
                                      onChange={handleChange(this, 'user.personal.address1')}
                                      value={this.state.user.personal.address1}/>
                        <Form.Control.Feedback type="invalid">
                            {I18n.t('feedback.enterAddress1')}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group controlId="address2Form" as={Row}>
                    <Form.Label column sm="4">{I18n.t('data.address2')}:</Form.Label>
                    <Col>
                        <Form.Control type="text"
                                      placeholder={I18n.t('placeholder.address2')}
                                      onChange={handleChange(this, 'user.personal.address2')}
                                      value={this.state.user.personal.address2}/>
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={this.state.isTryingToUpdate}>
                    {
                        this.state.isTryingToUpdate &&
                        <span>
                            <Spinner as="span" animation="border" size="sm"/>
                            {I18n.t('controls.updating')}
                        </span>
                    }
                    {
                        !this.state.isTryingToUpdate &&
                        I18n.t('controls.update')
                    }
                </Button>
            </Form>
        </Container>
    }
}

EditAccount.propTypes = {
    readOnly: PropTypes.bool // Whether or not the fields are editable
};

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditAccount));