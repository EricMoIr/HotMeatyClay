import Logger from "utils/Logger";
import * as ApiWorker from "workers/ApiWorker";

const init = async () => {
    await ApiWorker.start();
};

(async () => {
    try {
        await init();
    } catch (error) {
        Logger.error("Couldn't start the API", error);
    }
})();
