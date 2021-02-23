import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js';

const config = {
    backend: {
        //endpoint: "https://jupiter.fh-swf.de/fts-api"
        endpoint: "http://127.0.0.1:12000"
    },
    i18n: {
        locale: 'de',
        time: 'de-DE'
    },
    files: {
        disclosure: {
            visitor: 'Selbstauskunft_Besucher_20201119.pdf'
        }
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
