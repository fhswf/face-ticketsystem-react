import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducers from "./reducers/Reducers";
import {loadTranslations, setLocale, syncTranslationWithStore} from 'react-redux-i18n';
import translationObject from '../config/i18n';
import {persistStore} from 'redux-persist'
import config from "../config/Config";

// Create Redux store, intercepted by the thunk and logger middleware
const logger = createLogger({});
const initialState = undefined;
const store = createStore(reducers, initialState, applyMiddleware(thunk, logger));

const persistor = persistStore(store);
// persistor.purge();

// i18n
syncTranslationWithStore(store);
store.dispatch(loadTranslations(translationObject));
store.dispatch(setLocale(config.i18n.locale));

export {store, persistor};