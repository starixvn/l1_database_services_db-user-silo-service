import { healthcheck } from "@ldb/healthcheck";
import { healthcheckPort } from "../app-configs.js";
import { name, version } from "../metadata.js";

await healthcheck({ name, version }, healthcheckPort);
