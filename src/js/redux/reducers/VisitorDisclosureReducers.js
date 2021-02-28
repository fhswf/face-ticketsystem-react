import createReducer from "./CreateReducer";
import * as DisclosureActions from '../actions/DisclosureActions';
import fetchStatusType from "../actions/FetchStatusType";
import {emptyUser} from "./AccountReducers";
import _ from 'lodash';

/**
 * An empty visitor disclosure.
 */
export const emptyVisitorDisclosure = {
    visitor: emptyUser,
    patient: '',
    station: '',
    symptoms: {
        cough: false,
        musclePain: false,
        fever: false,
        vomit: false,
        throat: false,
        bellyache: false,
        headache: false,
        taste: false,
        smell: false,
        air: false,
        breathless: false
    },
    returnRiskarea: false,
    riskarea: '',
    riskdate: '',
    quarantine: false,
    contactLungs: false,
    contactCovid: false,
    formDate: new Date()
};

/**
 * Redux reducer for an visitor disclosure.
 * @type {reducer}
 */
export const visitorDisclosure = createReducer({
    value: emptyVisitorDisclosure,
    isFetching: false,
    lastUpdated: undefined,
    status: fetchStatusType.success,
    error: null
}, {
    [DisclosureActions.REQUEST_VISITOR_DISCLOSURE](draft, action) {
        draft.isFetching = true;
    },
    [DisclosureActions.SET_VISITOR_DISCLOSURE](draft, action) {
        draft.value = action.visitorDisclosure;
    },
    [DisclosureActions.UPDATE_VISITOR_DISCLOSURE_FIELD](draft, action) {
        _.set(draft.value, action.field, action.value);
    },
    [DisclosureActions.RECEIVE_VISITOR_DISCLOSURE](draft, action) {
        draft.isFetching = false;
        draft.value = action.visitorDisclosure;
        draft.lastUpdated = action.receivedAt;
        draft.status = action.status;
        draft.error = action.error;
    }
});