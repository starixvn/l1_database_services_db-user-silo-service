import { BaseContainer } from "@ldb/base-container";
import type { MongoClient } from "@ldb/mongo";
import { asClass, asValue } from "awilix";
import { healthcheckPort, lumiLoggerConfig, schedulerConfig } from "./app-configs.js";
import { App } from "./app.js";
import { metadata } from "./metadata.js";
import { namespaces } from "./namespaces.js";
import { UserTransformer } from "./transformers/user-transfromer.js";

export class Container extends BaseContainer {
    constructor() {
        super();
    }

    register() {
        this.registerLogger(lumiLoggerConfig).registerHealthcheck(metadata, healthcheckPort).registerScheduler(schedulerConfig).registerClasses();
        return this;
    }

    private registerClasses() {
        this.container.register({
            app: asClass(App).singleton(),
            userTransformer: asClass(UserTransformer).singleton(),
        });
        return this;
    }

    registerDatabases(mongo: MongoClient) {
        this.container.register({
            mongo: asValue(mongo),
        });

        for (const [name, value] of Object.entries(namespaces)) {
            this.container.register({
                [name]: asValue(value),
            });
        }

        return this;
    }
}
