import type { ServerAuthResponse, ServerError } from "../types"
import { create } from "zustand"
import { serverAuth, serverAPI } from "../utils/connect-axios"


interface AuthStore {
  isAuthenticated: boolean,
  isAdmin: boolean,
  username: string,
  allHighScore: number,
  todayRank: number | null,
  todayHighScore: number,
  profilePicture: string,
  setProfilePicture: (picture: string) => void,
  signupUser: (username: string, password: string, email: string, remember: boolean) => Promise<boolean>
  loginUser: (email: string, password: string, remember: boolean) => Promise<boolean>
  authenticateUser: () => void
  verifyUsername: (username: string) => Promise<Boolean>,
  getTodayRank: () => void,
  changeUsername: (username: string) => Promise<Boolean>,
  logout: () => void
}

interface LogUserResponse extends ServerError {
  nextPage: boolean
}


export const useAuthStore = create<AuthStore>((set, get) => {
  return {
    isAuthenticated: false,
    isAdmin: false,
    username: "",
    allHighScore: 0,
    todayRank: null,
    todayHighScore: 0,
    profilePicture: "",
    signupUser: async (username, password, email, remember) => {
      try {
        const response = await serverAuth.post("/signup", {
          username,
          password,
          email,
          remember
        })
        const user: LogUserResponse = response.data
        if (user.err || !user.nextPage) throw new Error();
        return true
      } catch (e) {
        return false
      }
    },
    loginUser: async (email, password, remember) => {
      try {
        const response = await serverAuth.post("/login", {
          email,
          password,
          remember
        })
        const user: LogUserResponse = response.data
        if (user.err || !user.nextPage) throw new Error();
        return true
      } catch (e) {
        return false
      }      
    },
    authenticateUser: async () => {
      try {
        const response = await serverAuth.get("/user/data")
        const user: ServerAuthResponse = response.data
        if (user.err) throw new Error();
        set({
          username: user.username,
          profilePicture: user.profilePicture,
          isAdmin: user.isAdmin,
          allHighScore: user.highScore,
          isAuthenticated: true
        })
      } catch (e) {
        set({
          username: "",
          profilePicture: "",
          isAdmin: false,
          allHighScore: 0,
          isAuthenticated: false,
          todayRank: null,
          todayHighScore: 0
        })
      }
    },
    setProfilePicture: (picture) => {
      set({
        profilePicture: picture
      })
    },
    verifyUsername: async (username) => {
      try {
        const response = await serverAuth.get("/verify-username", {
          params: {
            username
        }})
        if(!response.data.available) return false
        return true
      } catch(e) {
        return false
      }
    },
    changeUsername: async (username) => {
      try {
        const response = await serverAuth.put("/update-username", {
          username
        })
        if(!response.data || response.data.err) throw new Error();
        set({
          username: response.data.newUsername
        })
        return true
      } catch (e) {
        return false
      }
    },
    logout: async() => {
      try {
        if (get().isAuthenticated) {
          await serverAuth.get("/logout")
          get().authenticateUser()
        }
      } catch (e) {
        return 
      }
    },
    getTodayRank: async () => {
      try {
        
        const res = await serverAPI.get("/puzzles/rank")
        if(res.data.err || !res.data.rank) throw new Error()
        set({
          todayRank: res.data.rank,
          todayHighScore: res.data.dailyHighScore
        })
        
      } catch (e) {
        return
      }
    }

  }
})