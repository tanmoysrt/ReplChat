import { Box } from "@chakra-ui/react";
import ChatMessage from "@/components/chatMessage";

export default function ChatBody({controller}){
    return (
        <Box h="80vh" w="full">
            {
                controller.currentChatMessages.map(message => <ChatMessage controller={controller} record={message} key={message.id} />)
            }
        </Box>
    );
}