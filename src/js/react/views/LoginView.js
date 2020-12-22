import React, {Component} from 'react';
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Tab, Tabs, Row, Col, Form, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import {emptyUser} from "../../redux/reducers/AccountReducers";
import PropTypes from "prop-types";
import produce from "immer";
import _ from 'lodash';
import CameraImageUploader from "../components/CameraImageUploader/CameraImageUploader";

class LoginView extends Component {
    constructor(props) {
        super(props);
        this._login = this._login.bind(this);
        this._register = this._register.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._onPictureTaken = this._onPictureTaken.bind(this);
        this._isRepeatedPasswordValid = this._isRepeatedPasswordValid.bind(this);
        this._getSalutationDropdownTitle = this._getSalutationDropdownTitle.bind(this);
        this.state = {
            user: emptyUser,
            repeatedPassword: '',
            validatedLogin: false,
            validatedRegister: false,
            pictureToUpload: null
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
                    console.log(err);
                    // TODO inform user that the login failed
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
            this.setState(produce(draft => {
                _.set(draft, property, event.target.value);
            }))
        }
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

    _isRepeatedPasswordValid() {
        // return "error";
        // return this.state.repeatedPassword && this.state.repeatedPassword === this.state.user.personal.password ? "success" : "error";
        return !!(this.state.repeatedPassword && this.state.repeatedPassword === this.state.user.personal.password);
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
                                                      onChange={this._handleChange('user.email')}
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
                                                      onChange={this._handleChange('user.password')}
                                                      value={this.state.user.password} required/>
                                        <Form.Control.Feedback type="invalid">
                                            {I18n.t('feedback.enterPasswordLogin')}
                                        </Form.Control.Feedback>
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
                            <Form onSubmit={this._register} noValidate validated={this.state.validatedRegister}>
                                <Form.Group controlId="emailFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.email')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="email" placeholder={I18n.t('placeholder.email')}
                                                      onChange={this._handleChange('user.email')}
                                                      value={this.state.user.email} required/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="passwordFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.password')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="password" placeholder={I18n.t('placeholder.password')}
                                                      onChange={this._handleChange('user.password')}
                                                      value={this.state.user.password} required/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="repeatPasswordFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.repeatPassword')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="password" required
                                                      isValid={this._isRepeatedPasswordValid()}
                                                      placeholder={I18n.t('placeholder.repeatPassword')}
                                                      onChange={this._handleChange('repeatedPassword')}
                                                      value={this.state.repeatedPassword}/>
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
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="firstnameFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.firstname')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.firstname')}
                                                      onChange={this._handleChange('user.personal.firstname')}
                                                      value={this.state.user.personal.firstname}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="lastnameFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.lastname')}*:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" required
                                                      placeholder={I18n.t('placeholder.lastname')}
                                                      onChange={this._handleChange('user.personal.lastname')}
                                                      value={this.state.user.personal.lastname}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="phoneFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.phone')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.phone')}
                                                      onChange={this._handleChange('user.personal.phone')}
                                                      value={this.state.user.personal.phone}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="uploadFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.picture')}*:</Form.Label>
                                    <Col>
                                        <CameraImageUploader isUploading={false}
                                                             placeholder={I18n.t('placeholder.picture')}
                                                             onPictureSelected={this._onPictureTaken}
                                        />
                                        {/*<Form.File type="text" required*/}
                                        {/*           placeholder={I18n.t('placeholder.picture')}*/}
                                        {/*           onChange={this._handleChange('user.pictureFile')}*/}
                                        {/*           value={this.state.user.pictureFile}/>*/}
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
                                                      onChange={this._handleChange('user.personal.zipcode')}
                                                      value={this.state.user.personal.zipcode}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="cityFormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.city')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.city')}
                                                      onChange={this._handleChange('user.personal.city')}
                                                      value={this.state.user.personal.city}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="address1FormRegister" as={Row}>
                                    <Form.Label column sm="4">{I18n.t('data.address1')}:</Form.Label>
                                    <Col>
                                        <Form.Control type="text"
                                                      placeholder={I18n.t('placeholder.address1')}
                                                      onChange={this._handleChange('user.personal.address1')}
                                                      value={this.state.user.personal.address1}/>
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