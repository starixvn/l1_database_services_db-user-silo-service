/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */
/** @typedef {import("@ldb/mongo").ChangeStreamNameSpace} ChangeStreamNameSpace */

import { name, version } from "./metadata.js";

export const environment = "XD-PROD";
export const healthcheckPort = 5000;

/** @type {LumiLoggerConfig} */
export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://36fed42b6d2c8eab09bd46ffbd276073@sentrypro-sc.nebula.prod/21",
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

const mongoCred = "lmn_summary:%25%7a%3b%26%30%4f%4f%22%4e%41%58%4d%55%21%38%51%6e%45%26%55%39%34%7e%23%62%62%3f%58%42%60%37%61";
const mongoSrv = "10.99.99.53:39410,10.99.99.54:39410,10.99.99.188:39410,10.99.99.187:39410";
const mongoRepl = "SN-Main";

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
