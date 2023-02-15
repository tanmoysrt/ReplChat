import { Box } from "@chakra-ui/react";
import ChatMessage from "@/components/chatMessage";

export default function ChatBody(){
    return (
        <Box h="84vh" w="full">
            <ChatMessage/>
        </Box>
    );
}