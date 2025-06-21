// src/modules/ticket.js

import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,ActionRow } from "discord.js";
import { loadTickets, saveTickets } from "../../utils/database.js";

/**
 * Object to keep track of the number of tickets created for each type.
 * @type {{ Pomoc: number, Pytanie: number, Propozycja: number }}
 */
const ticketCounters = {
    Pomoc: 0,
    Pytanie: 0,
    Propozycja: 0,
};

/**
 * Creates a new ticket channel, manages ticket storage, and handles errors.
 * Enforces a 100-ticket limit by deleting the oldest ticket if necessary.
 * 
 * @async
 * @param {import('discord.js').Message} msg - The Discord message that triggered the ticket creation.
 * @param {string} type - The type of ticket (e.g., "Pomoc", "Pytanie", "Propozycja").
 * @returns {Promise<void>}
 */
export async function createTicket(msg, type) {
    const errors = [];
    const tickets = await loadTickets();

    // Enforce the 100-ticket limit
    if (tickets.length >= 100) {
        const oldestTicket = tickets.shift(); // Remove the oldest ticket
        const channel = msg.guild.channels.cache.get(oldestTicket.channelId);
        if (channel) {
            try {
                await channel.delete();
            } catch (err) {
                errors.push(`Failed to delete oldest ticket channel: ${err.message}`);
            }
        } else {
            errors.push("Oldest ticket channel not found.");
        }
    }

    // Increment the counter for the ticket type
    ticketCounters[type] = (ticketCounters[type] || 0) + 1;

    const embed = new EmbedBuilder()
        .setTitle("Ticket")
        .addFields(
            { name: "Typ", value: type },
            { name: "Author", value: `<@${msg.author.id}>` },
            { name: "Info", value: msg.content}
        );

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('claim_ticket')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
        );

    try {
        const channel = await msg.guild.channels.create({
            name: `ticket-${type.toLowerCase()}-${ticketCounters[type]}`,
            type: 0, // 0 = Text channel
            permissionOverwrites: [
                {
                    id: msg.guild.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: msg.author.id,
                    allow: [
                        'ViewChannel',
                        'SendMessages',
                        'ReadMessageHistory',
                        'AttachFiles',
                        'EmbedLinks',
                        'AddReactions',
                        'UseExternalEmojis',
                        'UseExternalStickers',
                        'MentionEveryone',
                        'SendTTSMessages'
                    ],
                },
            ],
        });

        /**
         * @typedef {Object} Ticket
         * @property {string} type - The type of the ticket.
         * @property {string} userId - The ID of the user who created the ticket.
         * @property {string} userTag - The Discord tag of the user.
         * @property {number} ticketNumber - The ticket number for this type.
         * @property {string} channelId - The ID of the ticket channel.
         * @property {string} createdAt - ISO string of ticket creation time.
         * @property {?string} claimedBy - The ID of the user who claimed the ticket.
         * @property {?string} closedBy - The ID of the user who closed the ticket.
         * @property {?any} users - Reserved for future use.
         * @property {Array<Object>} messages - Array of messages in the ticket.
         */

        const ticket = {
            type,
            userId: msg.author.id,
            userTag: msg.author.tag,
            ticketNumber: ticketCounters[type],
            channelId: channel.id,
            createdAt: new Date().toISOString(),
            claimedBy: null,
            closedBy: null,
            users: null,
            messages: [] // Initialize messages array
        };

        tickets.push(ticket);
        try {
            saveTickets(tickets);
        } catch (err) {
            errors.push(`Failed to save tickets: ${err.message}`);
        }

        try {
            await channel.send({ embeds: [embed], components: [actionRow] });
        } catch (err) {
            errors.push(`Failed to send embed to channel: ${err.message}`);
        }

        try {
            await msg.delete();
        } catch (err) {
            errors.push(`Failed to delete original message: ${err.message}`);
        }

        // Listen for messages in the ticket channel
        const collector = channel.createMessageCollector();
        collector.on('collect', async message => {
            if (!message.author.bot) {
                ticket.messages.push({
                    authorId: message.author.id,
                    authorTag: message.author.tag,
                    content: message.content,
                    timestamp: message.createdAt.toISOString()
                });
                try {
                    await saveTickets(tickets);
                } catch (err) {
                    errors.push(`Failed to save ticket message: ${err.message}`);
                }
            }
        });
    } catch (error) {
        errors.push(`Error creating ticket channel: ${error.message}`);
    }

    // Send error summary if any errors occurred
    if (errors.length > 0) {
        try {
            await msg.author.send(`Errors occurred during ticket creation:\n${errors.join('\n')}`);
            console.log('Error summary sent to user:', errors);
        } catch (err) {
            console.log('Failed to send error summary to user:', err);
        }
    }
}