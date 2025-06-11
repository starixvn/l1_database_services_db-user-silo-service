/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */
/** @typedef {import("@ldb/mongo").ChangeStreamNameSpace} ChangeStreamNameSpace */

import { name, version } from "./metadata.js";

export const environment = "SP-LOCAL-0";
export const healthcheckPort = 5000;

/** @type {LumiLoggerConfig} */
export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "https://42cb349f8a4fbd2297e870bb3fc41821@sentry-k8s.lumigame.com/25",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1002034115006,
            slack: "B08GPPK88MS:T08ACMHMMFS:C091FAL49UG",
        },
    },
    environment,
};

const mongoCred = "lmn_summary:LmnSummary";
const mongoSrv = "10.10.50.12:39400,10.10.50.13:39400,10.10.50.14:39400";
const mongoRepl = "SPLocal0";

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
