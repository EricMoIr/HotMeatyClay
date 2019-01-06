// import Logger from "utils/Logger";
// import * as ApiWorker from "workers/ApiWorker";
// import DiscordWorker from "workers/DiscordWorker";

// const init = async () => {
//     await DiscordWorker.start();
//     await ApiWorker.start();
// };

// (async () => {
//     try {
//         await init();
//     } catch (error) {
//         Logger.error("Couldn't start the app", error);
//     }
// })();

import * as express from "express";

import Logger from "utils/Logger";

function startMockApi() {
    return new Promise((resolve) => {
        const app = express();
    
        app.post("/user", (req, res) => {
            res.json({
                banned: true,
                name: "bramiaJr test",
                discordid: "511327657141731343",
            });
        });
    
        app.listen(8081, () => resolve());
    })
}

(async () => {
    try {
        await startMockApi();
    } catch (error) {
        Logger.error("Couldn't start the app", error);
    }
})();
