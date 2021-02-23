import React, {Component} from 'react'
import Flag from 'react-flagkit'
import {Dropdown} from 'react-bootstrap'
import {country2currency, currency2country} from "./CountryCurrencyMapping";
import PropTypes from "prop-types";

/**
 * A Dropdown React-Bootstrap Component for picking a currency.
 */
class CurrencyPicker extends Component {
    constructor(props) {
        super(props);
        this._handleDropdown = this._handleDropdown.bind(this);
    }

    /**
     * Renders the Dropdown.Items with a Flag and the currency name.
     * @returns {*[]}
     * @private
     */
    _renderOptions() {
        return Object.keys(country2currency).map((key, index) => {
            return <Dropdown.Item key={key} eventKey={key} className='m-0'>
                <div className='d-flex m-0 p-0 align-items-center'>
                    <Flag country={key} className='m-0 p-0'/>
                    <p className='p-0 m-0 ml-2'>{country2currency[key]}</p>
                </div>
            </Dropdown.Item>
        })
    }

    /**
     * Handle a dropdown selection. Calls the onSelect property function with the selectedCountry currency.
     * @param event The selectedCountry country code.
     * @private
     */
    _handleDropdown(event) {
        if(this.props.hasOwnProperty('onSelect') && typeof this.props.onSelect === 'function') {
            this.props.onSelect(event, country2currency[event]);
        }
    }

    /**
     * Render the React-Bootstrap Component.
     * @returns {*} The Component to be rendered.
     */
    render() {
        return (
            <Dropdown variant="outline-primary"
                      onSelect={this._handleDropdown}>
                <Dropdown.Toggle variant="outline-primary" className='d-flex m-0 align-items-center'>
                    <Flag country={currency2country[this.props.currency]} className='m-0 p-0'/>
                    <p className='p-0 m-0 ml-2'>{this.props.currency}</p>
                </Dropdown.Toggle>
                <Dropdown.Menu id='scrollable-dropdown'>
                    {this._renderOptions()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

CurrencyPicker.propTypes = {
    onSelect: PropTypes.func,   // Is called when selecting a currency - 2 Params: country code, currency code
    currency: PropTypes.string  // The currency to be displayed
};

export default CurrencyPicker