import ChatList from '@/components/ChatList'
import ChatScreen from '@/components/ChatScreen'
import SocketIOController from '@/controller/sockethandler'
import { Box, Flex } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import chat from "@/models/chat";

export default function Home() {
  const dataRef = useRef({
    "init": false,
    "new_chat_username": "",
    "new_group_chat_name": "",
    "new_member_username": "",
    "message": {
      "text": ""
    },
    "user": {
      "name": "",
      "username": ""
    }
  });
  const [chatList, setChatList] = useState([]);
  const chatListRef = useRef([]);
  const [userOnlineStatusData, setUserOnlineStatusData] = useState({});
  const userOnlineStatusDataRef = useRef({});
  const [currentChatId, setCurrentChatId] = useState("");
  const currentChatIdRef = useRef("");
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const currentChatMessagesRef = useRef([]);
  const socketIOController = new SocketIOController(
      chatList, setChatList, chatListRef,
      userOnlineStatusData, setUserOnlineStatusData, userOnlineStatusDataRef,
      currentChatId, setCurrentChatId, currentChatIdRef,
      currentChatMessages, setCurrentChatMessages, currentChatMessagesRef,
      dataRef
  )

  useEffect(()=>{
    if(!dataRef.current.init){
      dataRef.current.init = true;
      if(localStorage.getItem("token") === null){
        window.location.href = "/auth"
      }else{
        socketIOController.init(localStorage.getItem("token"));
      }
    }

    chatListRef.current = chatList;
    userOnlineStatusDataRef.current = userOnlineStatusData;
    currentChatIdRef.current = currentChatId;
    currentChatMessagesRef.current = currentChatMessages;
    },[chatList, userOnlineStatusData, currentChatId, currentChatMessages])
  return (
    <Flex p={3} h="100vh" gap="6">
      <ChatList controller={socketIOController}/>
      <ChatScreen controller={socketIOController} />
    </Flex>
  )
}
