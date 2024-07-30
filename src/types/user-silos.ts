import type { ObjectId } from "@ldb/mongo";

export type UserSilosSchema = {
    _id: ObjectId;
    regTime: Date;
    joinTime: Date;
    lastSsoTime: Date;
    lastRecheckInTime: Date;

    operatorId: string;
    siteId: string;
    siteName: string;
    playerId: string;
    playerName: string;
    operatorPlayerId: string;
    nickName: string;

    currency: string;
    currencyCode: string;
    currencyGroupId: ObjectId;
    isTestCurrency: boolean;
    rate: number;

    system: number;
    disableJackpotGames: boolean;

    language: string;
};
