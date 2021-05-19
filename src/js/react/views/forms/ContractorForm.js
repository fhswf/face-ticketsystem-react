import React, { Component } from 'react';
import { ActionCreators } from "../../../redux/actions/ActionCreators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { I18n } from 'react-redux-i18n';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import SimpleDialog from "../../components/SimpleDialog";

/**
 * A React Component for creating a new contractor disclosure.
 */
class ContractorForm extends Component {
    /**
     * Create a new ContractorForm.
     * @param props The properties of the Component.
     */
    constructor(props) {
        super(props);
        this._finalize = this._finalize.bind(this);
        this._renderRadioButtonFormGroup = this._renderRadioButtonFormGroup.bind(this);
        this._renderTextFieldFormGroup = this._renderTextFieldFormGroup.bind(this);
        this.state = {
            validated: false,
            saveFailed: false,
            saveSuccess: false
        };
    }

    /**
     * Create the new contractor disclosure.
     * @param event The <Form>-Event to be validated.
     * @private
     */
    _finalize(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({ validated: false });
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({ validated: true });
        }
        else {
            this.props.createContractorDisclosure()
                .then(disclosure => {
                    this.setState({ saveSuccess: true })
                })
                .catch(err => {
                    this.setState({ saveFailed: true })
                });
        }
    }

    /**
     * Render a <Form.Group> for two Radio-Buttons.
     * @param valueProperty The name of the value of the contractor disclosure to be related to the <Form.Check>.
     * @param labelProperty The i18n value for the Label to be displayed and used as the <Form.Check>-Name.
     * @param doRenderLabel If true, the <Form.Label> will be rendered. Default is true.
     * @returns The <Form.Group> to be rendered.
     * @private
     */
    _renderRadioButtonFormGroup(valueProperty, labelProperty, doRenderLabel = true) {
        return <Form.Group as={Row} className={"mb-0 mt-0" + doRenderLabel ? "" : " pt-0"}>
            {
                doRenderLabel && <Form.Label column sm="5">{I18n.t(labelProperty)}:</Form.Label>
            }
            <Col className={"d-inline-flex "}>
                <Form.Check type="radio"
                    disabled={this.props.readOnly}
                    onChange={() => {
                        this.props.updateContractorDisclosureField(valueProperty, true);
                    }}
                    checked={_.get(this.props.contractorDisclosure, valueProperty)}
                    name={labelProperty}
                    required inline label={I18n.t('data.yes')} />
                <Form.Check type="radio"
                    disabled={this.props.readOnly}
                    onChange={() => {
                        this.props.updateContractorDisclosureField(valueProperty, false);
                    }}
                    checked={_.get(this.props.contractorDisclosure, valueProperty) == false}
                    name={labelProperty}
                    required inline label={I18n.t('data.no')} />
                <br />
                <Form.Control.Feedback type="invalid">
                    {I18n.t('feedback.disclosure.option')}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    }

    /**
     * Render a <Form.Group> for a text field.
     * @param valueProperty The name of the value of the contractor disclosure to be related to the <Form.Control>.
     * @param labelProperty The i18n value for the Label to be displayed and used as the <Form.Check>-Name.
     * @param feedbackProperty The i18n value for displaying an error message, if the input is invalid.
     * @param required Whether or not the field is required. Default is true.
     * @returns The <Form.Group> to be rendered.
     * @private
     */
    _renderTextFieldFormGroup(valueProperty, labelProperty, feedbackProperty, required = true) {
        return <Form.Group as={Row}>
            <Form.Label column sm="4">{I18n.t(labelProperty)}:</Form.Label>
            <Col>
                <Form.Control type="text" placeholder={I18n.t(labelProperty)}
                    onChange={(event) => {
                        this.props.updateContractorDisclosureField(valueProperty, event.target.value)
                    }}
                    required={required}
                    disabled={this.props.readOnly}
                    value={_.get(this.props.contractorDisclosure, valueProperty) || ''}
                />
                <Form.Control.Feedback type="invalid">
                    {I18n.t(feedbackProperty)}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    }

    /**
     * Render the Component.
     * @returns The Component to be rendered.
     */
    render() {
        console.log('ContractorForm render')
        let self = this;
        return <Container id="basic-form">
            <SimpleDialog show={this.state.saveFailed}
                handleClose={() => {
                    self.setState({ saveFailed: false })
                }}
                title={I18n.t('message.saveDisclosureFailTitle')}
                text={I18n.t('message.saveDisclosureFailText')}
            />
            <SimpleDialog show={this.state.saveSuccess}
                handleClose={() => {
                    self.setState({ saveSuccess: false });
                    self.props.history.push('/disclosures');
                }}
                title={I18n.t('message.saveDisclosureSuccessTitle')}
                text={I18n.t('message.saveDisclosureSuccessText')}
            />
            <Row>
                <Col>
                    <h2 id='special-title'>{I18n.t('header.disclosure.disclosureContractor')}</h2>
                    <h4>{I18n.t('information.disclosure.greetingContractor')}</h4>
                    <p>{I18n.t('information.disclosure.introductionContractor')}</p>
                    <p style={{ color: "#a50b32", textSize: '120%' }}>{I18n.t('information.disclosure.noticeContractor')}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4>{I18n.t('header.disclosure.contractor')}</h4>
                    <Form onSubmit={this._finalize} noValidate validated={this.state.validated}>
                        {this._renderTextFieldFormGroup('firm', 'data.disclosure.firm', 'feedback.disclosure.firm')}
                        {this._renderTextFieldFormGroup('name', 'data.disclosure.name', 'feedback.disclosure.name')}
                        {this._renderTextFieldFormGroup('address', 'data.disclosure.address', 'feedback.disclosure.address')}
                        {this._renderTextFieldFormGroup('phone', 'data.disclosure.phone', 'feedback.disclosure.phone')}
                        {this._renderTextFieldFormGroup("station", 'data.disclosure.station', 'feedback.disclosure.station')}

                        <h4>{I18n.t('header.disclosure.healthComplains')}</h4>
                        <h5 id="special-title">{I18n.t('header.disclosure.symptoms')}:</h5>
                        {this._renderRadioButtonFormGroup('symptoms.air', 'data.disclosure.air')}
                        {this._renderRadioButtonFormGroup('symptoms.cough', 'data.disclosure.cough')}
                        {this._renderRadioButtonFormGroup('symptoms.musclePain', 'data.disclosure.musclePain')}
                        {this._renderRadioButtonFormGroup('symptoms.fever', 'data.disclosure.fever')}
                        {this._renderRadioButtonFormGroup('symptoms.vomit', 'data.disclosure.vomit')}
                        {this._renderRadioButtonFormGroup('symptoms.throat', 'data.disclosure.throat')}
                        {this._renderRadioButtonFormGroup('symptoms.bellyache', 'data.disclosure.bellyache')}
                        {this._renderRadioButtonFormGroup('symptoms.headache', 'data.disclosure.headache')}
                        {this._renderRadioButtonFormGroup('symptoms.taste', 'data.disclosure.taste')}
                        {this._renderRadioButtonFormGroup('symptoms.smell', 'data.disclosure.smell')}

                        <p>{I18n.t('question.disclosure.returnRiskarea')}</p>
                        {this._renderRadioButtonFormGroup('returnRiskarea', 'question.disclosure.returnRiskarea', false)}
                        {
                            this.props.contractorDisclosure.returnRiskarea && this._renderTextFieldFormGroup('riskarea', 'data.disclosure.riskarea', 'feedback.disclosure.riskarea')
                        }
                        {
                            this.props.contractorDisclosure.returnRiskarea && this._renderTextFieldFormGroup('riskdate', 'data.disclosure.riskdate', 'feedback.disclosure.riskdate')
                        }

                        <p>{I18n.t('question.disclosure.contactLungs')}</p>
                        {this._renderRadioButtonFormGroup('contactLungs', 'question.disclosure.contactLungs', false)}
                        <p>{I18n.t('question.disclosure.contactCovid')}</p>
                        {this._renderRadioButtonFormGroup('contactCovid', 'question.disclosure.contactCovid', false)}
                        <h5>{I18n.t('header.disclosure.note')}</h5>
                        <p>{I18n.t('information.disclosure.noAccessContractor')}</p>
                        <h5>{I18n.t('header.disclosure.selfCommitment')}</h5>
                        <p>{I18n.t('information.disclosure.selfCommitmentContractor')}</p>

                        <h5>{I18n.t('header.disclosure.dataPersistence')}</h5>
                        <Form.Group as={Row} className={"mb-0 mt-0 pt-0"}>
                            <Col>
                                <Form.Check onChange={() => { }}
                                    // checked={}
                                    disabled={this.props.readOnly}
                                    name='dataPersistence'
                                    label={I18n.t('information.disclosure.dataPersistence1')}
                                    required inline />
                                <Form.Control.Feedback type="invalid">
                                    {I18n.t('feedback.disclosure.option')}
                                </Form.Control.Feedback>
                            </Col>
                            {/*<Col style={{flexGrow: 1}}>*/}
                            {/*    <p>{I18n.t('information.disclosure.dataPersistence1')}</p>*/}
                            {/*</Col>*/}
                        </Form.Group>
                        <p>{I18n.t('information.disclosure.dataPersistence2')}</p>

                        {
                            !this.props.readOnly &&
                            <Button variant="primary" type="submit">
                                {I18n.t('controls.saveDisclosure')}
                            </Button>
                        }
                    </Form>
                </Col>
            </Row>
        </Container>
    }
}

ContractorForm.propTypes = {
    readOnly: PropTypes.bool    // Whether or not the Form is editable or not
};


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        contractorDisclosure: state.contractorDisclosure.value
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractorForm));