import { Box, Button, Stack, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import ChatCard from "./chatCard";
import NewChatModal from "./NewChatModal";
import SocketIOController from '@/controller/sockethandler'
import NewGroupChatModal from "@/components/NewGroupChatModal";
import AddMemberGroupModal from "@/components/AddMemberModal";

/**
 * @param {SocketIOController} controller
 * @returns {JSX.Element}
 * @constructor
 */
export default function ChatList({controller}) {
    const newChatModalDisclosure = useDisclosure();
    const newGroupChatModalDisclosure = useDisclosure();
    const addNewMemberModalDisclosure = useDisclosure();
    const dataRef = useRef({})

    function onNewChatModalSubmit(){
        if(dataRef.current.new_chat_username === controller.dataRef.current.user.username || dataRef.current.new_chat_username === '') return;
        newChatModalDisclosure.onClose();
        controller.initNewChat(dataRef.current.new_chat_username);
        dataRef.current.new_chat_username = "";
    }

    function onNewGroupChatModalSubmit(){
        if(dataRef.current.new_group_chat_name === "") return;
        newGroupChatModalDisclosure.onClose();
        controller.initNewGroupChat(dataRef.current.new_group_chat_name);
        dataRef.current.new_group_chat_name = "";
    }

    function onAddMemberModalSubmit() {
        if(dataRef.current.new_member_username === "") return;
        addNewMemberModalDisclosure.onClose();
        controller.addMemberToGroupChat(dataRef.current.new_member_username);
        dataRef.current.new_member_username =  "";
    }

    function logout(){
        localStorage.clear();
        window.location.href = "/auth";
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
                        <Button size='xs' colorScheme="blue" variant='outline' onClick={newGroupChatModalDisclosure.onOpen}>New Group Chat</Button>
                        {
                            controller.currentChatId !== null && controller.currentChatId !== undefined && controller.currentChatId !== '' && controller.getChatDetailsById(controller.currentChatId).is_group_chat &&
                            <Button size='xs' colorScheme="blue" variant='outline' onClick={addNewMemberModalDisclosure.onOpen}>Add User</Button>
                        }
                    </Stack>
                    <Button size='xs' float="right" colorScheme="red" onClick={logout}>Logout</Button>
                </Stack>
                {
                    controller.chatList.map(chat => <ChatCard record={chat} controller={controller} key={chat.id} />)
                }
            </Stack>
        </Box>

        <NewChatModal 
            isOpen={newChatModalDisclosure.isOpen}
            onClose={newChatModalDisclosure.onClose}
            dataRef={dataRef} 
            onClickSubmit={()=>{ onNewChatModalSubmit() }}
        />

        <NewGroupChatModal
            isOpen={newGroupChatModalDisclosure.isOpen}
            onClose={newGroupChatModalDisclosure.onClose}
            dataRef={dataRef}
            onClickSubmit={()=>{ onNewGroupChatModalSubmit() }}
        />
        <AddMemberGroupModal
            isOpen={addNewMemberModalDisclosure.isOpen}
            onClose={addNewMemberModalDisclosure.onClose}
            dataRef={dataRef}
            onClickSubmit={()=>{onAddMemberModalSubmit()}}
        />
        </>
    );
}
