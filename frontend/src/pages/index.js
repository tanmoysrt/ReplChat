import ChatList from '@/components/ChatList'
import ChatScreen from '@/components/ChatScreen'
import { Box, Flex } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'


export default function Home() {
  return (
    <Flex p={3} h="100vh" gap="6">
      <ChatList/>
      <ChatScreen />
    </Flex>
  )
}
