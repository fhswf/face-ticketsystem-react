import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

export const REQUEST_TICKETS = "REQUEST_TICKETS";

/**
 * Redux action to request all ticket.
 * @returns {{type: *}}
 */
export function requestTickets() {
    return {
        type: REQUEST_TICKETS
    }
}


export const RECEIVE_TICKETS = "RECEIVE_TICKETS";

/**
 * Redux action to receive all tickets.
 * @param tickets The received tickets.
 * @param status The status of the fetch result.
 * @param error The error which may have occurred.
 * @returns {{type: *}}
 */
export function receiveTickets(tickets, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_TICKETS,
        tickets: tickets,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Redux action to fetch all tickets.
 * @returns {Function} Redux thunk middleware action.
 */
export function fetchTickets() {
    return (dispatch, getState) => {
        dispatch(requestTickets());

        client.httpGet('/ticket/tickets')
            .then(result => {
                if (result.hasOwnProperty('tickets')) {
                    dispatch(receiveTickets(result.tickets));
                }
                else {
                    dispatch(receiveTickets([]));
                }
            })
            .catch(err => {
                dispatch(receiveTickets([], fetchStatusType.error, err));
            })
    }
}