import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'
import PropTypes from "prop-types";
import {I18n} from 'react-redux-i18n';

/**
 * A React-Bootstrap Modal Component with a close Button.
 */
class SimpleDialog extends Component {
    /**
     * Create a new SimpleDialog Component.
     * @param props The properties of the Component.
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render the Component.
     * @returns {*} The <Modal> to be rendered.
     */
    render() {
        return <Modal show={this.props.show}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title ? this.props.title : ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.props.text ? this.props.text : ''}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={this.props.handleClose}>
                    {I18n.t('controls.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

SimpleDialog.propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string,
    text: PropTypes.string,
    handleClose: PropTypes.func
};

export default SimpleDialog;