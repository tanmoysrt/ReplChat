import ChatList from '@/components/ChatList'
import ChatScreen from '@/components/ChatScreen'
import SocketIOController from '@/controller/sockethandler'
import { Box, Flex } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [chatList, setChatList] = useState([]);
  const [userOnlineStatusData, setUserOnlineStatusData] = useState({});
  const [currentChatDetails, setCurrentChatDetails] = useState({});
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const socketIOController = new SocketIOController(chatList, setChatList, userOnlineStatusData, setUserOnlineStatusData, currentChatDetails, setCurrentChatDetails, currentChatMessages, setCurrentChatMessages)

  useEffect(()=>{
    if(localStorage.getItem("token") === null){
      window.location.href = "/auth"
    }else{
      socketIOController.init();
    }
  },[])
  return (
    <Flex p={3} h="100vh" gap="6">
      <ChatList controller={socketIOController}/>
      <ChatScreen controller={socketIOController} />
    </Flex>
  )
}
