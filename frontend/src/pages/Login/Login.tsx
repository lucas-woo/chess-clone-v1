import styles from './Login.module.css';
import LoginForm from '../../components/LoginForm/LoginForm';

const Login = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>logo</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
