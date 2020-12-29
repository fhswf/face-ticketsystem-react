import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js';

const config = {
    backend: {
        endpoint: "https://jupiter.fh-swf.de/fts-api"
    },
    storage: {
        root: {
            key: 'root',
            storage: storage,
            blacklist: ['auth', 'jwt', 'i18n']
        },
        auth: {
            key: 'auth',
            storage: storageSession
        },
        jwt: {
            key: 'jwt',
            storage: new CookieStorage(Cookies, {
                httpOnly: true
            })
        },
        // lang: {
        //     key: 'lang',
        //     storage: storage
        // }
    }
};

export default config;
