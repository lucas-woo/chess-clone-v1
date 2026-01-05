import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import greenTickSVG from "../../assets/green.svg";
import { useProfileStore } from "../../store/profile-store";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router";

const Profile = () => {

  const navigate = useNavigate()
  const { profilePicture, username } = useAuthStore();
  const { changeProfilePicture, availableProfilePictures, getProfilePictures } = useProfileStore()

  const [selectedPic, setSelectedPic] = useState<string | null>(null);

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

    </div>
  );
};

export default Profile;
