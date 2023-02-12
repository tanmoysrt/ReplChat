import { Box } from "@chakra-ui/react";
import ChatHeader from "./chatHeader";

export default function ChatScreen(){
    return(
        <Box
            w="full"
            h="full"
            bg="white"
        >
            <ChatHeader />
        </Box>
    );
}