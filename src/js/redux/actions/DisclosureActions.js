import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";
// import {emptyVisitorDisclosure} from "../reducers/VisitorDisclosureReducers";

export const REQUEST_VISITOR_DISCLOSURE = "REQUEST_VISITOR_DISCLOSURE";

export function requestVisitorDisclosure() {
    return {
        type: REQUEST_VISITOR_DISCLOSURE
    }
}


export const RECEIVE_VISITOR_DISCLOSURE = "RECEIVE_VISITOR_DISCLOSURE";

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

export function updateVisitorDisclosureField(field, value) {
    return {
        type: UPDATE_VISITOR_DISCLOSURE_FIELD,
        field: field,
        value: value
    }
}


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