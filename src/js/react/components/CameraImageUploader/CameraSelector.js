import React, {Component} from 'react';
import {Container, Row, Dropdown, DropdownButton, Button} from "react-bootstrap";
import {I18n} from 'react-redux-i18n';
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {imageBitmapToFile, isImageCaptureSupported, dataUriToBlob, blobToURI} from '../../../backend/Utils';
import {createCanvas} from 'canvas';

const MAX_HEIGHT = 1080;
const MAX_WIDTH = 1920;

/**
 * A Component which contains a Dropdown containing all video input devices of the device using this webapp.
 * It's possible to take pictures using this Component.
 */
class CameraSelector extends Component {
    /**
     * Create the Component.
     * @param props The properties of the Component.
     */
    constructor(props) {
        super(props);
        this._handleSelectVideo = this._handleSelectVideo.bind(this);
        this._initDropdownDevices = this._initDropdownDevices.bind(this);
        this._turnOffWebcam = this._turnOffWebcam.bind(this);
        this._handleTakePicture = this._handleTakePicture.bind(this);
        this.state = {
            deviceId: null,
            label: '',
            width: 1920,
            height: 1080,
            devicesDropdown: []
        };
        this.webcamRef = React.createRef();
        this.devicesMap = new Map();
        this.mediaStream = null; // Don't use this in the state, or the camera will go on/off all the time
    }

    /**
     * React lifecycle method, used to init all the video input devices.
     */
    componentWillMount() {
        this._initDropdownDevices();
    }

    /**
     * React lifecycle method, used to turn off all the video input devices, so they won't be blocked in other applications.
     */
    componentWillUnmount() {
        this._turnOffWebcam();
    }

