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
    updateVisitorDisclosureField,
    requestContractorDisclosure,
    receiveContractorDisclosure,
    createContractorDisclosure,
    setContractorDisclosure,
    updateContractorDisclosureField
} from './DisclosureActions';
import {
    requestVisitorDisclosures,
    receiveVisitorDisclosures,
    fetchVisitorDisclosures,
    requestContractorDisclosures,
    receiveContractorDisclosures,
    fetchContractorDisclosures
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
        requestContractorDisclosure, receiveContractorDisclosure, createContractorDisclosure, setContractorDisclosure,
        updateContractorDisclosureField,
        requestVisitorDisclosures, receiveVisitorDisclosures, fetchVisitorDisclosures,
        requestContractorDisclosures, receiveContractorDisclosures, fetchContractorDisclosures,
        requestTicket, receiveTicket, setTicket, updateTicketCustomField, updateTicketField, createTicket, resetTicket,
        requestTickets, receiveTickets, fetchTickets
    }
);