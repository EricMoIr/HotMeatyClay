import Logger from "utils/Logger";
import DiscordWorker from "workers/DiscordWorker";

const init = async () => {
    await DiscordWorker.start();
};

(async () => {
    try {
        await init();
    } catch (error) {
        Logger.error("Couldn't start the workers", error);
    }
})();
