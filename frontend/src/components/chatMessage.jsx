import { Box } from "@chakra-ui/react";
import Message from "@/models/message";

/**
 * @param {Message} record
 * @param  controller
 * @returns {JSX.Element}
 * @constructor
 */
export default function ChatMessage({record, controller}){
    const isMe = controller.dataRef.current.user.username === record.sender.username;
    return (
        <Box p={2}  w="fit-content" borderRadius={12} alignSelf={isMe ? "flex-end" : "flex-start"} bg={isMe ? "gray.100" : "blue.400"} color={isMe ? "black": "white"} key={record.id}>
            {record.text_content}
        </Box>
    );
}