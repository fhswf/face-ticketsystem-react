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

