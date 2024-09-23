import React, { useEffect, useRef } from 'react';
import { format } from 'timeago.js';
import avatar from '../../assets/avatar.png';
import classes from './message.module.css';

const Message = ({ own, message }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    <>
      {!own && (
        <div className={classes.container}>
          <div className={classes.wrapper}>
            <img src={avatar} alt='avatar' className={classes.personImg} />
            <div className={classes.messageAndTimeAgo}>
              <div className={classes.text}>{message.messageText}</div>
              <span className={classes.timeAgo}>{format(message.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
      {own && (
        <div className={`${classes.container} ${classes.own}`}>
          <div className={classes.wrapper}>
            <div className={classes.messageAndTimeAgo}>
              <div className={classes.text}>{message.messageText}</div>
              <span className={classes.timeAgo}>{format(message.createdAt)}</span>
            </div>
            <img src={avatar} alt='avatar' className={classes.personImg} />
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
