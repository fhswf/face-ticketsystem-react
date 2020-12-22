import {combineReducers} from "redux";
import {i18nReducer} from 'react-redux-i18n';
import * as accountReducers from './AccountReducers';
import config from '../../config/Config';

import { persistReducer, persistCombineReducers } from 'redux-persist'

// Combine all reducers of the application
const reducers = combineReducers(Object.assign(
    {
        // i18n: persistReducer(config.storage.lang, i18nReducer),
        i18n: i18nReducer,
        // auth: persistReducer(config.storage.auth, userReducer)
    },
    accountReducers
));

export default persistReducer(config.storage.root, reducers);