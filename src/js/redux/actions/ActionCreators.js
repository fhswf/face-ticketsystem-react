import {login, register, receiveUser, requestUser, logout} from './AccountActions';

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        login, register, receiveUser, requestUser, logout
    }
);