import { loadTickets, saveTickets } from "./database.js";

const claimedTickets = new Map();

export async function handleInteraction(interaction) {
    if (!interaction.isButton()) return;

    const { customId, channel, user } = interaction;
    const tickets = await loadTickets();
    const ticket = tickets.find(t => t.channelId === channel.id);

    if (customId === 'claim_ticket') {
        if (claimedTickets.has(channel.id)) {
            interaction.reply({ content: 'This ticket is already claimed.', ephemeral: true });
        } else {
            claimedTickets.set(channel.id, user.id);
            if (ticket) {
                ticket.claimedBy = user.tag;
                await saveTickets(tickets);
            }
            interaction.reply({ content: `Ticket claimed by ${user.tag}.`, ephemeral: false });
        }
    } else if (customId === 'close_ticket') {
        if (!claimedTickets.has(channel.id) || claimedTickets.get(channel.id) === user.id) {
            if (ticket) {
                ticket.closedBy = user.tag;
                await saveTickets(tickets);
            }
            channel.delete().catch(error => {
                console.error('Error closing ticket channel:', error);
                interaction.reply({ content: 'There was an error closing the ticket.', ephemeral: true });
            });
        } else {
            interaction.reply({ content: 'Only the claimer or an admin can close this ticket.', ephemeral: true });
        }
    }
}