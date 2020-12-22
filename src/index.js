import ReactDOM from "react-dom";
import React from "react";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.scss'
import App from "./js/react/App";
import {store, persistor} from "./js/redux/Store";

const wrapper = document.getElementById("app");

// eslint-disable-next-line no-unused-expressions
wrapper
    ? ReactDOM.render(
        (<Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>),
        wrapper
    )
    : false;