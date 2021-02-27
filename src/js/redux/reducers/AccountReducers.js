import createReducer from "./CreateReducer";
import * as AccountActions from '../actions/AccountActions';
import fetchStatusType from "../actions/FetchStatusType";

export const emptyUser = {
    _id: undefined,
    email: '',
    password: '',
    role: 'customer',
    personal: {
        firstname: '',
        lastname: '',
        salutation: '',
        sex: 1, // from MIPS. 1 for male and 0 for female
        phonenumber: '',
        country: '',
        zipcode: '',
        city: '',
        address1: '',
        address2: ''
    },
    customerNumber: '',
    pictureFile: '',
    faceId: ''
};

export const emailOccupied = createReducer({
    isFetching: false,
    lastUpdated: undefined,
    status: fetchStatusType.success,
    error: null,
    isOccupied: false
}, {
    [AccountActions.REQUEST_EMAIL_OCCUPIED](draft, action) {
        draft.isFetching = true;
    },
    [AccountActions.RECEIVE_EMAIL_OCCUPIED](draft, action) {
        draft.isFetching = false;
        draft.lastUpdated = action.receivedAt;
        draft.status = action.status;
        draft.error = action.error;
        draft.isOccupied = action.isOccupied;
    }
});

export const user = createReducer({
    data: {
        value: emptyUser,
        isFetching: false,
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null,
        loggedIn: false
    },
    purchasedTickets: {
        isFetching: false,
        values: [],
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null
    }
}, {
    [AccountActions.REQUEST_USER](draft, action) {
        draft.data.isFetching = true;
    },
    [AccountActions.RECEIVE_USER](draft, action) {
        draft.data.isFetching = false;
        draft.data.value = action.user;
        draft.data.lastUpdated = action.receivedAt;
        draft.data.status = action.status;
        draft.data.error = action.error;
        draft.data.loggedIn = action.loggedIn
    },
    [AccountActions.SET_USER](draft, action) {
        draft.data.value = action.user;
    }
});