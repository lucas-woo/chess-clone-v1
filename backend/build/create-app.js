var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import puzzleRoutes from "./routes/puzzle-routes.js";
import { connectMongo } from "./database/connect-mongo.js";
import { connectRedis } from "./database/connect-redis.js";
import { errorMiddleware } from "./middleware/auth-validators.js";
import testRoutes from "./routes/test-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import profileRoutes from "./routes/profile-routes.js";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
export const createApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield connectMongo();
    const store = yield connectRedis();
    if (!store || !db) {
        throw new Error("unable to connect to database");
    }
    const app = express();
    app.use(errorMiddleware);
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
    app.use(bodyParser.json({
        limit: "500kb",
        strict: true
    }));
    app.use(cookieParser(COOKIE_SECRET));
    app.use(session({
        store: store,
        resave: false,
        saveUninitialized: false,
        secret: SESSION_SECRET,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            path: "/",
        },
        name: "sess"
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    //routes
    app.use("/auth", authRoutes);
    app.use("/api/puzzles", puzzleRoutes);
    app.use("/test", testRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/profile", profileRoutes);
    return app;
});
