import React from 'react';
import avatar from '../../assets/avatar.png';
import Conversation from '../conversation/Conversation';
import Message from '../message/Message';
import classes from './home.module.css';

const Home = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <h2 className={classes.title}>Reenbit Chat</h2>
          <Conversation />
        </div>

        <div className={classes.right}>
          <div className={classes.otherUserData}>
            <img src={avatar} alt='avatar' className={classes.otherUserImg} />
            {/* TODO: change personUsername */}
            <h4 className={classes.personUsername}>Julia</h4>
          </div>

          <div className={classes.messages}>
            <Message />
          </div>

          <div className={classes.inputAddBtn}>
            <input type='text' placeholder='Type a message...' className={classes.input} />
            <button className={classes.submitBtn}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
