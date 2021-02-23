import './CameraImageUploader.css';

import React, {Component} from 'react';
import {Container, Row, Col, Button, Card} from "react-bootstrap";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Cropper from 'react-easy-crop';
import {createCanvas} from 'canvas';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCamera, faFileUpload, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {I18n} from 'react-redux-i18n';
import {dataUriToBlob, hasImageOnlyOneFace, createImageFromDataURL} from '../../../backend/Utils';
import CameraSelector from "./CameraSelector";

/**
 * The sub Components which can be rendered.
 * @type {{captureSelection: string, imageUpload: string, camera: string, imagePreview: string}}
 */
const components = {
    captureSelection: 'captureSelection',
    imageUpload: 'imageUpload',
    camera: 'camera',
    imagePreview: 'imagePreview'
};

class CameraImageUploader extends Component {
    constructor(props) {
        super(props);
        this._handleAcceptDrop = this._handleAcceptDrop.bind(this);
        this._cropImage = this._cropImage.bind(this);
        this._changeView = this._changeView.bind(this);
        this.cropperRef = React.createRef();
        this.state = {
            activeComponent: components.captureSelection,
            prevComponent: components.captureSelection,
            isFileDraggedOver: false,
            isFileRejected: false,
            file: null,
            filePreviewURL: '',
            crop: {
                x: 0,
                y: 0
            },
            croppedImage: null,
            croppedAreaPixels: null,
            zoom: 1,
            aspectRatio: 1,
            imageSize: {
                width: 0,
                height: 0
            }
        };
    }

    /**
     * Change the Component to de displayed.
     * @param destiny The new Component to be rendered.
     * @private
     */
    _changeView(destiny) {
        this.setState({
            prevComponent: this.state.activeComponent,
            activeComponent: destiny
        });
    }

    /**
     * Get the CSS Class Names for the Dropzone component to be rendered.
     * @returns {string} The classNames for the Dropzone Component.
     * @private
     */
    _getDropzoneClassNames() {
        let activeClasses = ["dropzone"];
        if (this.state.isFileDraggedOver) {
            activeClasses.push("dropZoneActiveDrag")
        }
        if (this.state.isFileRejected) {
            activeClasses.push("dropZoneRejectDrag")
        }
        return activeClasses.join(" ")
    }

    /**
     * Handle selecting an image to upload.
     * @param files The selectedCountry files to be uploaded.
     * @private
     */
    _handleAcceptDrop(files) {
        if (!files || files.length === 0) {
            return;
        }

        let fileReader = new FileReader();
        let file = files[0];
        fileReader.onloadend = () => {
            createImageFromDataURL(fileReader.result)
                .then(image => {
                    this.setState({
                        file: file,
                        filePreviewURL: fileReader.result,
                        isFileRejected: false,
                        prevComponent: this.state.activeComponent,
                        activeComponent: components.imagePreview,
                        aspectRatio: image.width / image.height,
                        imageSize: {
                            width: image.width,
                            height: image.height
                        }
                    });
                });
        };
        fileReader.readAsDataURL(file);

        if (this.props.hasOwnProperty('onPictureSelected')) {
            this.props.onPictureSelected(file);
        }
        if (this.props.hasOwnProperty('onPictureEvaluated')) {
            hasImageOnlyOneFace(file).then(hasFace => this.props.onPictureEvaluated(hasFace));
        }
    }

    /**
     * Crops the current image.
     * @param croppedAreaPixels The area to be cropped, containing an X/Y-Offset und a height and width.
     * @private
     */
    _cropImage(croppedAreaPixels) {
        createImageFromDataURL(this.state.filePreviewURL).then(image => {
            let canvas = createCanvas(croppedAreaPixels.width, croppedAreaPixels.height);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            let dataUri = canvas.toDataURL('image/png');
            let dataBlob = dataUriToBlob(dataUri);

            this.setState({
                croppedImage: dataBlob
            });
            if (this.props.hasOwnProperty('onPictureSelected')) {
                this.props.onPictureSelected(dataBlob);
            }
            if (this.props.hasOwnProperty('onPictureEvaluated')) {
                hasImageOnlyOneFace(dataBlob).then(hasFace => this.props.onPictureEvaluated(hasFace));
            }
        });
    }

