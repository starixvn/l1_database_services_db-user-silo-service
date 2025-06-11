/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */
/** @typedef {import("@ldb/mongo").ChangeStreamNameSpace} ChangeStreamNameSpace */

import { name, version } from "./metadata.js";

export const environment = "HD-PROD";
export const healthcheckPort = 5000;

/** @type {LumiLoggerConfig} */
export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://3d919d26cf198749e16d574f81b04943@sentrypro-sc.nebula.prod/22",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1002096556100,
            slack: "B08GPPK88MS:T08ACMHMMFS:C090VPU8KFF",
        },
        proxy: {
            protocol: "http",
            host: "lisasqd.nebula.prod",
            port: 8801,
        },
    },
    environment,
};

const mongoCred = "lmn_summary:HE02qXk%21GKW8psDdWj07%26iQ9d%26e%7C%3Fkfd";
const mongoSrv = "10.99.99.53:39510,10.99.99.54:39510,10.99.99.188:39510,10.99.99.187:39510";
const mongoRepl = "SP-Main";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const schedulerConfig = {
    USER: [30_000, 10_000],
};

/** @type {Record<string, ChangeStreamNameSpace>} */
export const namespaces = {
    userSessionsNamespace: { db: "hotdog_minigame", coll: "usersessions" },
    userSilosNamespace: { db: "hotdog_minigame", coll: "user_silos" },
};
