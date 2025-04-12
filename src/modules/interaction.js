import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Client } from 'discord.js';
import { loadTickets, saveTickets } from "./database.js";

const claimedTickets = new Map();

export async function handleInteraction(interaction) {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    const { customId, channel, user,guild } = interaction;
    const tickets = await loadTickets();
    const ticket = tickets.find(t => t.channelId === channel.id);

    // Check if the ticket exists
    if (!ticket) {
        interaction.reply({ content: 'This ticket no longer exists in the database.', ephemeral: true });
        return;
    }

    if (customId === 'claim_ticket') {
        if (claimedTickets.has(channel.id)) {
            interaction.reply({ content: 'This ticket is already claimed.', ephemeral: true });
        } else {
            claimedTickets.set(channel.id, user.id);
            ticket.claimedBy = user.tag; // Update the ticket's claimedBy field
            await saveTickets(tickets);
            interaction.reply({ content: `Ticket claimed by ${user.tag}.`, ephemeral: false });
        }
    } else if (customId === 'close_ticket') {
        if (!claimedTickets.has(channel.id) || claimedTickets.get(channel.id) === user.id) {
<<<<<<< Updated upstream
            // Show a modal to collect the closing reason
            const modal = new ModalBuilder()
                .setCustomId('close_ticket_modal')
                .setTitle('Close Ticket');

            const reasonInput = new TextInputBuilder()
                .setCustomId('closing_reason')
                .setLabel('Reason for closing the ticket')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(reasonInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        } else {
            interaction.reply({ content: 'Only the claimer or an admin can close this ticket.', ephemeral: true });
        }
    } else if (interaction.isModalSubmit() && interaction.customId === 'close_ticket_modal') {
        const closingReason = interaction.fields.getTextInputValue('closing_reason');

        if (ticket) {
            ticket.closedBy = user.tag;
            ticket.closingReason = closingReason; // Save the closing reason
            await saveTickets(tickets);
        }
        if (channel) {
=======
            ticket.closedBy = user.tag; // Update the ticket's closedBy field
            await saveTickets(tickets);

>>>>>>> Stashed changes
            channel.delete().catch(error => {
                console.error('Error closing ticket channel:', error);
                interaction.reply({ content: 'There was an error closing the ticket.', ephemeral: true });
            });
            let ticketslog = guild.channels.cache.get("1354764172260409395");
            if (ticketslog && ticketslog.isTextBased()) {
                ticketslog.send(`Ticket zostal zamkniety przez: ${user.tag}. Powod: ${closingReason}`);
            }
        }

        
    }
}