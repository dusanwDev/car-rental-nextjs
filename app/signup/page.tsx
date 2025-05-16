import * as React from 'react';
import SignUpForm from '../components/SignUp';

interface ISignUpPageProps {
}

const SignUpPage: React.FunctionComponent<ISignUpPageProps> = (props) => {
  return <>
    <SignUpForm />
  </>;
};

export default SignUpPage;
