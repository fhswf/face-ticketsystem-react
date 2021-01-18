import React, {Component} from 'react';
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Tab, Tabs, Row, Col, Form, Button, Dropdown, DropdownButton, Alert} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import {emptyUser} from "../../redux/reducers/AccountReducers";
import PropTypes from "prop-types";
import produce from "immer";
import _ from 'lodash';
import CameraImageUploader from "../components/CameraImageUploader/CameraImageUploader";

const PASSWORD_MIN_LENGTH = 6;
const MIN_PHONE_LENGTH = 6;
const ZIP_LENGTH = 3;

class LoginView extends Component {
    constructor(props) {
        super(props);
        this._login = this._login.bind(this);
        this._register = this._register.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleNewEmailChange = this._handleNewEmailChange.bind(this);
        this._isEmailValid = this._isEmailValid.bind(this);
        this._isNameValid = this._isNameValid.bind(this);
        this._isFieldValid = this._isFieldValid.bind(this);
        this._onPictureTaken = this._onPictureTaken.bind(this);
        this._getSalutationDropdownTitle = this._getSalutationDropdownTitle.bind(this);
        this._isPasswordValid = this._isPasswordValid.bind(this);
        this._isRepeatedPasswordValid = this._isRepeatedPasswordValid.bind(this);
        this.state = {
            user: emptyUser,
            repeatedPassword: '',
            validatedLogin: false,
            validatedRegister: false,
            pictureToUpload: null,
            isEmailOccupied: false,
            didLoginFail: false,
            loginErrorMessage: 'message.loginFail'
        };
    }

