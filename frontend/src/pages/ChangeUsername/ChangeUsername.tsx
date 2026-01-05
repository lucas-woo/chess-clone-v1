import styles from "./ChangeUsername.module.css";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from 'react-router';

const ChangeUsername = () => {
  const [usernameField, setUsernameField] = useState("")
  const [usernameError, setUsernameError] = useState<string>("")
  const {username, verifyUsername, changeUsername} = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if(username && username === usernameField) navigate("/")
  }, [username])  

  const onSubmitUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(usernameField.length < 4) {
      setUsernameError("Minimum 4 characters required.")
      return
    }
    const available = await verifyUsername(usernameField)
    if(!available) {
      setUsernameError("This username is already taken.")
      return
    }
    const changed = await changeUsername(usernameField);
    if(!changed){
      setUsernameError("You can only change your username once.")
      return
    }    
  }


  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmitUsername}>
        <h2 className={styles.title}>{username ? "Change Username" : "Create Username"}</h2>
        <input
          type="text"
          placeholder="Enter new username"
          className={styles.input}
          value={usernameField}
          onChange={(e)=>{setUsernameField(e.target.value)}}
        />
        {usernameError && (
          <p className={styles.error}>{usernameError}</p>
        )}
        <button type="submit" className={styles.button}>
          Update
        </button>
        {
          username && <p className={styles.note}>
          You can only change your username once.
        </p>
        }
      </form>
    </div>
  );
};

export default ChangeUsername;
