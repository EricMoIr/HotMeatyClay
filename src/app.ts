import Logger from "utils/Logger";
import * as ApiWorker from "workers/ApiWorker";
import DiscordService from "services/DiscordService";
import DiscordWorker from "workers/DiscordWorker";
import GameService from "services/GameService";
import { Client } from "discord.js";


const init = async () => {
    const client = new Client();
    DiscordService.setInstance(client);
    await DiscordWorker.login();
    await ApiWorker.listen();

    const gameService = new GameService(DiscordService.instance);
    await gameService.startUpdating();
};

try {
    init();
} catch (error) {
    Logger.error("Couldn't start the app", error);
}
