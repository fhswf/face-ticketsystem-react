import React, {Component} from 'react';
import {ActionCreators} from "../../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {I18n} from 'react-redux-i18n';
import {Container, Button, Table, Modal} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import {faFilePdf, faQrcode} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import config from "../../config/Config";
import QRCode from "qrcode.react";
import {fillVisitorDisclosurePDF} from "../../backend/PDFOperations";
import download from 'downloadjs'

const QR_CODE_ID = 'qrcode'; // id to the QRCode component, necessary for downloading it.

/**
 * A React Component for displaying all the disclosures of a user.
 */
class UserDisclosures extends Component {
    /**
     * Create a new UserDisclosures Component.
     * @param props The properties of the Component-
     */
    constructor(props) {
        super(props);
        this._renderDisclosures = this._renderDisclosures.bind(this);
        this._renderQRCode = this._renderQRCode.bind(this);
        this._prepareQRCode = this._prepareQRCode.bind(this);
        this.state = {
            showQR: false,
            currentDisclosure: ''
        }
    }

    /**
     * React lifecycle method, used to fetch all the disclosures of the currently logged in user.
     */
    componentDidMount() {
        this.props.fetchVisitorDisclosures();
    }

    /**
     * Render a Dialog for displaying and downloading the QRCode of the selected disclosure.
     * @returns {*} A Modal dialog COmponent.
     * @private
     */
    _renderQRCode() {
        return <Modal show={this.state.showQR} onHide={() => {this.setState({showQR: false})}} size="sm">
            <Modal.Header closeButton>
                <Modal.Title>{I18n.t('header.qr')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={"align-self-center"}>
                <QRCode value={JSON.stringify(this.state.currentDisclosure)}
                        renderAs='canvas'
                        size={256}
                        id={QR_CODE_ID}
                        name={QR_CODE_ID}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={() => {
                    // Save the QR-Code as an image
                    const canvas = document.getElementById(QR_CODE_ID);
                    const pngUrl = canvas.toDataURL("image/png");
                    download(pngUrl, this.state.currentDisclosure._id + '.png', 'image/png');
                }}>
                    {I18n.t('controls.download')}
                </Button>
            </Modal.Footer>
        </Modal>
    }

    /**
     * Selects a disclosure and opens the QRCode Dialog Compoennt.
     * @param disclosure The disclosure to be used to create a QRCode.
     * @private
     */
    _prepareQRCode(disclosure) {
        this.props.setVisitorDisclosure(disclosure);
        this.setState({
            showQR: true,
            currentDisclosure: disclosure
        })
    }

    /**
     * Render all the disclosures as table elements.
     * @returns {*} The disclosures as table elements.
     * @private
     */
    _renderDisclosures() {
        if (!this.props.disclosureList || !this.props.disclosureList.items || !this.props.disclosureList.items.visitorDisclosures)
            return <></>;
        return this.props.disclosureList.items.visitorDisclosures.map(visitorDisclosure => {
            return <tr key={visitorDisclosure._id}>
                <td>{
                    new Date(visitorDisclosure.formDate).toLocaleDateString(config.i18n.time)
                }</td>
                <td>{I18n.t('header.disclosure.disclosureVisitor')}</td>
                <td>
                    <Button className="mr-2" onClick={() => {
                        this.props.setVisitorDisclosure(visitorDisclosure);
                        this.props.history.push(`${this.props.match.path}/visitor`);
                    }}>
                        {I18n.t('controls.showDetails')}
                    </Button>

                    <Button className="mr-2" onClick={() => {
                        this._prepareQRCode(visitorDisclosure)
                    }}>
                        <FontAwesomeIcon className='icon' icon={faQrcode}/>
                        {I18n.t('controls.generateQR')}
                    </Button>

                    <Button className="mr-2" onClick={() => {
                        fillVisitorDisclosurePDF(visitorDisclosure, this.props.user.data.value)
                    }}>
                        <FontAwesomeIcon className='icon' icon={faFilePdf}/>
                        {I18n.t('controls.generatePDF')}
                    </Button>
                </td>
            </tr>
        })
    }

    /**
     * Render the high order Component.
     * @returns {*} The COmponent to be rendered.
     */
    render() {
        return <Container>
            {this._renderQRCode()}
            <Table>
                <thead>
                <tr>
                    <th>{I18n.t('table.date')}</th>
                    <th>{I18n.t('table.documentType')}</th>
                    <th>{I18n.t('table.actions')}</th>
                </tr>
                </thead>
                <tbody>
                {this._renderDisclosures()}
                </tbody>
            </Table>
        </Container>
    }
}


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        user: state.user,
        disclosureList: state.disclosureList
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDisclosures));