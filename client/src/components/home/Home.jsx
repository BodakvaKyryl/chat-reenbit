import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import avatar from '../../assets/avatar.png';
import Conversation from '../conversation/Conversation';
import Message from '../message/Message';
import classes from './home.module.css';

const Home = () => {
  const [conversations, setConversations] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [lastConversationClicked, setLastConversationClicked] = React.useState('');
  const [otherUser, setOtherUser] = React.useState('');
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserConversations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/conversation/find/${user._id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const conversations = await res.json();
        setConversations((prev) => conversations);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUserConversations();
  }, [token, user._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/message/${lastConversationClicked._id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const messages = await res.json();
        setMessages((prev) => messages);
      } catch (error) {
        console.error(error.message);
      }
    };
    lastConversationClicked && fetchMessages();
  }, [lastConversationClicked, token]);

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const otherUserId = lastConversationClicked?.members?.find((member) => member !== user._id);
        const res = await fetch(`http://localhost:5000/user/find/${otherUserId}`);
        const otherUser = await res.json();
        setOtherUser((prev) => otherUser);
      } catch (error) {
        console.error(error.message);
      }
    };
    lastConversationClicked && fetchOtherUser();
  }, [lastConversationClicked, user._id]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <h2 className={classes.title}>Reenbit Chat</h2>
          {conversations?.map((c) => (
            <div key={c._id} onClick={() => setLastConversationClicked((prev) => c)}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
        <div className={classes.right}>
          {lastConversationClicked ? (
            <>
              <div className={classes.otherUserData}>
                <img src={avatar} alt='avatar' className={classes.otherUserImg} />
                <h4 className={classes.personUsername}>Julia</h4>
              </div>
              <div className={classes.messages}>
                {messages?.length > 0 ? (
                  messages?.map((message) => (
                    <Message
                      messages={messages}
                      key={message._id}
                      own={message.senderId === user._id}
                      message={message}
                    />
                  ))
                ) : (
                  <h1 className={classes.messageHint}>No messages</h1>
                )}
              </div>
            </>
          ) : (
            <h1 className={classes.messageHint}>Select a conversation</h1>
          )}
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
