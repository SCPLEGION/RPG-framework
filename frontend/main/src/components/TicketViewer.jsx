import React, { useState, useEffect } from 'react';
import './TicketViewer.css'; // Optional: Add custom styles here

const TicketViewer = ({ tickets }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    return (
        <div className="ticket-viewer">
            <div className="ticket-list">
                <h2>Tickets</h2>
                {tickets && tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className={`ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                            onClick={() => handleTicketClick(ticket)}
                        >
                            <p>{ticket.title}</p>
                        </div>
                    ))
                ) : (
                    <p>No tickets available</p>
                )}
            </div>
            <div className="ticket-details">
                {selectedTicket ? (
                    <>
                        <h2>Ticket Details</h2>
                        <p><strong>Title:</strong> {selectedTicket.title}</p>
                        <p><strong>Description:</strong> {selectedTicket.description}</p>
                        <p><strong>Status:</strong> {selectedTicket.status}</p>
                    </>
                ) : (
                    <p>Select a ticket to view details</p>
                )}
            </div>
        </div>
    );
};

export default TicketViewer;