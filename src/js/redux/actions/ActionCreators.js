import {
    login,
    register,
    receiveUser,
    requestUser,
    logout,
    receiveEmailOccupied,
    requestEmailOccupied,
    isEmailOccupied,
    updateUser
} from './AccountActions';
import {
    requestVisitorDisclosure,
    receiveVisitorDisclosure,
    createVisitorDisclosure,
    setVisitorDisclosure,
    updateVisitorDisclosureField
} from './DisclosureActions';
import {
    requestVisitorDisclosures,
    receiveVisitorDisclosures,
    fetchVisitorDisclosures
} from "./DisclosureListActions";
import {
    requestTicket, receiveTicket, setTicket, updateTicketCustomField, updateTicketField, createTicket
} from "./TicketActions";

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        login, register, receiveUser, requestUser, logout, requestEmailOccupied, receiveEmailOccupied, isEmailOccupied,
        updateUser,
        requestVisitorDisclosure, receiveVisitorDisclosure, createVisitorDisclosure, setVisitorDisclosure,
        updateVisitorDisclosureField,
        requestVisitorDisclosures, receiveVisitorDisclosures, fetchVisitorDisclosures,
        requestTicket, receiveTicket, setTicket, updateTicketCustomField, updateTicketField, createTicket
    }
);