import { useState, useEffect } from "react";
import styles from "./SetProfile.module.css";
import greenTickSVG from "../../assets/green.svg";
import { useProfileStore } from "../../store/profile-store";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router";
type Update = (e: React.ChangeEvent<HTMLInputElement>) => void

const SetProfile = () => {
  
  const { profilePicture, username } = useAuthStore();
  const { changeProfilePicture, availableProfilePictures, getProfilePictures, uploadProfilePicture } = useProfileStore()
  const [ currentImage, setCurrentImage ] = useState<string>("")
  const [selectedPic, setSelectedPic] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("")
  const navigate = useNavigate()
  useEffect(() => {
    getProfilePictures()
  }, [])

  const handleSelect = (pic: string) => {
    if (selectedPic === pic) {
      setSelectedPic(null); 
    } else {
      setSelectedPic(pic); 
    }
  };

  const confirmChange = () => {
    if(!selectedPic) return
    changeProfilePicture(selectedPic)
  } 


  const loadImage: Update = async (e) => {
    try{
      const target = e.target as HTMLInputElement;
      const file: File = (target.files as FileList)[0];
      if(!file)return 
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const image64 = await reader.result
        setCurrentImage(image64 as string)
      }
    }catch(e){
      setCurrentImage("")
    }
  }

  const uploadImage = async () => {
    if(!currentImage || !imageName) return ;
    uploadProfilePicture(currentImage, imageName)
  }

  const changeUsernamePage = () => {
    navigate("/change-username")
  }

  return (
    <div>

      <div className={styles.profileContainer}>
        <img src={profilePicture} alt="Profile" className={styles.avatar} />
        <div className={styles.userInfo}>
          <span className={styles.username}>{username}</span>
          <span className={styles.changeUsername} onClick={changeUsernamePage}>Change username</span>
        </div>
      </div>

      <div className={styles.gallery}>
        {availableProfilePictures
          .filter(pic => pic.url !== profilePicture)
          .map((pic, index) => (
            <div
              key={index}
              className={styles.thumbnailWrapper}
              onClick={() => handleSelect(pic.imageName)}
            >
              <img src={pic.url} alt={`Option ${index + 1}`} className={styles.thumbnail} />
              {selectedPic === pic.imageName && (
                <img src={greenTickSVG} alt="Selected" className={styles.tickIcon} />
              )}
            </div>
        ))}
      </div>


        <button className={selectedPic ? styles.confirmButton : styles.confirmButton2} onClick={confirmChange}>
          Confirm Profile Picture
        </button>

        <input type="file" accept="image/*" onChange={(e)=>{loadImage(e)}}/>
        <button onClick={uploadImage}>
          confirm
        </button>
          <input
            type="text"
            placeholder="image name"
            value={imageName}
            onChange={(e) => {setImageName(e.target.value)}}
          />
    </div>
  );
};

export default SetProfile;
