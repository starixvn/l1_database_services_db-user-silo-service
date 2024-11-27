import { BaseApp } from "@ldb/base-app";
import type { BaseLogger } from "@ldb/logger";
import type { Scheduler } from "@ldb/scheduler";
import type { Metadata } from "@ldb/utils";
import type { UserTransformer } from "./transformers/user-transfromer.js";
import type { SchedulerKeys } from "./types/scheduler.js";

export class App extends BaseApp {
    constructor(
        private readonly scheduler: Scheduler<SchedulerKeys>,
        private readonly userTransformer: UserTransformer,
        metadata: Metadata,
        logger: BaseLogger,
    ) {
        super(metadata, logger);
    }

    initiate() {
        this.userTransformer.subscribe(this.scheduler);
        this.scheduler.emit("USER");
        super.initiate();
    }

    terminate() {
        this.userTransformer.unsubscribe(this.scheduler);
        super.terminate();
    }
}
