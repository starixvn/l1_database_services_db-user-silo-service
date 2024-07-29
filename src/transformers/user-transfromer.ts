import type { BaseLogger } from "@ldb/base-logger";
import type { ChangeStreamNameSpace, MongoClient } from "@ldb/mongo";
import type { Scheduler } from "@ldb/scheduler";
import { version } from "../metadata.js";
import { Subscriber } from "../modules/subscriber.js";
import type { SchedulerEvents } from "../types/scheduler.js";
import type { UserSessionsSchema } from "../types/user-sessions.js";
import type { UserSilosSchema } from "../types/user-silos.js";

const DO_FLAG = "__archive.do_summary" as const;
const DONE_FLAG = "__archive.summarized" as const;
const BATCH_LIMIT = 1000 as const;
const USERS_LOOKUP_FIELD = "__user" as const;
const USERINFOS_LOOKUP_FIELD = "__userinfo" as const;

export class UserTransformer extends Subscriber<"USER", Pick<SchedulerEvents, "USER">, Scheduler> {
    private startTime: Date | null = null;

    constructor(
        private readonly mongo: MongoClient,
        private readonly userSessionsNamespace: ChangeStreamNameSpace,
        private readonly userSilosNamespace: ChangeStreamNameSpace,
        logger: BaseLogger
    ) {
        super(logger);
        this.selfBound();
    }

    get className() {
        return this.constructor.name;
    }

    get userSessionsCollection() {
        const { db, coll } = this.userSessionsNamespace;
        return this.mongo.db(db).collection<UserSessionsSchema>(coll);
    }

    get userSilosCollection() {
        const { db, coll } = this.userSilosNamespace;
        return this.mongo.db(db).collection<UserSilosSchema>(coll);
    }

    private selfBound() {
        this.execute = this.execute.bind(this);
    }

    private async execute() {
        if (this.startTime) {
            this.logger.logInfo({ title: this.className, message: `User transformer is running since ${this.startTime.toISOString()}` });
            return;
        }

        try {
            this.startTime = new Date();
            await this.doTransform();
        } catch (error) {
            this.logger.logError({ title: this.className, message: error }, { extra: { startTime: this.startTime } });
        } finally {
            this.startTime = null;
        }
    }

    private async doTransform() {
        let lastCount = 0;
        do {
            await this.setDoFlag();
            await this.transform();
            lastCount = await this.setDoneFlag();
        } while (lastCount > 0);
    }

    private async setDoFlag() {
        await this.userSessionsCollection
            .aggregate([
                { $match: { $or: [{ [DONE_FLAG]: false }, { [DONE_FLAG]: null }] } },
                { $limit: BATCH_LIMIT },
                { $project: { _id: 1 } },
                { $set: { [DO_FLAG]: true } },
                { $merge: { into: this.userSessionsCollection.collectionName } },
            ])
            .toArray();
    }

    private async transform() {
        const { db, coll } = this.userSilosNamespace;

        await this.userSessionsCollection
            .aggregate([
                { $match: { [DO_FLAG]: true } },
                {
                    $project: {
                        _id: 0,
                        ssoToken: 1,
                        ssoTime: 1,
                        recheckInTime: 1,
                        siteId: 1,
                        userId: 1,
                        language: 1,
                        currencyCode: 1,
                        currencyName: 1,
                        currencyGroupId: 1,
                        isTestCurrency: 1,
                        multiplier: 1, //
                        siteName: 1,
                        system: 1,
                        operatorId: 1,
                        playerId: 1,
                        playerName: 1,
                        disableJackpotGames: 1,
                    },
                },
                {
                    $set: {
                        _id: { $toObjectId: "$userId" },
                        currencyGroupId: { $toObjectId: "$currencyGroupId" },
                    },
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 0, "local.regDate": 1, operatorPlayerId: 1 } }, { $limit: 1 }],
                        as: USERS_LOOKUP_FIELD,
                    },
                },
                {
                    $unwind: {
                        path: `$${USERS_LOOKUP_FIELD}`,
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $set: {
                        regTime: `$${USERS_LOOKUP_FIELD}.local.regDate`,
                        operatorPlayerId: `$${USERS_LOOKUP_FIELD}.operatorPlayerId`,
                        [USERS_LOOKUP_FIELD]: "$$REMOVE",
                    },
                },

                {
                    $lookup: {
                        from: "userinfos",
                        localField: "userId",
                        foreignField: "id",
                        pipeline: [{ $project: { _id: 0, name: 1, joinedOn: 1 } }, { $limit: 1 }],
                        as: USERINFOS_LOOKUP_FIELD,
                    },
                },
                {
                    $unwind: {
                        path: `$${USERINFOS_LOOKUP_FIELD}`,
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $set: {
                        nickName: `$${USERINFOS_LOOKUP_FIELD}.name`,
                        joinTime: `$${USERINFOS_LOOKUP_FIELD}.joinedOn`,
                        [USERINFOS_LOOKUP_FIELD]: "$$REMOVE",
                    },
                },

                {
                    $project: {
                        _id: 1,
                        regTime: 1,
                        joinTime: 1,
                        lastSsoTime: "$ssoTime",
                        lastRecheckInTime: "$recheckInTime",

                        operatorId: 1,
                        siteId: 1,
                        siteName: 1,
                        playerId: 1,
                        playerName: 1,
                        operatorPlayerId: 1,
                        nickName: 1,

                        currency: "$currencyName",
                        currencyCode: 1,
                        currencyGroupId: 1,
                        isTestCurrency: 1,
                        rate: 1, //

                        system: 1,
                        disableJackpotGames: 1,

                        language: 1,
                        __v: version,
                    },
                },
                { $merge: { into: { db, coll } } },
            ])
            .toArray();
    }

    private async setDoneFlag() {
        const { matchedCount, modifiedCount } = await this.userSessionsCollection.updateMany({ [DO_FLAG]: true }, { $set: { [DONE_FLAG]: true }, $unset: { [DO_FLAG]: 1 } });

        this.logger.logDebug({ title: `${this.className}-${DO_FLAG}`, message: `#=${matchedCount}  M=${modifiedCount}` });
        return modifiedCount;
    }

    subscribe(publisher: Scheduler) {
        return super.subscribe(publisher, this.execute, "USER");
    }

    unsubscribe(publisher: Scheduler) {
        return super.unsubscribe(publisher, this.execute, "USER");
    }
}
