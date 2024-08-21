import React from 'react';
import avatar from '../../assets/avatar.png';
import classes from './conversation.module.css';

const Conversation = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img src={avatar} alt='avatar' className={classes.personImg} />
        <div className={classes.metaData}>
          {/* TODO: change personUsername */}
          <div className={classes.otherUsername}>Julia</div>
          <div className={classes.lastMsgConvo}>Hey, how are you?</div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
