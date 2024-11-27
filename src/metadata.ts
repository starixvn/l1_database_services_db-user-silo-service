import type { Metadata } from "@ldb/utils";

export const name = "user-silo-service" as const;
export const version = "0.1.2" as const;

export const metadata = { name, version } as const satisfies Metadata;
