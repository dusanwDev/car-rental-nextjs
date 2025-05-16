import * as React from 'react';
import LoginForm from '../components/Login';

interface ILoginPageProps {
}

const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {
  return <>
  <LoginForm />
  </>;
};

export default LoginPage;
