import React, {Component} from 'react';
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Tab, Tabs, Row, Col, Form, Button, Dropdown, DropdownButton, Alert, Spinner} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import {emptyUser} from "../../redux/reducers/AccountReducers";
import PropTypes from "prop-types";
import CameraImageUploader from "../components/CameraImageUploader/CameraImageUploader";
import SimpleDialog from "../components/SimpleDialog";
import config from "../../config/Config";
import {
    getSalutationDropdownTitle,
    handleChange, handleDropdown,
    handleNewEmailChange,
    isEmailValid, isFieldValid, isNameValid,
    isPasswordValid,
    isRepeatedPasswordValid
} from "../accountReactFunctions";

/**
 * The high order Component representing the login view.
 */
class LoginView extends Component {
    /**
     * Create a new LoginView.
     * @param props The properties of the Component.
     */
    constructor(props) {
        super(props);
        this._login = this._login.bind(this);
        this._register = this._register.bind(this);
        this._onPictureTaken = this._onPictureTaken.bind(this);
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
            isTryingToLogIn: false,
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
            this.setState({isTryingToLogIn: true});
            this.props.login(this.state.user)
                .then(user => {
                    this.setState({isTryingToLogIn: false});
                    this.props.history.push('/');
                })
                .catch(err => {
                    this.setState({
                        didLoginFail: true,
                        isTryingToLogIn: false,
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
     * Update the picture to be displayed. Is called when taking a photo.
     */
    _onPictureTaken(file) {
        this.setState({
            pictureToUpload: file
        });
    }

    /**
     * Update the information if the taken picture contains a face or not. Is called after taking a picture or cropping.
     */
    _onPictureEvaluated(hasFace) {
        this.setState({
            pictureHasFace: hasFace
        });
    }

    /**
     * Render the Component.
     * @returns The Component to be rendered.
     */
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
                                                          handleChange(this, 'user.email')(e);
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
                                                          handleChange(this, 'user.password')(e);
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
                                <Button variant="primary" type="submit" disabled={this.state.isTryingToLogIn}>
                                    {
                                        this.state.isTryingToLogIn &&
                                        <span>
                                            <Spinner as="span" animation="border" size="sm"/>
                                            {I18n.t('controls.loggingIn')}
                                        </span>
                                    }
                                    {
                                        !this.state.isTryingToLogIn &&
                                        I18n.t('controls.login')
                                    }
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
                                                      onChange={handleNewEmailChange(this)}
                                                      isValid={isEmailValid(this)}
                                                      isInvalid={(this.state.validatedRegister || this.state.user.email) && !isEmailValid(this)}
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
                                                      onChange={handleChange(this, 'user.password')}
                                                      isValid={isPasswordValid(this.state.user.password)}
                                                      isInvalid={(this.state.validatedRegister || this.state.user.password) && !isPasswordValid(this.state.user.password)}
                                                      value={this.state.user.password}/>
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                this.state.user.password
                                                    ? I18n.t('feedback.passwordTooShort', {min: config.controls.user.password.min})
                                                    : I18n.t('feedback.enterPasswordRegister')
                                            }
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="repeatPasswordFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.repeatPassword')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="password"
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.repeatedPassword)
                                                          && !isRepeatedPasswordValid(this.state.user.password, this.state.repeatedPassword)
                                                      }
                                                      isValid={isRepeatedPasswordValid(this.state.user.password, this.state.repeatedPassword)}
                                                      placeholder={I18n.t('placeholder.repeatPassword')}
                                                      onChange={handleChange(this, 'repeatedPassword')}
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
                                <Form.Group controlId="firstnameFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.firstname')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.firstname')}
                                                      isValid={isNameValid(this.state.user.personal.firstname)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.firstname)
                                                          && !isNameValid(this.state.user.personal.firstname)
                                                      }
                                                      onChange={handleChange(this, 'user.personal.firstname')}
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
                                                      isValid={isNameValid(this.state.user.personal.lastname)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.lastname)
                                                          && !isNameValid(this.state.user.personal.lastname)
                                                      }
                                                      onChange={handleChange(this, 'user.personal.lastname')}
                                                      value={this.state.user.personal.lastname}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterLastName')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="phoneFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.phone')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.phone')}
                                                      isValid={isFieldValid(this.state.user.personal.phonenumber, config.controls.user.phone.min)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.phonenumber)
                                                          && !isFieldValid(this.state.user.personal.phonenumber, config.controls.user.phone.min)
                                                      }
                                                      onChange={handleChange(this, 'user.personal.phonenumber', true)}
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
                                {/*                      onChange={handleChange(this, 'user.personal.country')}*/}
                                {/*                      value={this.state.user.personal.country}/>*/}
                                {/*    </Col>*/}
                                {/*</Form.Group>*/}
                                <Form.Group controlId="zipFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.zipcode')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.zipcode')}
                                                      isValid={isFieldValid(this.state.user.personal.zipcode, config.controls.user.zip.min)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.zipcode)
                                                          && !isFieldValid(this.state.user.personal.zipcode, config.controls.user.zip.min)
                                                      }
                                                      onChange={handleChange(this, 'user.personal.zipcode', true)}
                                                      value={this.state.user.personal.zipcode}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterZip')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="cityFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.city')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.city')}
                                                      isValid={isFieldValid(this.state.user.personal.city, 1)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.city)
                                                          && !isFieldValid(this.state.user.personal.city, 1)
                                                      }
                                                      onChange={handleChange(this, 'user.personal.city')}
                                                      value={this.state.user.personal.city}/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterCity')}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="address1FormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.address1')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.address1')}
                                                      isValid={isFieldValid(this.state.user.personal.address1, 1)}
                                                      isInvalid={
                                                          (this.state.validatedRegister || this.state.user.personal.address1)
                                                          && !isFieldValid(this.state.user.personal.address1, 1)
                                                      }
                                                      onChange={handleChange(this, 'user.personal.address1')}
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
                                                      onChange={handleChange(this, 'user.personal.address2')}
                                                      value={this.state.user.personal.address2}/>
                                    </Col>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={this.state.isTryingToRegister}>
                                    {
                                        this.state.isTryingToRegister &&
                                        <span>
                                            <Spinner as="span" animation="border" size="sm"/>
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