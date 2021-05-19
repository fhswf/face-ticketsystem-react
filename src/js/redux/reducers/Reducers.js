import { combineReducers } from "redux";
import { i18nReducer } from 'react-redux-i18n';
import { emailOccupied, user } from "./AccountReducers";

import * as disclosureListReducers from './DisclosureListReducers';
import * as ticketListReducers from './TicketListReducers';
import config from '../../config/Config';

import { persistReducer, persistCombineReducers } from 'redux-persist'
import { visitorDisclosure, contractorDisclosure } from "./DisclosureReducers";
import { ticket } from "./TicketReducers";

// Combine all reducers of the application
const reducers = combineReducers(Object.assign(
    {
        i18n: i18nReducer
    },
    { user, emailOccupied },
    { visitorDisclosure },
    { contractorDisclosure },
    { ticket },
    disclosureListReducers,
    ticketListReducers
));

export default persistReducer(config.storage.root, reducers);
// export default reducers;