import styles from './SignUp.module.css';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

const SignUp = () => {
return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>logo</h1>
      <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
