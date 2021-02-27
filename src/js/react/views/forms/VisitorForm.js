import React, {Component} from 'react';
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import _ from "lodash";
import SimpleDialog from "../../components/SimpleDialog";

class VisitorForm extends Component {
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

    _finalize(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validated: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validated: true});
        }
        else {
            this.props.createVisitorDisclosure()
                .then(disclosure => {
                    this.setState({saveSuccess: true})
                })
                .catch(err => {
                    this.setState({saveFailed: true})
                });
        }
    }

    _renderRadioButtonFormGroup(valueProperty, labelProperty, doRenderLabel=true) {
        return <Form.Group as={Row} className={"mb-0 mt-0" + doRenderLabel ? "" : " pt-0"}>
            {
                doRenderLabel && <Form.Label column sm="5">{I18n.t(labelProperty)}:</Form.Label>
            }
            <Col className={"d-inline-flex "}>
                <Form.Check type="radio"
                            disabled={this.props.readOnly}
                            onChange={() => {
                                this.props.updateVisitorDisclosureField(valueProperty, true);
                            }}
                            checked={_.get(this.props.visitorDisclosure, valueProperty)}
                            name={labelProperty}
                            required inline label={I18n.t('data.yes')}/>
                <Form.Check type="radio"
                            disabled={this.props.readOnly}
                            onChange={() => {
                                this.props.updateVisitorDisclosureField(valueProperty, false);
                            }}
                            checked={!_.get(this.props.visitorDisclosure, valueProperty)}
                            name={labelProperty}
                            required inline label={I18n.t('data.no')}/>
                <br/>
                <Form.Control.Feedback type="invalid">
                    {I18n.t('feedback.disclosure.option')}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    }

    _renderTextFieldFormGroup(valueProperty, labelProperty, feedbackProperty, required=true) {
        return <Form.Group as={Row}>
            <Form.Label column sm="4">{I18n.t(labelProperty)}:</Form.Label>
            <Col>
                <Form.Control type="text" placeholder={I18n.t(labelProperty)}
                              onChange={(event) => {
                                  this.props.updateVisitorDisclosureField(valueProperty, event.target.value)
                              }}
                              required={required}
                              disabled={this.props.readOnly}
                              value={_.get(this.props.visitorDisclosure, valueProperty) || ''}
                />
                <Form.Control.Feedback type="invalid">
                    {I18n.t(feedbackProperty)}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    }

    render() {
        let self = this;
        return <Container id="basic-form">
            <SimpleDialog show={this.state.saveFailed}
                          handleClose={() => {
                              self.setState({saveFailed: false})
                          }}
                          title={I18n.t('message.saveDisclosureFailTitle')}
                          text={I18n.t('message.saveDisclosureFailText')}
            />
            <SimpleDialog show={this.state.saveSuccess}
                          handleClose={() => {
                              self.setState({saveSuccess: false});
                              self.props.history.push('/disclosures');
                          }}
                          title={I18n.t('message.saveDisclosureSuccessTitle')}
                          text={I18n.t('message.saveDisclosureSuccessText')}
            />
            <Row>
                <Col>
                    <h2 id='special-title'>{I18n.t('header.disclosure.disclosureVisitor')}</h2>
                    <h4>{I18n.t('information.disclosure.greetingVisitor')}</h4>
                    <p>{I18n.t('information.disclosure.introduction')}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4>{I18n.t('header.disclosure.patient')}</h4>
                    <Form onSubmit={this._finalize} noValidate validated={this.state.validated}>
                        {this._renderTextFieldFormGroup('patient', 'data.disclosure.name', 'feedback.disclosure.name')}
                        {this._renderTextFieldFormGroup("station", 'data.disclosure.station', 'feedback.disclosure.station')}
                        <h4>{I18n.t('header.disclosure.healthComplains')}</h4>
                        <h5 id="special-title">{I18n.t('header.disclosure.symptoms')}:</h5>
                        {this._renderRadioButtonFormGroup('symptoms.cough', 'data.disclosure.cough')}
                        {this._renderRadioButtonFormGroup('symptoms.musclePain', 'data.disclosure.musclePain')}
                        {this._renderRadioButtonFormGroup('symptoms.fever', 'data.disclosure.fever')}
                        {this._renderRadioButtonFormGroup('symptoms.vomit', 'data.disclosure.vomit')}
                        {this._renderRadioButtonFormGroup('symptoms.throat', 'data.disclosure.throat')}
                        {this._renderRadioButtonFormGroup('symptoms.bellyache', 'data.disclosure.bellyache')}
                        {this._renderRadioButtonFormGroup('symptoms.headache', 'data.disclosure.headache')}
                        {this._renderRadioButtonFormGroup('symptoms.taste', 'data.disclosure.taste')}
                        {this._renderRadioButtonFormGroup('symptoms.smell', 'data.disclosure.smell')}
                        <h5>{I18n.t('header.disclosure.airwaySymptoms')}</h5>
                        {this._renderRadioButtonFormGroup('symptoms.air', 'data.disclosure.air')}
                        {this._renderRadioButtonFormGroup('symptoms.breathless', 'data.disclosure.breathless')}
                        <p>{I18n.t('question.disclosure.returnRiskarea')}</p>
                        {this._renderRadioButtonFormGroup('returnRiskarea', 'question.disclosure.returnRiskarea', false)}
                        {
                            this.props.visitorDisclosure.returnRiskarea && this._renderTextFieldFormGroup('riskarea', 'data.disclosure.riskarea', 'feedback.disclosure.riskarea')
                        }
                        {
                            this.props.visitorDisclosure.returnRiskarea && this._renderTextFieldFormGroup('riskdate', 'data.disclosure.riskdate', 'feedback.disclosure.riskdate')
                        }
                        <p>{I18n.t('question.disclosure.quarantine')}</p>
                        {this._renderRadioButtonFormGroup('quarantine', 'question.disclosure.quarantine', false)}
                        <p><u>{I18n.t('information.disclosure.quarantine')}</u></p>
                        <p>{I18n.t('question.disclosure.contactLungs')}</p>
                        {this._renderRadioButtonFormGroup('contactLungs', 'question.disclosure.contactLungs', false)}
                        <p>{I18n.t('question.disclosure.contactCovid')}</p>
                        {this._renderRadioButtonFormGroup('contactCovid', 'question.disclosure.contactCovid', false)}
                        <h5>{I18n.t('header.disclosure.note')}</h5>
                        <p>{I18n.t('information.disclosure.noAccess')}</p>
                        <h5>{I18n.t('header.disclosure.selfCommitment')}</h5>
                        <p>{I18n.t('information.disclosure.selfCommitment')}</p>

                        <h5>{I18n.t('header.disclosure.dataPersistence')}</h5>
                        <Form.Group as={Row} className={"mb-0 mt-0 pt-0"}>
                            <Col>
                                <Form.Check onChange={() => {}}
                                            // checked={}
                                            disabled={this.props.readOnly}
                                            name='dataPersistence'
                                            label={I18n.t('information.disclosure.dataPersistence1')}
                                            required inline/>
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

VisitorForm.propTypes = {
    readOnly: PropTypes.bool    // Whether or not the Form is editable or not
};


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        visitorDisclosure: state.visitorDisclosure.value
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VisitorForm));