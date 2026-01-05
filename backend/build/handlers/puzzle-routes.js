var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PuzzleModel } from "../database/models/Puzzles.js";
import { redisClient, ALL_LEADERBOARD_KEY, DAILY_LEADERBOARD_KEY, DAILY_RANK_KEY } from "../database/connect-redis.js";
import { UsersModel } from "../database/models/Users.js";
export const getPuzzles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level } = req.query;
        const lvl = Number(level);
        // level 1 is first 5 puzzles
        const puzzleLevels = yield PuzzleModel.aggregate([
            { $match: { level: lvl } },
            { $sample: { size: 5 } },
            { $project: { __v: 0, _id: 0 } }
        ]);
        res.send(puzzleLevels);
    }
    catch (e) {
        console.error("error retrieving puzzles");
        next(e);
    }
});
export const saveProgress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.username)
            return res.sendStatus(401);
        //needa validate score
        const { score } = req.body;
        let updatedScore = false;
        if (req.user.highScore < score) {
            updatedScore = true;
            const updated = yield UsersModel.findByIdAndUpdate(req.user.id, { highScore: score }, { new: true });
            if (!updated)
                throw new Error();
        }
        const player = {
            username: req.user.username,
            profilePicture: req.user.profilePicture,
        };
        //
        // update daily rank
        //
        const currentDailyScore = yield redisClient.zScore(DAILY_RANK_KEY, req.user.username);
        if (!currentDailyScore || (currentDailyScore && currentDailyScore < score)) {
            yield redisClient.zAdd(DAILY_RANK_KEY, { value: req.user.username, score: score });
        }
        //
        // update daily leaderboard
        //
        const daily = yield redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -50);
        if (!daily.length || daily[0].score <= score) {
            const leaderboard = yield redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1);
            let exist = false;
            let changed = false;
            for (let i = 0; i < leaderboard.length; i++) {
                let cur = JSON.parse(leaderboard[i].value);
                if (cur.username !== req.user.username)
                    continue;
                exist = true;
                if (leaderboard[i].score >= score)
                    break;
                yield redisClient.zRem(DAILY_LEADERBOARD_KEY, leaderboard[i].value);
                yield redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
                    score,
                    value: JSON.stringify(player)
                });
                changed = true;
                break;
            }
            if (!changed && !exist) {
                yield redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
                    score,
                    value: JSON.stringify(player)
                });
                let last = yield redisClient.zRange(DAILY_LEADERBOARD_KEY, -51, -51);
                if (leaderboard.length > 50)
                    yield redisClient.zRem(DAILY_LEADERBOARD_KEY, last);
            }
        }
        //
        // update all leaderboard
        //
        const all = yield redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -50);
        if (!all.length || all[0].score <= score) {
            let exist = false;
            const leaderboard = yield redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1);
            let changed = false;
            for (let i = 0; i < leaderboard.length; i++) {
                let cur = JSON.parse(leaderboard[i].value);
                if (cur.username !== req.user.username)
                    continue;
                exist = true;
                if (leaderboard[i].score >= score)
                    break;
                yield redisClient.zRem(ALL_LEADERBOARD_KEY, leaderboard[i].value);
                yield redisClient.zAdd(ALL_LEADERBOARD_KEY, {
                    score,
                    value: JSON.stringify(player)
                });
                changed = true;
                break;
            }
            if (!changed && !exist) {
                yield redisClient.zAdd(ALL_LEADERBOARD_KEY, {
                    score,
                    value: JSON.stringify(player)
                });
                if (leaderboard.length > 50) {
                    let last = yield redisClient.zRange(ALL_LEADERBOARD_KEY, -51, -51);
                    yield redisClient.zRem(ALL_LEADERBOARD_KEY, last);
                }
            }
        }
        return res.send({
            err: false,
            updated: updatedScore
        });
    }
    catch (e) {
        console.error("error saving score");
        next(e);
    }
});
export const getAllLeaderboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //ascending order
        const leaderboard = yield redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1);
        res.send(leaderboard);
    }
    catch (e) {
        console.error("error with getting leaderboard");
        next(e);
    }
});
export const getDailyLeaderboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaderboard = yield redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1);
        res.send(leaderboard);
    }
    catch (e) {
        console.error("error with getting leaderboard");
        next(e);
    }
});
export const getDailyRank = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            throw new Error();
        const rank = yield redisClient.zRevRank(DAILY_RANK_KEY, req.user.username);
        const dailyHighScore = yield redisClient.zScore(DAILY_RANK_KEY, req.user.username);
        if (rank === null) {
            return res.send({
                rank: null,
                dailyHighScore: null,
                err: true
            });
        }
        else {
            return res.send({
                dailyHighScore: dailyHighScore,
                rank: rank + 1,
                err: false
            });
        }
    }
    catch (e) {
        console.error("error in daily rank");
        next(e);
    }
});
