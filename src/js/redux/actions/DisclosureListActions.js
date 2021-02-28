import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

export const REQUEST_VISITOR_DISCLOSURES = "REQUEST_VISITOR_DISCLOSURES";

/**
 * Redux action to request all visitor disclosures.
 * @returns {{type: *}}
 */
export function requestVisitorDisclosures() {
    return {
        type: REQUEST_VISITOR_DISCLOSURES
    }
}


export const RECEIVE_VISITOR_DISCLOSURES = "RECEIVE_VISITOR_DISCLOSURES";

/**
 * Redux action to receive all visitor disclosures.
 * @param visitorDisclosures The received visitor disclosures.
 * @param status The status of the fetch result.
 * @param error The error which may have occurred.
 * @returns {{type: *}}
 */
export function receiveVisitorDisclosures(visitorDisclosures, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_VISITOR_DISCLOSURES,
        visitorDisclosures: visitorDisclosures,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Redux action to fetch all visitor disclosures.
 * @returns {Function} Thunk middleware redux action.
 */
export function fetchVisitorDisclosures() {
    return (dispatch, getState) => {
        dispatch(requestVisitorDisclosures());
        let userId = getState().user.data.value._id;
        let request = {userId: userId};

        client.httpPost('/disclosure/visitorDisclosures', request)
            .then(result => {
                if (result.hasOwnProperty('visitorDisclosures')) {
                    dispatch(receiveVisitorDisclosures(result.visitorDisclosures));
                }
                else {
                    dispatch(receiveVisitorDisclosures([]));
                }
            })
            .catch(err => {
                dispatch(receiveVisitorDisclosures([], fetchStatusType.error, err));
            })
    }
}