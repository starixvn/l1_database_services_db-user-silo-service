import type { ChangeStreamNameSpace } from "@ldb/mongo";

export const namespaces = {
    userSessionsNamespace: { db: "minigame", coll: "usersessions" },
    userSilosNamespace: { db: "minigame", coll: "user_silos" },
} as const satisfies Record<string, ChangeStreamNameSpace>;
