import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

export const REQUEST_VISITOR_DISCLOSURE = "REQUEST_VISITOR_DISCLOSURE";

/**
 * Redux action to request a visitor disclosure.
 * @returns {{type: *}}
 */
export function requestVisitorDisclosure() {
    return {
        type: REQUEST_VISITOR_DISCLOSURE
    }
}


export const RECEIVE_VISITOR_DISCLOSURE = "RECEIVE_VISITOR_DISCLOSURE";

/**
 * Redux action to receive a visitor disclosure.
 * @param visitorDisclosure The received visitor disclosure.
 * @param status The status of the fetch result.
 * @param error The error which may have occurred.
 * @returns {{type: *}}
 */
export function receiveVisitorDisclosure(visitorDisclosure, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_VISITOR_DISCLOSURE,
        visitorDisclosure: visitorDisclosure,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export const SET_VISITOR_DISCLOSURE = "SET_VISITOR_DISCLOSURE";

/**
 * Redux action to set the current visitor disclosure.
 * @param disclosure The current visitor disclosure.
 * @returns {function(*, *): Promise<unknown>}
 */
export function setVisitorDisclosure(disclosure) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) =>
            resolve(dispatch({
                type: SET_VISITOR_DISCLOSURE,
                visitorDisclosure: disclosure
            }))
        )
    }
}

export const UPDATE_VISITOR_DISCLOSURE_FIELD = "UPDATE_VISITOR_DISCLOSURE_FIELD";

/**
 * Redux action to update a field of the current visitor disclosure.
 * @param field The field to be updated.
 * @param value The value to be used for updating the field.
 * @returns {{field: *, type: *, value: *}}
 */
export function updateVisitorDisclosureField(field, value) {
    return {
        type: UPDATE_VISITOR_DISCLOSURE_FIELD,
        field: field,
        value: value
    }
}

/**
 * Redux action to create a new visitor disclosure.
 * @returns {function(*=, *=): Promise<unknown>} Resolves the visitor disclosure from the database or rejects an error.
 */
export function createVisitorDisclosure() {
    return (dispatch, getState) => {
        dispatch(requestVisitorDisclosure());
        let request = Object.assign({}, getState().visitorDisclosure.value);
        request.visitor = getState().user.data.value._id;

        return new Promise((resolve, reject) => {
            client.httpPost('/disclosure/createVisitorDisclosure', request)
                .then(result => {
                    if (result.hasOwnProperty('visitorDisclosure')) {
                        dispatch(receiveVisitorDisclosure(result.visitorDisclosure));
                        resolve(result.visitorDisclosure);
                    }
                    else {
                        dispatch(receiveVisitorDisclosure(getState().visitorDisclosure.value, fetchStatusType.error));
                        reject('Bad Response.');
                    }
                })
                .catch(err => {
                    dispatch(receiveVisitorDisclosure(getState().visitorDisclosure.value, fetchStatusType.error, err));
                    reject(err.message);
                })
        })
    }
}