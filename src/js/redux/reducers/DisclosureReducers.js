import createReducer from "./CreateReducer";
import * as DisclosureActions from '../actions/DisclosureActions';
import fetchStatusType from "../actions/FetchStatusType";
import { emptyUser } from "./AccountReducers";
import _ from 'lodash';

/**
 * An empty visitor disclosure.
 */
export const emptyVisitorDisclosure = {
    visitor: emptyUser,
    patient: '',
    station: '',
    symptoms: {
        cough: null,
        musclePain: null,
        fever: null,
        vomit: null,
        throat: null,
        bellyache: null,
        headache: null,
        taste: null,
        smell: null,
        air: null,
        breathless: null
    },
    returnRiskarea: null,
    riskarea: '',
    riskdate: '',
    quarantine: null,
    contactLungs: null,
    contactCovid: null,
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


/**
 * An empty contractor disclosure.
 */
export const emptyContractorDisclosure = {
    contractor: emptyUser,
    patient: '',
    station: '',
    vaccinated: false,
    recovered: false,
    tested: false,
    symptoms: {
        cough: null,
        musclePain: null,
        fever: null,
        vomit: null,
        throat: null,
        bellyache: null,
        headache: null,
        taste: null,
        smell: null,
        air: null,
        breathless: null
    },
    returnRiskarea: null,
    riskarea: '',
    riskdate: '',
    quarantine: null,
    contactLungs: null,
    contactCovid: null,
    formDate: new Date()
};

/**
 * Redux reducer for an contractor disclosure.
 * @type {reducer}
 */
export const contractorDisclosure = createReducer({
    value: emptyContractorDisclosure,
    isFetching: false,
    lastUpdated: undefined,
    status: fetchStatusType.success,
    error: null
}, {
    [DisclosureActions.REQUEST_CONTRACTOR_DISCLOSURE](draft, action) {
        draft.isFetching = true;
    },
    [DisclosureActions.SET_CONTRACTOR_DISCLOSURE](draft, action) {
        draft.value = action.contractorDisclosure;
    },
    [DisclosureActions.UPDATE_CONTRACTOR_DISCLOSURE_FIELD](draft, action) {
        _.set(draft.value, action.field, action.value);
    },
    [DisclosureActions.RECEIVE_CONTRACTOR_DISCLOSURE](draft, action) {
        draft.isFetching = false;
        draft.value = action.contractorDisclosure;
        draft.lastUpdated = action.receivedAt;
        draft.status = action.status;
        draft.error = action.error;
    }
});