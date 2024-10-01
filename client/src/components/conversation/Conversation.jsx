import React from 'react';
import avatar from '../../assets/avatar.png';
import classes from './conversation.module.css';
import { useState, useEffect } from 'react';

const Conversation = ({conversation, currentUser}) => {

  const [otherUser, setOtherUser] = useState('');

 useEffect(() => {
   const fetchOtherUser = async () => {
     try {
       const otherUserId = conversation?.members?.find((member) => member !== currentUser._id);
       const res = await fetch(`http://localhost:5000/user/find/${otherUserId}`);
       const otherUser = await res.json();
       setOtherUser((prev) => otherUser);
     } catch (error) {
       console.error(error.message);
     }
   };
   conversation && fetchOtherUser();
 }, [conversation, currentUser._id]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img src={avatar} alt='avatar' className={classes.personImg} />
        <div className={classes.metaData}>
          <div className={classes.otherUsername}>{otherUser?.username}</div>
          <div className={classes.lastMsgConvo}>{conversation?.lastMessage?.text}</div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