    _login(event) {
        const form = event.currentTarget;
        event.preventDefault(); // DO NOT DELETE - Fixes the bug, where fetch would get canceled
        this.setState({validatedLogin: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validatedLogin: true});
        }
        else {
            this.props.login(this.state.user)
                .then(user => {
                    this.props.history.push('/');
                })
                .catch(err => {
                    this.setState({
                        didLoginFail: true,
                        loginErrorMessage: err.message
                    })
                });
        }
    }

    _register(event) {
        const form = event.currentTarget;
        event.preventDefault(); // DO NOT DELETE - Fixes the bug, where fetch would get canceled
        this.setState({validatedRegister: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validatedRegister: true});
        }
        else {
            this.props.register(this.state.user, this.state.pictureToUpload)
                .then(user => {
                    this.props.history.push('/home');
                })
                .catch(err => {
                    // TODO Handle fetch error
                });
        }
    }

    _handleChange(property) {
        return (event) => {
            this.setState(produce(this.state, draft => {
                _.set(draft, property, event.target.value);
            }))
        }
    }

    _handleNewEmailChange(event) {
        // Note: Yes, the state will be updated twice (double update of GUI) which is necessary, otherwise the E-Mail
        // Control won't get updated properly (the text won't change for an unknown reason)
        this._handleChange('user.email')(event);

        // Determine, whether the email is occupied or not
        this.props.isEmailOccupied(event.target.value)
            .then(isOccupied => {
                this.setState({isEmailOccupied: isOccupied});
            })
            .catch(err => {
                this.setState({isEmailOccupied: true});
            })
    }

    _isEmailValid() {
        let emailPattern = /\S+@\S+\.\S+/;
        return this.state.user.email && !this.state.isEmailOccupied && emailPattern.test(this.state.user.email);
    }

    _handleDropdown(property) {
        return (eventKey, event) => {
            this.setState(produce(draft => {
                _.set(draft, property, eventKey);
            }))
        }
    }

    _getSalutationDropdownTitle() {
        if (!this.state.user.personal.salutation) {
            return I18n.t('placeholder.salutation');
        }
        return this.state.user.personal.salutation;
    }

    _isPasswordValid() {
        return this.state.user.password && this.state.user.password.length >= PASSWORD_MIN_LENGTH;
    }

    _isRepeatedPasswordValid() {
        return this.state.repeatedPassword && this.state.repeatedPassword === this.state.user.password;
    }

    _isNameValid(name) {
        // let pattern = /[A-Z][a-z]+( [A-Z][a-z]+)*/;
        let pattern = /[a-z]+( [a-z]+)*/;
        return name && pattern.test(name);
    }

    _isFieldValid(field, length) {
        return field && field.length >= length;
    }

    _onPictureTaken(file) {
        this.setState({
            pictureToUpload: file
        });
    }

    render() {
        return <Container id="login-view">
            <Row>
                <Col>
                    <Tabs defaultActiveKey='register' id='login-register-tab'>
                        <Tab eventKey='login' title={I18n.t('header.login')}>
                            <h2>{I18n.t('header.login')}</h2>
                            <Form onSubmit={this._login} noValidate validated={this.state.validatedLogin}>
                                <Form.Group controlId="emailFormLogin" as={Row}>
                                    <Form.Label column sm="3">{I18n.t('data.email')}:</Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="email" placeholder={I18n.t('placeholder.email')}
                                                      onChange={e => {
                                                          this.setState({didLoginFail: false});
                                                          this._handleChange('user.email')(e);
                                                      }}
                                                      value={this.state.user.email} required/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterEmailLogin')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="passwordFormLogin" as={Row}>
                                    <Form.Label column sm="3">{I18n.t('data.password')}:</Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="password" placeholder={I18n.t('placeholder.password')}
                                                      onChange={e => {
                                                          this.setState({didLoginFail: false});
                                                          this._handleChange('user.password')(e);
                                                      }}
                                                      value={this.state.user.password} required/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterPasswordLogin')}
                                        </Form.Control.Feedback>
                                        {
                                            this.state.didLoginFail &&
                                            <Alert variant="danger" className="mt-2">
                                                {I18n.t(this.state.loginErrorMessage)}
                                            </Alert>
                                        }
                                    </Col>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    {I18n.t('header.login')}
                                </Button>
                            </Form>
                        </Tab>
                        <Tab eventKey='register' title={I18n.t('header.register')}>
                            <h2>{I18n.t('header.register')}</h2>
                            <h3>{I18n.t('header.loginData')}</h3>
                            <Form onSubmit={this._register} noValidate>
                                <Form.Group controlId="emailFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.email')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="email" placeholder={I18n.t('placeholder.email')}
                                                      onChange={this._handleNewEmailChange}
                                                      isValid={this._isEmailValid()}
                                                      isInvalid={(this.state.validatedRegister || this.state.user.email) && !this._isEmailValid()}
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
                                <Form.Group controlId="passwordFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.password')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="password" placeholder={I18n.t('placeholder.password')}
                                                      onChange={this._handleChange('user.password')}
                                                      isValid={this._isPasswordValid()}
                                                      isInvalid={(this.state.validatedRegister || this.state.user.password) && !this._isPasswordValid()}
                                                      value={this.state.user.password}/>
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                this.state.user.password
                                                    ? I18n.t('feedback.passwordTooShort', {min: PASSWORD_MIN_LENGTH})
                                                    : I18n.t('feedback.enterPasswordRegister')
                                            }
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="repeatPasswordFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.repeatPassword')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="password"
                                                      isInvalid={(this.state.validatedRegister || this.state.repeatedPassword) && !this._isRepeatedPasswordValid()}
                                                      isValid={this._isRepeatedPasswordValid()}
                                                      placeholder={I18n.t('placeholder.repeatPassword')}
                                                      onChange={this._handleChange('repeatedPassword')}
                                                      value={this.state.repeatedPassword}/>
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                this.state.repeatedPassword
                                                    ? I18n.t('feedback.passwordsDontMatch')
                                                    : I18n.t('feedback.enterRepeatPassword')
                                            }
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>

                                <h3>{I18n.t('header.personalData')}</h3>
                                <Form.Group controlId="salutationFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.salutation')}:</Form.Label>
                                    <Col>
                                        <DropdownButton title={this._getSalutationDropdownTitle()}
                                                        variant="outline-primary"
                                                        onSelect={this._handleDropdown('user.personal.salutation')}>
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
                                <Form.Group controlId="firstnameFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.firstname')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.firstname')}
                                                      isValid={this._isNameValid(this.state.user.personal.firstname)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.firstname)
                                                          && !this._isNameValid(this.state.user.personal.firstname)
                                                      }
                                                      onChange={this._handleChange('user.personal.firstname')}
                                                      value={this.state.user.personal.firstname}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterFirstName')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="lastnameFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.lastname')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.lastname')}
                                                      isValid={this._isNameValid(this.state.user.personal.lastname)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.lastname)
                                                          && !this._isNameValid(this.state.user.personal.lastname)
                                                      }
                                                      onChange={this._handleChange('user.personal.lastname')}
                                                      value={this.state.user.personal.lastname}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterLastName')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="phoneFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.phone')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.phone')}
                                                      isValid={this._isFieldValid(this.state.user.personal.phone, MIN_PHONE_LENGTH)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.phone)
                                                          && !this._isFieldValid(this.state.user.personal.phone, MIN_PHONE_LENGTH)
                                                      }
                                                      onChange={this._handleChange('user.personal.phone')}
                                                      value={this.state.user.personal.phone}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterPhone')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="uploadFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.picture')}*:</Form.Label>
                                    <Col>
                                        <CameraImageUploader isUploading={false}
                                                             placeholder={I18n.t('placeholder.picture')}
                                                             onPictureSelected={this._onPictureTaken}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.uploadImage')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>

                                <h3>{I18n.t('header.addressData')}</h3>
                                {/*<Form.Group controlId="countryFormRegister" as={Row}>*/}
                                {/*    /!*TODO: CountryPicker Component*!/*/}
                                {/*    <Form.Label column sm="4">{I18n.t('data.country')}:</Form.Label>*/}
                                {/*    <Col>*/}
                                {/*        <Form.Control type="text"*/}
                                {/*                      placeholder={I18n.t('placeholder.country')}*/}
                                {/*                      onChange={this._handleChange('user.personal.country')}*/}
                                {/*                      value={this.state.user.personal.country}/>*/}
                                {/*    </Col>*/}
                                {/*</Form.Group>*/}
                                <Form.Group controlId="zipFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.zipcode')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.zipcode')}
                                                      isValid={this._isFieldValid(this.state.user.personal.zipcode, ZIP_LENGTH)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.zipcode)
                                                          && !this._isFieldValid(this.state.user.personal.zipcode, ZIP_LENGTH)
                                                      }
                                                      onChange={this._handleChange('user.personal.zipcode')}
                                                      value={this.state.user.personal.zipcode}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterZip')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="cityFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.city')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.city')}
                                                      isValid={this._isFieldValid(this.state.user.personal.city, 1)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.city)
                                                          && !this._isFieldValid(this.state.user.personal.city, 1)
                                                      }
                                                      onChange={this._handleChange('user.personal.city')}
                                                      value={this.state.user.personal.city}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterCity')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="address1FormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.address1')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.address1')}
                                                      isValid={this._isFieldValid(this.state.user.personal.address1, 1)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.city)
                                                          && !this._isFieldValid(this.state.user.personal.address1, 1)
                                                      }
                                                      onChange={this._handleChange('user.personal.address1')}
                                                      value={this.state.user.personal.address1}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterAddress1')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="address2FormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.address2')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.address2')}
                                                      onChange={this._handleChange('user.personal.address2')}
                                                      value={this.state.user.personal.address2}/>
                                    </Col>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    {I18n.t('header.register')}
                                </Button>
                            </Form>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    }
}

LoginView.propTypes = {
    onLogin: PropTypes.func
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginView));