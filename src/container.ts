import { HealthcheckServer } from "@ldb/healthcheck";
import { Logger, SentryLogger, SkynexLogger, TerminalLogger } from "@ldb/logger";
import type { MongoClient } from "@ldb/mongo";
import { Scheduler } from "@ldb/scheduler";
import { asClass, asValue, createContainer, InjectionMode, type AwilixContainer, type ResolveOptions } from "awilix";
import {
    environment,
    healthcheckPort,
    schedulerConfig,
    sentryNodeOptions,
    sentryOptions,
    sentrySeverityLevel,
    skynexOptions,
    skynexSeverityLevel,
    terminalSeverityLevel,
} from "./app-configs.js";
import { App } from "./app.js";
import { name, version } from "./metadata.js";
import { namespaces } from "./namespaces.js";
import { UserTransformer } from "./transformers/user-transfromer.js";

export class Container {
    private readonly container: AwilixContainer;

    constructor() {
        this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });
    }

    register() {
        this.registerLoggers().registerHealthcheck().registerScheduler().registerClasses();
        return this;
    }

    private registerLoggers() {
        this.container.register({
            terminalLogger: asClass(TerminalLogger).singleton(),
            terminalSeverityLevel: asValue(terminalSeverityLevel),
        });
        this.container.register({
            skynexLogger: asClass(SkynexLogger).singleton(),
            skynexOptions: asValue(skynexOptions),
            skynexSeverityLevel: asValue(skynexSeverityLevel),
        });
        this.container.register({
            sentryLogger: asClass(SentryLogger).singleton(),
            sentryNodeOptions: asValue(sentryNodeOptions),
            sentryOptions: asValue(sentryOptions),
            sentrySeverityLevel: asValue(sentrySeverityLevel),
        });
        this.container.register({
            logger: asClass(Logger).singleton(),
            otherLoggers: asValue(null),
            environment: asValue(environment),
        });
        return this;
    }

    private registerHealthcheck() {
        this.container.register({
            healthcheckServer: asClass(HealthcheckServer).singleton(),
            metadata: asValue({ name, version }),
            healthcheckPort: asValue(healthcheckPort),
        });
        return this;
    }

    private registerScheduler() {
        this.container.register({
            scheduler: asClass(Scheduler).singleton(),
            schedulerConfig: asValue(schedulerConfig),
        });
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

    resolve<N extends string>(name: N, resolveOptions?: ResolveOptions) {
        return this.container.resolve(name, resolveOptions);
    }
}
