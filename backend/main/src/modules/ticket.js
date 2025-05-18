import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { loadTickets, saveTickets } from "./database.js";

const ticketCounters = {
    Pomoc: 0,
    Pytanie: 0,
    Propozycja: 0,
};

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
            await saveTickets(tickets);
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