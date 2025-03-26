import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { loadTickets, saveTickets } from "./database.js";

const ticketCounters = {
    Pomoc: 0,
    Pytanie: 0,
    Propozycja: 0,
};

export async function createTicket(msg, type) {
    const tickets = await loadTickets();

    // Enforce the 100-ticket limit
    if (tickets.length >= 100) {
        const oldestTicket = tickets.shift(); // Remove the oldest ticket
        const channel = msg.guild.channels.cache.get(oldestTicket.channelId);
        if (channel) {
            channel.delete().catch(console.error);
        }
    }

    // Increment the counter for the ticket type
    ticketCounters[type] = (ticketCounters[type] || 0) + 1;

    const embed = new EmbedBuilder()
        .setTitle("Ticket")
        .setDescription("A new ticket has been created")
        .addFields(
            { name: "Type", value: type },
            { name: "User", value: msg.author.tag },
            { name: "Ticket Number", value: `${ticketCounters[type]}` },
            { name: "Dane", value: msg.content}
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

    msg.guild.channels.create({
        name: `ticket-${type.toLowerCase()}-${ticketCounters[type]}`,
        type: 0, // 0 = Text channel
        permissionOverwrites: [
            {
                id: msg.guild.id,
                deny: ['ViewChannel'],
            },
            {
                id: msg.author.id,
                allow: ['ViewChannel'],
            },
        ],
    }).then(async channel => {
        const ticket = {
            type,
            userId: msg.author.id,
            userTag: msg.author.tag,
            ticketNumber: ticketCounters[type],
            channelId: channel.id,
            createdAt: new Date().toISOString(),
            claimedBy: null,
            closedBy: null,
            messages: [] // Initialize messages array
        };

        tickets.push(ticket);
        await saveTickets(tickets);

        channel.send({ embeds: [embed], components: [actionRow] });
        msg.delete();

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
                await saveTickets(tickets);
            }
        });
    }).catch(error => {
        console.error('Error creating ticket channel:', error);
        msg.reply('There was an error creating the ticket. Please try again later.');
    });
}