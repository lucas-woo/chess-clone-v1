import { useState, useRef } from 'react';
import styles from './LoginForm.module.css';
import { NavLink, useNavigate } from 'react-router';
import lockIcon from '../../assets/lock.svg';
import eyeOpenIcon from '../../assets/eye-open.svg';
import eyeClosedIcon from '../../assets/eye-closed.svg';
import googleIcon from '../../assets/google-logo.svg';
import mailIcon from '../../assets/mail-icon.svg';
import { useAuthStore } from '../../store/auth-store';

const LoginForm = () => {
  const navigate = useNavigate()
  const { loginUser, authenticateUser } = useAuthStore()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [invalid, setInvalid] = useState("");

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors = { 
        username: "",
        password: ""
      }
    if (!username.trim()) newErrors.username = 'Username field is missing';
    if (password.length < 8) newErrors.password = 'Incorrect password';
    if (!password.trim()) newErrors.password = 'Password field is missing';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = validateForm();

    if (missing.username || missing.password) {
      setErrors(missing);
      return;
    }
    setErrors({username: "", password: ""})
    const logged = await loginUser(username, password, rememberMe)
    if(!logged) {
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
              src={mailIcon}
              alt="User"
              className={styles.userIcon}
              onClick={() => usernameRef.current?.focus()}
            />
            <input
              ref={usernameRef}
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </div>
          <p className={styles.error}>{errors.username ?? ''}</p>
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
              onChange={(e) => setPassword(e.target.value)}
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

          <NavLink to="/forgot" className={styles.forgotButton}>
            Forgot Password?
          </NavLink>
        </div>

        <button type="submit" className={styles.submit}>Log In</button>

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

        <div className={styles.signup}>
          New?{' '}
          <NavLink to="/signup" className={styles.signupButton}>
            Sign up - and start playing chess!
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
