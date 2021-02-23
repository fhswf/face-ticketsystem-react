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
import CameraImageUploader from "../components/CameraImageUploader/CameraImageUploader";
import SimpleDialog from "../components/SimpleDialog";

const PASSWORD_MIN_LENGTH = 6;
const MIN_PHONE_LENGTH = 6;
const ZIP_LENGTH_MIN = 3;

/**
 * The high order Component representing the login view.
 */
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
        this._onPictureEvaluated = this._onPictureEvaluated.bind(this);
        this.state = {
            user: emptyUser,
            repeatedPassword: '',
            validatedLogin: false,
            validatedRegister: false,
            pictureToUpload: null,
            isEmailOccupied: false,
            didLoginFail: false,
            loginErrorMessage: 'message.loginFail',
            registerFailed: false,
            isTryingToRegister: false,
            pictureHasFace: undefined
        };
    }

    /**
     * Try to log the user in.
     * @param event The form event which resolves into logging in an user.
     * @private
     */
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

    /**
     * Try to register the user in.
     * @param event The form event which resolves into registering an user.
     * @private
     */
    _register(event) {
        const form = event.currentTarget;
        event.preventDefault(); // DO NOT DELETE - Fixes the bug, where fetch would get canceled
        this.setState({validatedRegister: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validatedRegister: true});
        }
        else {
            this.setState({
                isTryingToRegister: true
            });

            this.props.register(this.state.user, this.state.pictureToUpload)
                .then(user => {
                    this.props.history.push('/home');
                })
                .catch(err => {
                    this.setState({
                        registerFailed: true,
                        isTryingToRegister: false
                    })
                });
        }
    }

    /**
     * Handle a state change.
     * @param property The state property to be updated.
     * @param isNumeric If true, only allow numeric inputs. Default is false.
     * @return function A function expecting an event as a parameter, which contains the new value for the property.
     * @private
     */
    _handleChange(property, isNumeric=false) {
        return (event) => {
            let value = event.target.value;
            if (isNumeric) {
                value = value.replace(/[^\d+|]*/g, '');
            }
            this.setState(produce(this.state, draft => {
                draft.didLoginFail = false; // Resets the login failure message
                _.set(draft, property, value);
            }))
        }
    }

    /**
     * Handle the change of an E-Mail, by checking if the E-Mail is occupied or not.
     * @param event The change event containing the new email value.
     * @private
     */
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

    /**
     * Determine whether or not the E-Mail is valid.
     * @return boolean True, if the E-Mail has a valid format, otherwise false.
     * @private
     */
    _isEmailValid() {
        let emailPattern = /\S+@\S+\.\S+/;
        return this.state.user.email && !this.state.isEmailOccupied && emailPattern.test(this.state.user.email);
    }

    /**
     * Handle a dropdown event.
     * @param properties The properties to be updated.
     * @return function A function expecting the eventKey containing the value (and the dropdown event (unused)).
     * @private
     */
    _handleDropdown(...properties) {
        return (eventKey, event) => {
            this.setState(produce(draft => {
                for (let i = 0; i < properties.length; i++) {
                    _.set(draft, properties[i], eventKey);
                }
            }))
        }
    }

    /**
     * Get the Text for the Dropdown to display the currently selected salutation or it's placeholder.
     * @return string The text to be displayed.
     * @private
     */
    _getSalutationDropdownTitle() {
        if (!this.state.user.personal.salutation) {
            return I18n.t('placeholder.salutation');
        }
        return this.state.user.personal.salutation;
    }

    /**
     * @return boolean True, if the typed in password is valid; otherwise false.
     * @private
     */
    _isPasswordValid() {
        return this.state.user.password && this.state.user.password.length >= PASSWORD_MIN_LENGTH;
    }

    /**
     * @return boolean True, if the typed in repeated password is valid; otherwise false.
     * @private
     */
    _isRepeatedPasswordValid() {
        return this.state.repeatedPassword && this.state.repeatedPassword === this.state.user.password;
    }

    /**
     * Determine Whether or not the typed in value is a name.
     * @param name A String which represents the name of a person.
     * @return boolean True, if the typed in name is valid; otherwise false.
     * @private
     */
    _isNameValid(name) {
        // let pattern = /[A-Z][a-z]+( [A-Z][a-z]+)*/;
        let pattern = /[a-z]+( [a-z]+)*/;
        return name && pattern.test(name);
    }

    /**
     * Determines whether or not a given field is valid.
     * @param field The field to be checked.
     * @param length The minimum length of the field. Default is 1.
     * @return boolean True, if the field is valid; otherwise false.
     */
    _isFieldValid(field, length = 1) {
        return field && field.length >= length;
    }

    _onPictureTaken(file) {
        this.setState({
            pictureToUpload: file
        });
    }

    _onPictureEvaluated(hasFace) {
        this.setState({
            pictureHasFace: hasFace
        });
    }

    render() {
        let self = this;
        return <Container id="basic-form">
            <Row>
                <Col>
                    <SimpleDialog show={this.state.registerFailed}
                                  handleClose={() => {
                                      self.setState({registerFailed: false})
                                  }}
                                  title={I18n.t('message.registerFailTitle')}
                                  text={I18n.t('message.registerFailText')}
                    />
                    <Tabs defaultActiveKey='login' id='login-register-tab'>
                        <Tab eventKey='login' title={I18n.t('header.login')}>
                            <h2>{I18n.t('header.login')}</h2>
                            <Form onSubmit={this._login} noValidate validated={this.state.validatedLogin}>
                                <Form.Group controlId="emailFormLogin" as={Row}>
                                    <Form.Label column sm="3">{I18n.t('data.email')}:</Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="email" placeholder={I18n.t('placeholder.email')}
                                                      onChange={e => {
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
                                    {I18n.t('controls.login')}
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
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.phone')}
                                                      isValid={this._isFieldValid(this.state.user.personal.phonenumber, MIN_PHONE_LENGTH)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.phonenumber)
                                                          && !this._isFieldValid(this.state.user.personal.phonenumber, MIN_PHONE_LENGTH)
                                                      }
                                                      onChange={this._handleChange('user.personal.phonenumber', true)}
                                                      value={this.state.user.personal.phonenumber}/>
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
                                                             onPictureEvaluated={this._onPictureEvaluated}
                                        />
                                        {
                                            this.state.pictureHasFace === false &&
                                            <Alert variant="danger" className="mt-2 mb-0">
                                                {I18n.t('feedback.noFaceFound')}
                                            </Alert>
                                        }
                                        {
                                            this.state.pictureHasFace === undefined && !this.state.validatedRegister &&
                                            <Alert variant="info" className="mt-2 mb-0">
                                                {I18n.t('information.imageProcessing')}
                                            </Alert>
                                        }
                                        {
                                            this.state.pictureHasFace === undefined && this.state.validatedRegister &&
                                            <Alert variant="danger" className="mt-2 mb-0">
                                                {I18n.t('feedback.uploadImage')}
                                            </Alert>
                                        }
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
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.zipcode')}
                                                      isValid={this._isFieldValid(this.state.user.personal.zipcode, ZIP_LENGTH_MIN)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.zipcode)
                                                          && !this._isFieldValid(this.state.user.personal.zipcode, ZIP_LENGTH_MIN)
                                                      }
                                                      onChange={this._handleChange('user.personal.zipcode', true)}
                                                      value={this.state.user.personal.zipcode}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterZip')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="cityFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.city')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
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
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.address1')}
                                                      isValid={this._isFieldValid(this.state.user.personal.address1, 1)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.address1)
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
                                <Button variant="primary" type="submit" disabled={this.state.isTryingToRegister}>
                                    {
                                        this.state.isTryingToRegister &&
                                        <span>
                                            <Spinner as="span" animation="border" size="sm" />
                                            {I18n.t('controls.registering')}
                                        </span>
                                    }
                                    {
                                        !this.state.isTryingToRegister &&
                                        I18n.t('controls.register')
                                    }
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