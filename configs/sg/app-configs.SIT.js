/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */
/** @typedef {import("@ldb/mongo").ChangeStreamNameSpace} ChangeStreamNameSpace */

import { name, version } from "./metadata.js";

export const environment = "SG-MIS-SIT";
export const healthcheckPort = 5000;

/** @type {LumiLoggerConfig} */
export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://a44301722794b9e2d74cb4efc1655964@sentrysc.ops-sit.nebula.sit/19",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1001964283718,
            slack: "B08GPPK88MS:T08ACMHMMFS:C090ALHP2DD",
        },
    },
    environment,
};

const mongoCred = "lmn_summary:%4c%6d%6e%53%75%6d%6d%61%72%79%40%35%31%37";
const mongoSrv = "172.16.4.111:31301";
const mongoRepl = "SabaSIT";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const schedulerConfig = {
    USER: [30_000, 10_000],
};

/** @type {Record<string, ChangeStreamNameSpace>} */
export const namespaces = {
    userSessionsNamespace: { db: "minigame", coll: "usersessions" },
    userSilosNamespace: { db: "minigame", coll: "user_silos" },
};
