import React, { FC } from 'react';
import MapTab from './components/MapTab';
import PostListModal from './components/postList';

const SecondScreen: FC<any> = () => {
  return (
    <>
      {/* <TabSelector /> */}
      <MapTab />
      <PostListModal />
    </>
  );
};

export default SecondScreen;