    /**
     * React lifecycle method, used to play the MediaStream so the user sees the camera feed.
     * @param prevPros The previous properties of the Component.
     * @param prevState The previous state of the Component.
     * @param snapshot Snapshot value which cannot be changed.
     */
    componentDidUpdate(prevPros, prevState, snapshot) {
        if (this.webcamRef && this.webcamRef.current) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: false,
                    video: {
                        deviceId: this.state.deviceId,
                        width: this.state.width,
                        height: this.state.height
                    }
                })
                .then(mediaStream => {
                    let video = this.webcamRef.current;
                    if (video) {
                        video.srcObject = mediaStream;
                        video.onloadedmetadata = e => video.play();
                        this.mediaStream = mediaStream;
                    }
                })
                .catch(err => {
                    console.error(err.name, err.message)
                })
        }
    }

    /**
     * Turn off the Webcam by stopping all tracks of the MediaStream.
     * @private
     */
    _turnOffWebcam() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }
    }

    /**
     * Get the device ID.
     * @param device The MediaStreamTrack to get the device ID from; functionality differs from Browser.
     * @returns {string|null|CameraSelector._handleSelectVideo.props|*|ConstrainDOMString|string|boolean}
     * @private
     */
    _getDeviceId(device) {
        if (device.getCapabilities)
            return device.getCapabilities().deviceId;
        return device.deviceId
    }

    /**
     * Init the Webcam-Device-Dropdown by getting all video input devices.
     * @private
     */
    _initDropdownDevices() {
        navigator.mediaDevices.enumerateDevices()
            .then(gotDevices => {
                for (let i = 0; i < gotDevices.length; i++) {
                    if (gotDevices[i].kind === 'videoinput') {
                        this.devicesMap.set(this._getDeviceId(gotDevices[i]), gotDevices[i]);
                    }
                }
                let devicesArray = Array.from(this.devicesMap.values());
                this.setState({
                    devicesDropdown: devicesArray.map(device => {
                        let deviceId = this._getDeviceId(device);
                        return <Dropdown.Item key={deviceId} eventKey={deviceId}>
                            {device.label}
                        </Dropdown.Item>
                    }),
                    deviceId: devicesArray.length > 0 ? this._getDeviceId(devicesArray[0]) : null
                })
            });
    }

    /**
     * Handle the selection of a webcam.
     * @param eventKey The event key representing a device id.
     * @param event The fired event - unused.
     * @private
     */
    _handleSelectVideo(eventKey, event) {
        this._turnOffWebcam();
        let device = this.devicesMap.get(eventKey);
        // FIXME Workaround for max camera resolution to reduce webcam lag - does ignore aspect ratio rn
        let deviceMaxWidth = device.getCapabilities ? device.getCapabilities().width.max : Infinity;
        let deviceMaxHeight = device.getCapabilities ? device.getCapabilities().height.max : Infinity;
        this.setState({
            deviceId: eventKey,
            width: deviceMaxWidth > MAX_WIDTH ? MAX_WIDTH : deviceMaxWidth,
            height: deviceMaxWidth > MAX_HEIGHT ? MAX_HEIGHT : deviceMaxHeight,
        })
    }

    /**
     * Get the title of the Dropdown by displaying default text or the device name if possible.
     * @returns {*}
     * @private
     */
    _getDropdownTitle() {
        let device = this.devicesMap.get(this.state.deviceId);
        return device ? device.label : I18n.t('controls.selectVideo');
    }

    /**
     * Take a picture using the MediaStream- or Canvas-API.
     * @param event The event caused this action - unused.
     * @private
     */
    _handleTakePicture(event) {
        let aspectRatio = this.state.width / this.state.height;

        if (this.mediaStream) {
            // Check for Firefox
            if (isImageCaptureSupported()) {
                this.mediaStream.getTracks().forEach(track => {
                    let imageCapture = new ImageCapture(track);
                    console.log("imageCapture", imageCapture);
                    // Chrome: grabFrame() - Firefox: takePhoto()
                    imageCapture.grabFrame()
                        .then(imageBitmap => {
                            // this.setState({
                            //     file: imageBitmap
                            // });
                            if (this.props.hasOwnProperty('onTakePhoto')) {
                                imageBitmapToFile(imageBitmap).then(blob =>
                                    blobToURI(blob).then(uri => {
                                        this.props.onTakePhoto(blob, uri, aspectRatio)
                                    })
                                )
                            }
                        })
                        .catch(err => {
                            console.error(err.name + ": " + err.message)
                        })
                });
            }
            else {
                let canvas = createCanvas(this.state.width, this.state.height);
                let ctx = canvas.getContext('2d');
                ctx.drawImage(this.webcamRef.current, 0, 0, this.state.width, this.state.height);

                let dataUri = canvas.toDataURL('image/png');
                let dataBlob = dataUriToBlob(dataUri);

                // this.setState({
                //     file: dataBlob
                // });
                if (this.props.hasOwnProperty('onTakePhoto')) {
                    this.props.onTakePhoto(dataBlob, dataUri, aspectRatio);
                }
            }
        }
    }

    /**
     * Render the Component.
     * @returns {*}
     */
    render() {
        return <Container>
            <Row>
                <DropdownButton title={this._getDropdownTitle()}
                                variant="outline-primary"
                                onSelect={this._handleSelectVideo}>
                    {this.state.devicesDropdown}
                </DropdownButton>
            </Row>
            <Row className="mt-2">
                <video autoPlay={true}
                       controls={false}
                       crossOrigin="anonymous"
                       className="camera"
                       ref={this.webcamRef}/>
            </Row>
            <Row>
                <Button variant="outline-primary" className="mr-2 mt-2" onClick={this._handleTakePicture}>
                    <FontAwesomeIcon className='icon' icon={faCamera}/>
                    {I18n.t('controls.takePhoto')}
                </Button>
            </Row>
        </Container>
    }
}

CameraSelector.propTypes = {
    onTakePhoto: PropTypes.func // Is called when a picture is taken - Params: (image : Blob, datatUri : String aspectRatio : Float)
};

export default CameraSelector;