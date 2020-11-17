import ReactDOM from "react-dom";
import React from "react";
import {Provider} from "react-redux";

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.scss'
import App from "./js/react/App";
import store from "./js/redux/Store";

const wrapper = document.getElementById("app");

// eslint-disable-next-line no-unused-expressions
wrapper
    ? ReactDOM.render(
        (<Provider store={store}>
            <App />
        </Provider>),
        wrapper
    )
    : false;