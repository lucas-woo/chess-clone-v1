import type { Application } from "express-serve-static-core"
import express from "express"
import cors from "cors"
import session from "express-session"
import bodyParser from "body-parser"
import passport from "passport"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth-routes.ts"
import puzzleRoutes from "./routes/puzzle-routes.ts"
import { connectMongo } from "./database/connect-mongo.ts"
import { connectRedis } from "./database/connect-redis.ts"
import { RedisStore } from "connect-redis"
import { errorMiddleware } from "./middleware/auth-validators.ts"
import testRoutes from "./routes/test-routes.ts"
import adminRoutes from "./routes/admin-routes.ts"
import profileRoutes from "./routes/profile-routes.ts"

const COOKIE_SECRET = process.env.COOKIE_SECRET  || ""
const SESSION_SECRET = process.env.SESSION_SECRET || ""
export const createApp = async(): Promise<Application>  => {

  const db = await connectMongo()
  const store = await connectRedis()
  if(!store || !db){
    throw new Error("unable to connect to database")
  }

  const app = express()
  
  app.use(errorMiddleware)
  
  
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }))

  app.use(bodyParser.json({
    limit: "500kb",
    strict: true
  }))
  
  app.use(cookieParser(COOKIE_SECRET))
  
  app.use(session({
    store: (store as RedisStore),
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
      httpOnly: true, 
      maxAge: 1000 * 60 * 60,
      path: "/",
    },
    name: "sess"
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  //routes
  app.use("/auth", authRoutes)
  app.use("/api/puzzles", puzzleRoutes)
  app.use("/test", testRoutes)
  app.use("/api/admin", adminRoutes)
  app.use("/api/profile", profileRoutes)
  return app

}