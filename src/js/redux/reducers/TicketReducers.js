import createReducer from "./CreateReducer";
import * as TicketActions from '../actions/TicketActions';
import fetchStatusType from "../actions/FetchStatusType";
import _ from 'lodash';

export const emptyTicket = {
    number: 0,
    name: '',
    creator: undefined,
    buyers: [],
    price: {
        value: 0,
        currency: 'EUR'
    },
    status: 'inactive',
    buyLimit: 0,
    customFields: []
};

export const ticket = createReducer({
    value: emptyTicket,
    isFetching: false,
    lastUpdated: undefined,
    status: fetchStatusType.success,
    error: null
}, {
    [TicketActions.REQUEST_TICKET](draft, action) {
        draft.isFetching = true;
    },
    [TicketActions.RECEIVE_TICKET](draft, action) {
        draft.isFetching = false;
        draft.value = action.ticket;
        draft.lastUpdated = action.receivedAt;
        draft.status = action.status;
        draft.error = action.error;
        draft.loggedIn = action.loggedIn
    },
    [TicketActions.SET_TICKET](draft, action) {
        draft.value = action.ticket;
    },
    [TicketActions.UPDATE_TICKET_FIELD](draft, action) {
        _.set(draft.value, action.field, action.value);
    },
    [TicketActions.UPDATE_TICKET_CUSTOM_FIELD](draft, action) {
        _.set(draft.value.customFields, action.field, action.value);
    }
});