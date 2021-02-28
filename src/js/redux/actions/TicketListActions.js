import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

export const REQUEST_TICKETS = "REQUEST_TICKETS";

export function requestTickets() {
    return {
        type: REQUEST_TICKETS
    }
}


export const RECEIVE_TICKETS = "RECEIVE_TICKETS";

export function receiveTickets(tickets, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_TICKETS,
        tickets: tickets,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

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