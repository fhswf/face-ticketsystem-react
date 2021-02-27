import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

export const REQUEST_TICKET = "REQUEST_TICKET";

export function requestTicket() {
    return {
        type: REQUEST_TICKET
    }
}


export const RECEIVE_TICKET = "RECEIVE_TICKET";

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

export const UPDATE_TICKET_FIELD = "UPDATE_TICKET_FIELD";

export function updateTicketField(field, value) {
    return {
        type: UPDATE_TICKET_FIELD,
        field: field,
        value: value
    }
}

export const UPDATE_TICKET_CUSTOM_FIELD = "UPDATE_TICKET_CUSTOM_FIELD";

export function updateTicketCustomField(field, value) {
    return {
        type: UPDATE_TICKET_CUSTOM_FIELD,
        field: field,
        value: value
    }
}


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