import ChatList from '@/components/ChatList'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'


export default function Home() {
  return (
    <Box p={3} h="100vh">
      <ChatList/>
    </Box>
  )
}
