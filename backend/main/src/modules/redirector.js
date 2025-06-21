// src/modules/redirector.js

import { createTicket } from "./ticket.js";
import { handleInteraction } from "./interaction.js";
import { loadTickets, saveTickets } from "../../utils/database.js";

export async function redirect(msg) {

    const tickets = await loadTickets();
    const ticket = tickets.find(t => t.channelId === msg.channelId);

    if (ticket) {
        // Save the message to the ticket
        ticket.messages.push({
            authorId: msg.author.id,
            authorTag: msg.author.tag,
            content: msg.content,
            timestamp: msg.createdAt.toISOString(),
        });
        await saveTickets(tickets);
    }
    if (msg.author.bot) return;
    if (msg.channelId === '1354178493784654054') {
        await createTicket(msg, 'Pomoc');  // Add await here
    } else if (msg.channelId === '1354178654753521674') {
        await createTicket(msg, 'Pytanie');  // Add await here
    }
}


export { handleInteraction };