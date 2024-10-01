import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import avatar from '../../assets/avatar.png';
import Conversation from '../conversation/Conversation';
import Message from '../message/Message';
import classes from './home.module.css';

const Home = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [lastConversationClicked, setLastConversationClicked] = useState('');
  const [otherUser, setOtherUser] = useState('');
  const { user, token } = useSelector((state) => state.auth);
  const [comingMessage, setComingMessage] = useState('');
  const socket = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');

    socket.current.on('getMessage', (data) => {
      console.log(data);
      setComingMessage({
        senderId: data.senderId,
        messageText: data.messageText,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
  }, [user._id]);

  useEffect(() => {
    comingMessage &&
      lastConversationClicked &&
      lastConversationClicked.members &&
      lastConversationClicked.members.includes(comingMessage.senderId) &&
      setMessages((prev) => [...prev, comingMessage]);
  }, [comingMessage, lastConversationClicked]);

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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
      }
    };
    lastConversationClicked && fetchOtherUser();
  }, [lastConversationClicked, user._id]);

  const handlePostMessage = async () => {
    try {
      const res = await fetch(`http://localhost:5000/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: user._id,
          conversationId: lastConversationClicked._id,
          messageText: message,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data]);

      const otherUserId = lastConversationClicked?.members?.find((member) => member !== user._id);

      socket.current.emit('sendMessage', {
        senderId: user._id,
        otherUserId,
        messageText: message,
      });
      setMessage((prev) => '');
    } catch (error) {
      console.error(error);
    }
  };

  console.log('thats gay', messages);

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
                <h4 className={classes.personUsername}>{otherUser?.username}</h4>
              </div>
              <div className={classes.messages}>
                {messages?.length > 0 ? (
                  messages?.map((message, index) => (
                    <div key={`message-container-${index}`}>
                      <Message
                        key={message._id}
                        messages={messages}
                        own={message.senderId === user._id}
                        message={message}
                      />
                    </div>
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
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              type='text'
              placeholder='Type a message...'
              className={classes.input}
            />
            <button onClick={handlePostMessage} className={classes.submitBtn}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
