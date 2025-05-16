import * as React from 'react';
import PostHouseForm from '../components/PostHouseForm';

interface ICreateProps {
}

const CreateListingComponent: React.FunctionComponent<ICreateProps> = (props) => {
  return <>
    <PostHouseForm />
  </>;
};

export default CreateListingComponent;
