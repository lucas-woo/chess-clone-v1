import { useState, useRef } from 'react';
import styles from './SignUpForm.module.css';
import { useNavigate } from 'react-router';
import userIcon from '../../assets/user.svg';
import lockIcon from '../../assets/lock.svg';
import eyeOpenIcon from '../../assets/eye-open.svg';
import eyeClosedIcon from '../../assets/eye-closed.svg';
import googleIcon from '../../assets/google-logo.svg';
import emailIcon from '../../assets/mail-icon.svg';
import { useAuthStore } from '../../store/auth-store';
const SignUpForm = () => {
  const navigate = useNavigate()
  const { signupUser, authenticateUser } = useAuthStore()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({ 
        username: "",
        password: "",
        email: ""
      });
  const [invalid, setInvalid] = useState("");

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors = { 
        username: "",
        password: "",
        email: ""
      }
    if (!username.trim()) newErrors.username = 'Username field is missing';
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (!password.trim()) newErrors.password = 'Password field is missing';
    if (!email.trim()) newErrors.email = 'Email field is missing';
    return newErrors;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const missing = validateForm();

    if (missing.username || missing.password || missing.email) {
      setErrors(missing);
      return;
    }
    setErrors({username: "", password: "", email:""})
    const created = await signupUser(username, password, email, rememberMe)
    if(!created) {
      setInvalid("Error signing up user")
      return
    }

    await authenticateUser();
    navigate("/")
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.errorGlobal}>{invalid}</p>

        <div className={styles.fieldGroup}>
          <div className={styles.inputWrapper}>
            <img
              src={userIcon}
              alt="User"
              className={styles.userIcon}
              onClick={() => {usernameRef.current?.focus()}}
            />
            <input
              ref={usernameRef}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {setUsername(e.target.value); setErrors({...errors ,username: ""})}}
              className={styles.input}
            />
          </div>
          <p className={styles.error}>{errors.username ?? ''}</p>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.inputWrapper}>
            <img
              src={emailIcon}
              alt="Email"
              className={styles.userIcon}
              onClick={() => emailRef.current?.focus()}
            />
            <input
              ref={emailRef}
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => {setEmail(e.target.value); setErrors({...errors, email: ""})}}
              className={styles.input}
            />
          </div>
          <p className={styles.error}>{errors.email ?? ''}</p>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.inputWrapper}>
            <img
              src={lockIcon}
              alt="Password"
              className={styles.lockIcon}
              onClick={() => passwordRef.current?.focus()}
            />
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value); 
                if(e.target.value.length < 8){
                  setErrors({...errors, password: "Password must be at least 8 characters"})
                } else {
                  setErrors({...errors, password: ""})
                }
              }}
              className={styles.input}
            />
            <img
              src={showPassword ? eyeOpenIcon : eyeClosedIcon}
              alt="Toggle Password"
              className={styles.eyeIcon}
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <p className={styles.error}>{errors.password ?? ''}</p>
        </div>

        <div className={styles.options}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{' '}
            Remember me
          </label>

        </div>

        <button type="submit" className={styles.submit}>Sign Up</button>

        <div className={styles.orSeparator}>
          <span></span>
          <p>OR</p>
          <span></span>
        </div>


        <button type="button" className={styles.socialBtn} onClick={() => {
          document.location.href = "http://localhost:3000/auth/google"
        }}>
          <img src={googleIcon} alt="Google" /> Log in with Google
        </button>

      </form>
    </div>
  );
};

export default SignUpForm;
