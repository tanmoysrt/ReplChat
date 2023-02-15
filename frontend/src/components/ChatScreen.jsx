import {Box, Text, Flex} from "@chakra-ui/react";
import ChatBody from "./chatBody";
import ChatBox from "./chatBox";
import ChatHeader from "./chatHeader";

export default function ChatScreen({controller}){
    return(
        controller.currentChatId === ""  ?
        <Flex w="full" h="full" bg="white" justifyContent="center" alignItems="center">
            <Text>Select a chat message</Text>
        </Flex>
        : <Box
            w="full"
            h="full"
            bg="white"
        >
            <ChatHeader controller={controller} />
            <ChatBody   controller={controller} />
            <ChatBox    controller={controller} />
        </Box>
    );
}