import createReducer from "./CreateReducer";
import * as DisclosureListActions from '../actions/DisclosureListActions';
import fetchStatusType from "../actions/FetchStatusType";

/**
 * Redux reducer containing lists of disclosures.
 * @type {reducer}
 */
export const disclosureList = createReducer({
    items: {
        visitorDisclosures: [],
        contractorDisclosures: []
    },
    isFetching: false,
    lastUpdated: undefined,
    status: fetchStatusType.success,
    error: null
}, {
    [DisclosureListActions.REQUEST_VISITOR_DISCLOSURES](draft, action) {
        draft.isFetching = true;
    },
    [DisclosureListActions.REQUEST_CONTRACTOR_DISCLOSURES](draft, action) {
        draft.isFetching = true;
    },
    [DisclosureListActions.RECEIVE_VISITOR_DISCLOSURES](draft, action) {
        draft.isFetching = false;
        draft.lastUpdated = action.receivedAt;
        draft.status = action.status;
        draft.error = action.error;
        // FIXME This check shouldn't be necessary, but somehow the initial state get's ignored, and items is undefined
        if (!draft.items) {
            draft.items = {
                visitorDisclosures: [],
                contractorDisclosures: []
            };
        }
        draft.items.visitorDisclosures = action.visitorDisclosures;
    },
    [DisclosureListActions.RECEIVE_CONTRACTOR_DISCLOSURES](draft, action) {
        draft.isFetching = false;
        draft.lastUpdated = action.receivedAt;
        draft.status = action.status;
        draft.error = action.error;
        // FIXME This check shouldn't be necessary, but somehow the initial state get's ignored, and items is undefined
        if (!draft.items) {
            draft.items = {
                visitorDisclosures: [],
                contractorDisclosures: []
            };
        }
        draft.items.contractorDisclosures = action.contractorDisclosures;
    }
});