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
        const author = message.guild.members.get(message.author.id);
        if (!author.roles.some((role) => role.name === "Devs") 
        && !author.roles.some((role) => role.name === "Moderators") ) {
            return message.reply(`You don't have permissions to use this command`);
        }
        try {
            await message.channel.bulkDelete(amount + 1);
        } catch(error) {
            Logger.error(error);
            return message.reply(`I don't have permissions to do this`);
        }
    },
};

export default inactivesGlobal;