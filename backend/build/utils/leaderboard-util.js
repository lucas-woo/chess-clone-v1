var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ALL_LEADERBOARD_KEY, DAILY_LEADERBOARD_KEY, DAILY_RANK_KEY, redisClient } from "../database/connect-redis.js";
export const findAndUpdateUsername = (oldUsername, updatedUsername) => __awaiter(void 0, void 0, void 0, function* () {
    //daily rank
    const currentDailyScore = yield redisClient.zScore(DAILY_RANK_KEY, oldUsername);
    if (currentDailyScore) {
        yield redisClient.zRem(DAILY_RANK_KEY, oldUsername);
        yield redisClient.zAdd(DAILY_RANK_KEY, {
            value: updatedUsername,
            score: currentDailyScore
        });
    }
    //daily score
    const daily = yield redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1);
    if (daily.length) {
        for (let i = 0; i < daily.length; i++) {
            const cur = daily[i];
            const data = JSON.parse(cur.value);
            if (data.username !== oldUsername)
                continue;
            yield redisClient.zRem(DAILY_LEADERBOARD_KEY, cur.value);
            const newData = {
                profilePicture: data.profilePicture,
                username: updatedUsername
            };
            yield redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
                value: JSON.stringify(newData),
                score: cur.score
            });
            break;
        }
    }
    //all
    const all = yield redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1);
    if (all.length) {
        for (let i = 0; i < all.length; i++) {
            const cur = all[i];
            const data = JSON.parse(cur.value);
            if (data.username !== oldUsername)
                continue;
            yield redisClient.zRem(ALL_LEADERBOARD_KEY, cur.value);
            const newData = {
                profilePicture: data.profilePicture,
                username: updatedUsername
            };
            yield redisClient.zAdd(ALL_LEADERBOARD_KEY, {
                value: JSON.stringify(newData),
                score: cur.score
            });
            break;
        }
    }
});
export const findAndUpdateProfilePicture = (username, newURL) => __awaiter(void 0, void 0, void 0, function* () {
    //daily
    const daily = yield redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1);
    if (daily.length) {
        for (let i = 0; i < daily.length; i++) {
            const cur = daily[i];
            const data = JSON.parse(cur.value);
            if (data.username !== username)
                continue;
            yield redisClient.zRem(DAILY_LEADERBOARD_KEY, cur.value);
            const newData = {
                profilePicture: newURL,
                username: username
            };
            yield redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
                value: JSON.stringify(newData),
                score: cur.score
            });
            break;
        }
    }
    //all
    const all = yield redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1);
    if (all.length) {
        for (let i = 0; i < all.length; i++) {
            const cur = all[i];
            const data = JSON.parse(cur.value);
            if (data.username !== username)
                continue;
            yield redisClient.zRem(ALL_LEADERBOARD_KEY, cur.value);
            const newData = {
                profilePicture: newURL,
                username: username
            };
            yield redisClient.zAdd(ALL_LEADERBOARD_KEY, {
                value: JSON.stringify(newData),
                score: cur.score
            });
            break;
        }
    }
});
