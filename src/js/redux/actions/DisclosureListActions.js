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
        let request = { userId: userId };

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


export const REQUEST_CONTRACTOR_DISCLOSURES = "REQUEST_CONTRACTOR_DISCLOSURES";

/**
 * Redux action to request all contractor disclosures.
 * @returns {{type: *}}
 */
export function requestContractorDisclosures() {
    return {
        type: REQUEST_CONTRACTOR_DISCLOSURES
    }
}


export const RECEIVE_CONTRACTOR_DISCLOSURES = "RECEIVE_CONTRACTOR_DISCLOSURES";

/**
 * Redux action to receive all contractor disclosures.
 * @param contractorDisclosures The received contractor disclosures.
 * @param status The status of the fetch result.
 * @param error The error which may have occurred.
 * @returns {{type: *}}
 */
export function receiveContractorDisclosures(contractorDisclosures, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_CONTRACTOR_DISCLOSURES,
        contractorDisclosures: contractorDisclosures,
        receivedAt: Date.now(),
        status: status,
        error: error
    }
}

/**
 * Redux action to fetch all contractor disclosures.
 * @returns {Function} Thunk middleware redux action.
 */
export function fetchContractorDisclosures() {
    return (dispatch, getState) => {
        dispatch(requestContractorDisclosures());
        let userId = getState().user.data.value._id;
        let request = { userId: userId };

        client.httpPost('/disclosure/contractorDisclosures', request)
            .then(result => {
                if (result.hasOwnProperty('contractorDisclosures')) {
                    dispatch(receiveContractorDisclosures(result.contractorDisclosures));
                }
                else {
                    dispatch(receiveContractorDisclosures([]));
                }
            })
            .catch(err => {
                dispatch(receiveContractorDisclosures([], fetchStatusType.error, err));
            })
    }
}