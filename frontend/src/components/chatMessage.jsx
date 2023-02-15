import { Box } from "@chakra-ui/react";
import Message from "@/models/message";

/**
 * @param {Message} record
 * @param  controller
 * @returns {JSX.Element}
 * @constructor
 */
export default function ChatMessage({record, controller}){
    return (
        <Box p={4} borderRadius={16} float="right" bg="blue.200" key={record.id}>
            {record.text_content}
        </Box>
    );
}