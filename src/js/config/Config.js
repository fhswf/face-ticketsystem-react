import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js';

/**
 * The configuration of the application.
 */
const config = {
    backend: {
        endpoint: "https://jupiter.fh-swf.de/fts-api"
        //endpoint: "http://localhost:12000"
    },
    i18n: {
        locale: 'de',
        time: 'de-DE'
    },
    files: {
        disclosure: {
            visitor: 'Selbstauskunft_Besucher_20201119.pdf',
            contractor: 'Handwerker_Selbstauskunft_20201119.pdf'
        }
    },
    controls: {
        user: {
            password: {
                min: 6
            },
            phone: {
                min: 6
            },
            zip: {
                min: 3,
                max: 5
            }
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