    /**
     * Renders the Component.
     * @returns {*} The React Component to be rendered.
     */
    render() {
        return <>
            {
                this.state.activeComponent === components.captureSelection &&
                <Container>
                    <Row>
                        <Button variant="outline-primary" className="mr-2"
                                onClick={() => this._changeView(components.camera)}
                        >
                            <FontAwesomeIcon className='icon' icon={faCamera}/>
                            {I18n.t('controls.camera')}
                        </Button>
                        <Button variant="outline-primary" onClick={() =>
                            this.setState({activeComponent: components.imageUpload})}
                        >
                            <FontAwesomeIcon className='icon' icon={faFileUpload}/>
                            {I18n.t('controls.upload')}
                        </Button>
                    </Row>
                </Container>
            }
            {
                this.state.activeComponent === components.imageUpload &&
                <Container>
                    <Row>
                        <Dropzone disabled={this.props.isUploading}
                                  onDragLeave={() => this.setState({isFileDraggedOver: false})}
                                  onDragEnter={() => this.setState({isFileDraggedOver: true})}
                                  onDrop={() => this.setState({isFileDraggedOver: false})}
                                  onDropAccepted={(files) => this._handleAcceptDrop(files)}
                                  onDropRejected={() => this.setState({isFileRejected: true})}
                                  multiple={false}
                                  accept="image/jpeg,image/png,image/bmp"
                        >
                            {({getRootProps, getInputProps}) => (
                                <div {...getRootProps()} className={this._getDropzoneClassNames()}>
                                    <input {...getInputProps()}/>
                                    {
                                        <p className="align-items-center justify-content-center">
                                            {this.props.placeholder}
                                        </p>
                                    }
                                </div>
                            )}
                        </Dropzone>
                    </Row>
                    <Row>
                        <Button variant="outline-primary" className="mr-2 mt-2"
                                onClick={() => this._changeView(components.captureSelection)}
                        >
                            <FontAwesomeIcon className='icon' icon={faChevronLeft}/>
                            {I18n.t('controls.changeUpload')}
                        </Button>
                    </Row>
                </Container>

            }
            {
                this.state.activeComponent === components.camera &&
                <Container>
                    <Row>
                        <CameraSelector onTakePhoto={(file, dataUri, aspectRatio) => {
                            this.setState({
                                filePreviewURL: dataUri,
                                aspectRatio: aspectRatio
                            });
                            this._handleAcceptDrop([file]);
                        }}/>
                    </Row>
                    <Row>
                        <Button variant="outline-primary" className="mr-2 mt-2"
                                onClick={() => this._changeView(components.captureSelection)}
                        >
                            <FontAwesomeIcon className='icon' icon={faChevronLeft}/>
                            {I18n.t('controls.changeUpload')}
                        </Button>
                    </Row>
                </Container>
            }
            {
                this.state.activeComponent === components.imagePreview &&
                <Container>
                    <Row>
                        <div className="imageContainer" style={{aspectRatio: this.state.aspectRatio}}>
                            {/*<Image fluid src={this.state.filePreviewURL}/>*/}
                            <Cropper image={this.state.filePreviewURL}
                                     crop={this.state.crop}
                                     zoom={this.state.zoom}
                                     aspect={1}
                                     ref={this.cropperRef}
                                     onCropChange={crop => this.setState({crop: crop})}
                                     onZoomChange={zoom => this.setState({zoom: zoom})}
                                     onCropComplete={(croppedArea, croppedAreaPixels) => {
                                         this._cropImage(croppedAreaPixels);
                                     }}
                                     classes={{
                                         // containerClassName: "cropContainer",
                                         // mediaClassName: "cropMedia",
                                         // cropAreaClassName: "cropArea"
                                     }}
                                     style={{
                                         containerStyle: {
                                             width: this.state.imageSize.width,
                                             height: this.state.imageSize.height,
                                             maxHeight:
                                                 this.cropperRef && this.cropperRef.current && this.cropperRef.current.style
                                                 ? this.cropperRef.current.style.cropAreaStyle.height
                                                 : '100%',
                                             maxWidth: '100%',
                                             paddingBottom: '100%',
                                             // position: 'relative'
                                         }
                                     }}
                            />
                        </div>
                    </Row>
                    <Row>
                        <Button variant="outline-primary" className="mr-2 mt-2"
                                onClick={() => this._changeView(this.state.prevComponent)}
                        >
                            {
                                this.state.prevComponent === components.imageUpload &&
                                <>
                                    <FontAwesomeIcon className='icon' icon={faFileUpload}/>
                                    {I18n.t('controls.reupload')}
                                </>
                            }
                            {
                                this.state.prevComponent === components.camera &&
                                <>
                                    <FontAwesomeIcon className='icon' icon={faCamera}/>
                                    {I18n.t('controls.retakePhoto')}
                                </>
                            }
                        </Button>
                        <Button variant="outline-primary" className="mr-2 mt-2"
                                onClick={() => this._changeView(components.captureSelection)}
                        >
                            <FontAwesomeIcon className='icon' icon={faChevronLeft}/>
                            {I18n.t('controls.changeUpload')}
                        </Button>
                    </Row>
                </Container>
            }
        </>
    }
}

CameraImageUploader.propTypes = {
    onPictureSelected: PropTypes.func,  // Is called when capturing an image - Param: file
    onPictureEvaluated: PropTypes.func, // Is called after face-api.js evaluated the image - Param: hasFace
    isUploading: PropTypes.bool,        // If true, the Upload-Button will be disabled
    placeholder: PropTypes.string       // The message to be displayed within the upload text
};

export default CameraImageUploader;