import createReducer from "./CreateReducer";
import * as DisclosureListActions from '../actions/TicketListActions';
import fetchStatusType from "../actions/FetchStatusType";

/**
 * Redux reducer containing a list of all tickets.
 * @type {reducer}
 */
export const ticketList = createReducer({
    items: [],
    isFetching: false,
    lastUpdated: undefined,
    status: fetchStatusType.success,
    error: null
}, {
    [DisclosureListActions.REQUEST_TICKETS](draft, action) {
        draft.isFetching = true;
    },
    [DisclosureListActions.RECEIVE_TICKETS](draft, action) {
        draft.isFetching = false;
        draft.lastUpdated = action.receivedAt;
        draft.status = action.status;
        draft.error = action.error;
        draft.items = action.tickets;
    }
});