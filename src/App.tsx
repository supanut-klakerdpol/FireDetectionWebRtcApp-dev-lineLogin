import React from 'react';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import './App.css';
import VideoPlayer from './components/video-player';


function App(props: any) {
  // start dev line login
  return (
    
    <div className="App">
      <VideoPlayer onSignOut={props.signOut}/>
    </div>
  );
}

export default withAuthenticator(App);