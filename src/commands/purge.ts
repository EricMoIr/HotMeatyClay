import Command from "./Command";
import Logger from "utils/Logger";

const inactivesGlobal : Command = {
    name: "purge",
    description: "Delete the past n messages",
    execute: async (message, [amountString]) => {
        const amount = Number(amountString);
        if (!amount || Number.isNaN(amount) || amount < 0) {
            return message.reply(`purge must be followed by number of messages you wish to delete`);
        }
        if (amount > 99) {
            return message.reply(`I can't delete more than 99 messages at a time. Blame Discord`);
        }
        const author = message.guild.members.get(message.author.id);
        if (!author.roles.some((role) => role.name === "Devs") 
        && !author.roles.some((role) => role.name === "Moderators") ) {
            return message.reply(`You don't have permissions to use this command`);
        }
        try {
            const messagesToDelete = await message.channel.fetchMessages({ limit: amount + 1 });
            const promises = messagesToDelete.array().map((messageToDelete) => {
                const authorOfMessageToDelete = messageToDelete.guild.members.get(messageToDelete.author.id);
                if (authorOfMessageToDelete.roles.some((role) => role.name === "Devs") && !author.roles.some((role) => role.name === "Devs")) {
                    Logger.warn(`You tried to delete a dev's message`);
                } else {
                    return messageToDelete.delete();
                }
            });
            await Promise.all(promises);
        } catch(error) {
            Logger.error(error);
            return message.reply(`I don't have permissions to do this`);
        }
    },
};

export default inactivesGlobal;