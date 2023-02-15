import {Box, Flex} from "@chakra-ui/react";
import ChatMessage from "@/components/chatMessage";

export default function ChatBody({controller}){
    return (
        <Flex h="85vh" w="full" direction="column" gap={2} overflowY="scroll" id="message_box" px={4} py={2} scrollBehavior="smooth"
        >
            {
                controller.currentChatMessages.map(message => <ChatMessage controller={controller} record={message} key={message.id} />)
            }
        </Flex>
    );
}