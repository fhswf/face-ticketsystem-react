import {combineReducers} from "redux";
import {i18nReducer} from 'react-redux-i18n';
// import * as accountReducers from './AccountReducers';
// import * as visitorDisclosureReducers from './VisitorDisclosureReducers';
import {emailOccupied, user} from "./AccountReducers";

import * as disclosureListReducers from './DisclosureListReducers';
import config from '../../config/Config';

import { persistReducer, persistCombineReducers } from 'redux-persist'
import {visitorDisclosure} from "./VisitorDisclosureReducers";

// Combine all reducers of the application
const reducers = combineReducers(Object.assign(
    {
        // i18n: persistReducer(config.storage.lang, i18nReducer),
        i18n: i18nReducer,
        // auth: persistReducer(config.storage.auth, userReducer)
    },
    // accountReducers,
    {user, emailOccupied},
    // visitorDisclosureReducers,
    {visitorDisclosure},
    disclosureListReducers
));

export default persistReducer(config.storage.root, reducers);
// export default reducers;