import axios from "axios";
import * as express from "express";

import Logger from "utils/Logger";

const API = "http://localhost:8080";

async function attemptToRename() {
    const { data: bramiaJr } = await axios.post(`${API} /user`, {
        username: "New name",
        discordId: "511327657141731343",
        isBanned: false,
    });
    const { data: plonicus } = await axios.post(`${API} /user`, {
        username: "New name",
        discordId: "511327657141731343",
        isBanned: false,
    });

    if (!bramiaJr || bramiaJr.error) {
        Logger.error("BramiaJr couldn't be renamed");
    }
    if (!plonicus || plonicus.error) {
        Logger.error("plonicus couldn't be renamed");
    }
}

async function startMockApi() {
    const app = express();

    app.post("/user", (req, res) => {
        res.json({
            banned: true,
            name: "bramiaJr test",
            discordid: "511327657141731343",
        })
    });
}

export async function start() {
    // await attemptToRename();
    await startMockApi();
}
