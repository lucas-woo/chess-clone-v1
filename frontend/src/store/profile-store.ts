import { create } from "zustand";
import { serverAPI } from "../utils/connect-axios"
import { useAuthStore } from "./auth-store";

interface ProfilePicturesRes {
  url: string,
  imageName: string,
}

interface ProfileStore {
  availableProfilePictures: ProfilePicturesRes[],
  getProfilePictures: () => void,
  addProfilePicture: () => void,
  changeProfilePicture: (name: string) => void,
  uploadProfilePicture: (image:string, name: string) => void
}

export const useProfileStore = create<ProfileStore>((set) => {
  return {
    availableProfilePictures: [],
    getProfilePictures: async () => {
      try {
        const res = await serverAPI.get("/profile/photos");
        if(!res.data || res.data.err) throw new Error();
        set({
          availableProfilePictures: res.data
        })
      } catch (e) {
        console.error("error getting profile pictures")
      }
    },
    addProfilePicture: async () => {
      try {
        
      } catch (e) {

      }
    },
    changeProfilePicture: async (name: string) => {
      try {
        const { setProfilePicture } = useAuthStore.getState()
        const res = await serverAPI.post("/profile/change-photo", {
          imageName: name
        })
        console.log("here")
        if(!res.data || res.data.err) throw new Error();
        setProfilePicture(res.data.profilePicture)
      } catch (e) {
        console.error('error updating profile picture')
      }
    },
    uploadProfilePicture: async (image: string, name: string) => {
      try {
        const res = await serverAPI.post("/admin/upload-image", {
          image,
          name
        })
        if(!res.data || res.data.err) throw new Error();
      } catch (e) {
        console.error("error uploading pfp")
      }
    }
  }
})
