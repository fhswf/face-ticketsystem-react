import produce from "immer";
import _ from "lodash";
import {I18n} from "react-redux-i18n";
import config from "../config/Config";


/**
 * Handle a state change of the self-Component.
 * @param self The 'this' of the calling Component.
 * @param property The state property to be updated.
 * @param isNumeric If true, only allow numeric inputs. Default is false.
 * @returns {Function} A function expecting an event as a parameter, which contains the new value for the property.
 */
export function handleChange(self, property, isNumeric=false) {
    return (event) => {
        let value = event.target.value;
        if (isNumeric) {
            value = value.replace(/[^\d+|]*/g, '');
        }
        self.setState(produce(self.state, draft => {
            draft.didLoginFail = false; // Resets the login failure message
            _.set(draft, property, value);
        }))
    }
}

/**
 * Handle the change of an E-Mail, by checking if the E-Mail is occupied or not.
 * Note: The calling Component (of the this) needs to be connected via Redux.
 * @param self The 'this' of the calling Component.
 * @returns {Function} A functions expecting an event param, which is the change event containing the new email value.
 */
export function handleNewEmailChange(self){
    return event => {
        // Note: Yes, the state will be updated twice (double update of GUI) which is necessary, otherwise the E-Mail
        // Control won't get updated properly (the text won't change for an unknown reason)
        handleChange(self, 'user.email')(event);

        // Determine, whether the email is occupied or not
        if(self.props.isEmailOccupied instanceof Function) {
            self.props.isEmailOccupied(event.target.value)
                .then(isOccupied => {
                    self.setState({isEmailOccupied: isOccupied});
                })
                .catch(err => {
                    self.setState({isEmailOccupied: true});
                })
        }
    }
}

/**
 * Determine whether or not the E-Mail is valid. Its state must contain a 'user' and 'isEmailOccupied' field
 * @param self The 'this' of the calling Component.
 * @returns {boolean} True, if the E-Mail has a valid format, otherwise false.
 */
export function isEmailValid(self) {
    let emailPattern = /\S+@\S+\.\S+/;
    return self.state.user.email && !self.state.isEmailOccupied && emailPattern.test(self.state.user.email);
}

/**
 * Handle a dropdown event.
 * @param properties The properties to be updated.
 * @param self The 'this' of the calling Component.
 * @returns {Function} A function expecting the eventKey containing the value (and the dropdown event (unused)).
 */
export function handleDropdown(self, ...properties) {
    return (eventKey, event) => {
        self.setState(produce(draft => {
            for (let i = 0; i < properties.length; i++) {
                _.set(draft, properties[i], eventKey);
            }
        }))
    }
}

/**
 * Get the Text for the Dropdown to display the currently selected salutation or it's placeholder.
 * @param salutation The current salutation value.
 * @returns string The text to be displayed.
 */
export function getSalutationDropdownTitle(salutation) {
    if (!salutation) {
        return I18n.t('placeholder.salutation');
    }
    return salutation;
}

/**
 * @param password The password to be checked-
 * @returns boolean True, if the typed in password is valid; otherwise false.
 */
export function isPasswordValid(password) {
    return password && password.length >= config.controls.user.password.min;
}

/**
 * @param password The first password.
 * @param repeatedPassword The repeated password.
 * @returns boolean True, if the typed in repeated password is valid; otherwise false.
 */
export function isRepeatedPasswordValid(password, repeatedPassword) {
    return repeatedPassword && repeatedPassword === password;
}

/**
 * Determine Whether or not the typed in value is a name.
 * @param name A String which represents the name of a person.
 * @returns boolean True, if the typed in name is valid; otherwise false.
 */
export function isNameValid(name) {
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
export function isFieldValid(field, length = 1) {
    return field && field.length >= length;
}