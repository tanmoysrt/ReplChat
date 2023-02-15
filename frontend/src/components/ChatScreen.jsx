import { Box } from "@chakra-ui/react";
import ChatBody from "./chatBody";
import ChatBox from "./chatBox";
import ChatHeader from "./chatHeader";

export default function ChatScreen(){
    return(
        <Box
            w="full"
            h="full"
            bg="white"
        >
            <ChatHeader />
            <ChatBody/>
            <ChatBox />
        </Box>
    );
}