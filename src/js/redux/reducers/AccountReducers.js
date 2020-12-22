import createReducer from "./CreateReducer";
import * as AccountActions from '../actions/AccountActions';
import fetchStatusType from "../actions/FetchStatusType";

export const emptyUser = {
    email: '',
    password: '',
    role: 'customer',
    personal: {
        firstname: '',
        lastname: '',
        salutation: '',
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

export const user = createReducer({
    data: {
        value: emptyUser,
        isFetching: false,
        lastUpdated: undefined,
        status: fetchStatusType.success,
        error: null,
        loggedIn: false
    },
    tickets: {
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
    }
});