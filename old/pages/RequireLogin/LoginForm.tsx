import Authentication, { useAuthentication } from '@/organisms/Authentication';

const LoginForm: React.FC = () => {
  const { user, logIn, signUp, resetPassword } = useAuthentication();

  return (
    <div className="login-required">
      <Authentication
        user={user}
        onLogIn={logIn}
        onSignUp={signUp}
        onLogOut={() => Promise.reject()}
        onResetPassword={resetPassword}
      />
    </div>
  );
};

export default LoginForm;
