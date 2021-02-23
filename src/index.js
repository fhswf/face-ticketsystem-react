import ReactDOM from "react-dom";
import React from "react";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import path from "path";

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.scss'
import App from "./js/react/App";
import {store, persistor} from "./js/redux/Store";

const wrapper = document.getElementById("app");
import * as faceapi from 'face-api.js';

// Load face detection models
Promise.all([
    // faceapi.nets.tinyFaceDetector.loadFromUri(path.join(__dirname, 'public/', '/models')),
    faceapi.nets.ssdMobilenetv1.loadFromUri(path.join(__dirname, 'public/', '/models'))
]).then(() => {
    // eslint-disable-next-line no-unused-expressions
    wrapper
        ? ReactDOM.render(
        (<Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
        </Provider>),
        wrapper
        )
        : false;
}).catch(err => {
    console.error(err)
});