import {
    login,
    register,
    receiveUser,
    requestUser,
    logout,
    receiveEmailOccupied,
    requestEmailOccupied,
    isEmailOccupied,
    updateUser,
    setUser
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
    requestTickets,
    receiveTickets,
    fetchTickets
} from "./TicketListActions";
import {
    requestTicket, receiveTicket, setTicket, updateTicketCustomField, updateTicketField, createTicket, resetTicket
} from "./TicketActions";

/**
 * Grouping up all possible actions.
 */
export const ActionCreators = Object.assign({},
    {
        login, register, receiveUser, requestUser, logout, requestEmailOccupied, receiveEmailOccupied, isEmailOccupied,
        updateUser, setUser,
        requestVisitorDisclosure, receiveVisitorDisclosure, createVisitorDisclosure, setVisitorDisclosure,
        updateVisitorDisclosureField,
        requestVisitorDisclosures, receiveVisitorDisclosures, fetchVisitorDisclosures,
        requestTicket, receiveTicket, setTicket, updateTicketCustomField, updateTicketField, createTicket, resetTicket,
        requestTickets, receiveTickets, fetchTickets
    }
);