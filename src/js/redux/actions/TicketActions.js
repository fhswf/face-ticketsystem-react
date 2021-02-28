import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

export const REQUEST_TICKET = "REQUEST_TICKET";

/**
 * Redux action to request a ticket.
 * @returns {{type: *}}
 */
export function requestTicket() {
    return {
        type: REQUEST_TICKET
    }
}


export const RECEIVE_TICKET = "RECEIVE_TICKET";

/**
 * Redux action to receive a ticket.
 * @param ticket The received ticket.
 * @param status The status of the fetch result.
 * @param error The error which may have occurred.
 * @returns {{type: *}}
 */
export function receiveTicket(ticket, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_TICKET,
        ticket: ticket,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

export const SET_TICKET = "SET_TICKET";

/**
 * Redux action to set the current ticket.
 * @param ticket The current ticket.
 * @returns {function(*, *): Promise<unknown>}
 */
export function setTicket(ticket) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) =>
            resolve(dispatch({
                type: SET_TICKET,
                ticket: ticket
            }))
        )
    }
}

export const RESET_TICKET = "RESET_TICKET";

/**
 * Redux action to reset a Ticket.
 * @returns {{type: *}}
 */
export function resetTicket() {
    return {
        type: RESET_TICKET
    }
}

export const UPDATE_TICKET_FIELD = "UPDATE_TICKET_FIELD";

/**
 * Redux action to update a field of the current ticket.
 * @param field The field to be updated.
 * @param value The value to be used to update the field.
 * @returns {{field: *, type: *, value: *}}
 */
export function updateTicketField(field, value) {
    return {
        type: UPDATE_TICKET_FIELD,
        field: field,
        value: value
    }
}

export const UPDATE_TICKET_CUSTOM_FIELD = "UPDATE_TICKET_CUSTOM_FIELD";

/**
 * Redux action to update a custom field fo the current ticket.
 * @param field The custom field to be updated.
 * @param value The value to be used to update the custom field.
 * @returns {{field: *, type: *, value: *}}
 */
export function updateTicketCustomField(field, value) {
    return {
        type: UPDATE_TICKET_CUSTOM_FIELD,
        field: field,
        value: value
    }
}

/**
 * Redux action to create a new ticket.
 * @returns {function(*=, *=): Promise<unknown>} The resolved ticket from the database or the rejected error.
 */
export function createTicket() {
    return (dispatch, getState) => {
        dispatch(requestTicket());
        let request = Object.assign({}, getState().ticket.value);
        request.creator = getState().user.data.value._id;

        return new Promise((resolve, reject) => {
            client.httpPost('/ticket/createTicket', request)
                .then(result => {
                    if (result.hasOwnProperty('ticket')) {
                        dispatch(receiveTicket(result.ticket));
                        resolve(result.ticket);
                    }
                    else {
                        dispatch(receiveTicket(getState().ticket.value, fetchStatusType.error));
                        reject('Bad Response.');
                    }
                })
                .catch(err => {
                    dispatch(receiveTicket(getState().ticket.value, fetchStatusType.error, err));
                    reject(err.message);
                })
        })
    }
}