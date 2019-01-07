import Logger from "utils/Logger";
import * as ApiWorker from "workers/ApiWorker";
import DiscordWorker from "workers/DiscordWorker";

const init = async () => {
    await DiscordWorker.start();
    await ApiWorker.start();
};

(async () => {
    try {
        await init();
    } catch (error) {
        Logger.error("Couldn't start the app", error);
    }
})();