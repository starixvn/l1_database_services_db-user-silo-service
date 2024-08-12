import type { SchedulerEventDescriptions, TimerConfig, Scheduler as UpstreamScheduler } from "@ldb/scheduler";

export type SchedulerKey = "USER";
export type SchedulerConfig = Record<SchedulerKey, TimerConfig>;
export type SchedulerEvents = SchedulerEventDescriptions<SchedulerKey>;
export type Scheduler = UpstreamScheduler<SchedulerKey>;
