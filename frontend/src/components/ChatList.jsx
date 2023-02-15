import { Box, Button, Stack, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import ChatCard from "./chatCard";
import NewChatModal from "./NewChatModal";
import SocketIOController from '@/controller/sockethandler'

/**
 * @param {SocketIOController} controller
 * @returns {JSX.Element}
 * @constructor
 */
export default function ChatList({controller}) {
    const newChatModalDisclosure = useDisclosure();
    const dataRef = useRef({})

    function onNewChatModalSubmit(){
        newChatModalDisclosure.onClose();
        controller.initNewChat(dataRef.current.new_chat_username);
    }

    return(
        <>
        <Box 
            w={{
                "sm": "90vw",
                "md": "40vw",
                "lg": "25vw"
            }}
            h="100%"
            bg="gray.50"
            borderRadius={16}
            p={3}
        >
            <Stack gap={2}>
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row">
                        <Button size='xs' colorScheme="blue" variant='outline' onClick={newChatModalDisclosure.onOpen}>New Chat</Button>
                        <Button size='xs' colorScheme="blue" variant='outline'>New Group Chat</Button>
                    </Stack>
                    <Button size='xs' float="right" colorScheme="red">Logout</Button>
                </Stack>
                {
                    controller.chatList.map(chat => <ChatCard record={chat} key={chat.id} />)
                }
            </Stack>
        </Box>

        <NewChatModal 
            isOpen={newChatModalDisclosure.isOpen}
            onClose={newChatModalDisclosure.onClose}
            dataRef={dataRef} 
            onClickSubmit={()=>{ onNewChatModalSubmit() }}
        />
        </>
    );
}
