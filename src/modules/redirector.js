export{ redirect, rreply }
import { Message } from "discord.js";
    
function redirect(msg) {
    msg.content.startsWith('!ping') ? rreply(msg,"Pong") : null;
    msg.channelId === '1354178493784654054' ? rreply(msg,"This is a test") : null;
}

function rreply(msg,data) {
    msg.reply(data);
}


function ticket(msg,type) {
    if (type === 'create') {
        msg.reply("Ticket created");
    }
    if (type === 'close') {
        msg.reply("Ticket closed");
    }
}