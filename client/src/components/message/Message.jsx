import React from 'react';
import avatar from '../../assets/avatar.png';
import classes from './message.module.css';

const Message = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img src={avatar} alt='avatar' className={classes.personImg} />
        <div className={classes.messageAndTimeAgo}>
          <div className={classes.text}>Hey, how are you?</div>
          <span className={classes.timeAgo}>2 hours ago</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
