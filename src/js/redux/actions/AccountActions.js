import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

export const REQUEST_USER = "REQUEST_USER";

/**
 * Redux action to request a user.
 * @returns {{type: *}}
 */
export function requestUser() {
    return {
        type: REQUEST_USER
    }
}


export const RECEIVE_USER = "RECEIVE_USER";

/**
 * Redux action to receive a user.
 * @param user The received user.
 * @param loggedIn Whether or not the user is logged in now.
 * @param status The status of the fetch result.
 * @param error The error which may have occurred.
 * @returns {{type: *}}
 */
export function receiveUser(user, loggedIn = false, status = fetchStatusType.success, error = null) {
    return {
        type: RECEIVE_USER,
        user: user,
        receivedAt: Date.now(),
        status: status,
        error: error,
        loggedIn: loggedIn
    }
}

/**
 * Redux action to update the currently logged in user.
 * @param user The new user data to be used to update the currently logged in user.
 * @returns {{type: *}}
 */
export function updateUser(user) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch(requestUser());
            let body = {
                id: getState().user.data.value._id,
                user: user
            };
            client.httpPost('/auth/updateUser', body)
                .then(result => {
                    if(result.updated) resolve(user);
                    reject({message: 'message.updateAccountFail'});
                })
                .catch(err => {
                    reject({message: 'message.updateAccountFail'});
                })
        })
    }
}

export const SET_USER = "SET_USER";

/**
 * Redux action to set the current user.
 * @param user The user to be set as the current user.
 * @returns {{type: *}}
 */
export function setUser(user) {
    return {
        type: SET_USER,
        user: user
    }
}

/**
 * Redux action to log in as a user.
 * @param user The user which tries to log in.
 * @returns {function(*=, *): Promise<unknown>} The resolved user or rejected error message.
 */
export function login(user) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch(requestUser());
            client.httpPost('/auth/login', user)
                .then(result => {
                    dispatch(receiveUser(result.user, result.loggedIn));
                    if(result.loggedIn === true)
                        resolve(user);
                    else
                        reject({message: 'message.loginFail'});
                })
                .catch(err => {
                    dispatch(receiveUser({}, false, fetchStatusType.error, err));
                    reject({message: 'message.loginFetchError'});
                });
        });
    }
}

/**
 * Redux action to register a user.
 * @param user The user to be registered.
 * @param pictureToUpload The image of the user to be uploaded.
 * @returns {function(*=, *=): Promise<unknown>} The resolved new user from the database or a rejected error message.
 */
export function register(user, pictureToUpload) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch(requestUser());
            // Create form data
            const formData = new FormData();
            formData.append('user', JSON.stringify(user));
            formData.append('file', pictureToUpload);
            client.httpPost('/auth/register', formData, true)
                .then(result => {
                    dispatch(receiveUser(result.user, result.loggedIn));
                    resolve(getState().user);
                })
                .catch(err => {
                    dispatch(receiveUser({}, false, fetchStatusType.error, err));
                    reject(err);
                });
        })
    }
}

/**
 * Redux action to log the currently logged in user out.
 * @returns {function(*=, *): Promise<unknown>}
 */
export function logout() {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            client.httpGet('/auth/logout')
                .then(result => {
                    dispatch(receiveUser(result.user, result.loggedIn));
                    resolve(result.user);
                })
                .catch(err => {
                    dispatch(receiveUser({}, false, fetchStatusType.error, err));
                    reject({message: 'message.logoutFail'});
                });
        })
    }
}

export const REQUEST_EMAIL_OCCUPIED = "REQUEST_EMAIL_OCCUPIED";

/**
 * Redux action to request information about whether or not a given E-Mail is occupied.
 * @returns {{type: *}}
 */
export function requestEmailOccupied() {
    return {
        type: REQUEST_EMAIL_OCCUPIED
    }
}

export const RECEIVE_EMAIL_OCCUPIED = "RECEIVE_EMAIL_OCCUPIED";

/**
 * Redux action to receive information about whether or not a given E-Mail is occupied.
 * @param isOccupied Whether or not the E-Mail is occupied.
 * @param status The status of the fetch result.
 * @param error The error which might've occurred.
 * @returns {{type: *}}
 */
export function receiveEmailOccupied(isOccupied, status = fetchStatusType.success, error = null) {
    return {
        isOccupied: isOccupied,
        receivedAt: Date.now(),
        status: status,
        error: error,
        type: RECEIVE_EMAIL_OCCUPIED
    }
}

/**
 * Redux action to determine whether or not an E-Mail is occupied.
 * @param email The E-Mail to be checked.
 * @returns {function(*=, *): Promise<unknown>} The resolved information if the E-Mail is occupied or not, or a rejected error.
 */
export function isEmailOccupied(email) {
    return (dispatch, getState) => {
        dispatch(requestEmailOccupied());
        return new Promise((resolve, reject) => {
            let body = {
                email: email,
                user: getState().user.data.value
            };
            client.httpPost('/auth/checkEmail', body)
                .then(result => {
                    if(result && result.hasOwnProperty('occupied')) {
                        dispatch(receiveEmailOccupied(result.occupied));
                        resolve(result.occupied);
                    }
                    else {
                        dispatch(receiveEmailOccupied(true, fetchStatusType.error));
                        resolve(true);
                    }
                })
                .catch(err => {
                    dispatch(receiveEmailOccupied(true, fetchStatusType.error, err));
                    reject(err);
                });
        });
    }
}
