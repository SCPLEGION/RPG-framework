import { createTicket } from "./ticket.js";
import { handleInteraction } from "./interaction.js";

export function redirect(msg) {
    if (msg.author.bot) return;

    if (msg.channelId === '1354178493784654054') {
        createTicket(msg, 'Pomoc');
    } else if (msg.channelId === '1354178654753521674') {
        createTicket(msg, 'Pytanie');
    } else if (msg.channelId === '1354178702782763118') {
        createTicket(msg, 'Propozycja');
    }
}

export { handleInteraction };