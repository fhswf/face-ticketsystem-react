import fetchStatusType from "./FetchStatusType";
import client from "../../backend/RestApi";

// export const SET_USER = "SET_USER";
// //
// // export function setUser(user) {
// //     return {
// //         type: SET_USER,
// //         user
// //     }
// // }


export const REQUEST_USER = "REQUEST_USER";

export function requestUser() {
    return {
        type: REQUEST_USER
    }
}


export const RECEIVE_USER = "RECEIVE_USER";

export function updateUser(user) {
    console.log("Let's update the user")
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch(requestUser());
            let body = {
                id: getState().user.data.value._id,
                user: user
            };
            client.httpPost('auth/updateUser', body)
                .then(result => {
                    if(result.updated) resolve({});
                    reject({message: 'message.updateAccountFail'});
                })
                .catch(err => {
                    reject({message: 'message.updateAccountFail'});
                })
        })
    }
}

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

export function requestEmailOccupied() {
    return {
        type: REQUEST_EMAIL_OCCUPIED
    }
}

export const RECEIVE_EMAIL_OCCUPIED = "RECEIVE_EMAIL_OCCUPIED";

export function receiveEmailOccupied(isOccupied, status = fetchStatusType.success, error = null) {
    return {
        isOccupied: isOccupied,
        receivedAt: Date.now(),
        status: status,
        error: error,
        type: RECEIVE_EMAIL_OCCUPIED
    }
}

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
