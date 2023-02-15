import {Box, Flex, Text} from "@chakra-ui/react";
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
        <Box p={2}  w="fit-content" borderRadius={12} alignSelf={isMe ? "flex-end" : "flex-start"} bg={isMe ? "gray.100" : "teal.100"} color={isMe ? "black": "black"} key={record.id}>
            <Flex mb={2}>
                <Text fontWeight="medium">{record.sender.name}</Text>
                <Text fontWeight="normal" color="gray.700" ml={2}>{record.created_at}</Text>
            </Flex>
            {
                record.message_type === "IMAGE"?
                    <img src={controller.generateAssetLink(record.file_stored_name, record.file_name, record.file_mime_type)} style={{
                        maxHeight: "250px",
                        borderRadius: "12px"
                    }} ></img>
                : record.message_type === "AUDIO"?
                    <audio controls >
                        <source src={controller.generateAssetLink(record.file_stored_name, record.file_name, record.file_mime_type)} type={record.file_mime_type} />
                        Your browser does not support the audio element.
                    </audio>
                : record.message_type === "VIDEO" ?
                    <video style={{
                        maxHeight: "250px",
                        borderRadius: "12px"
                    }} controls>
                        <source src={controller.generateAssetLink(record.file_stored_name, record.file_name, record.file_mime_type)} type={record.file_mime_type} />
                        Your browser does not support the video tag.
                    </video>
                : record.message_type === "FILE" ?
                    <Flex direction="row" cursor="pointer" onClick={()=>window.open(controller.generateAssetLink(record.file_stored_name, record.file_name, record.file_mime_type), "_blank")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height="20px" width="20px" style={{
                            marginRight: "8px"
                        }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                        </svg>
                        {record.file_name}
                    </Flex>
                : record.text_content
            }
        </Box>
    );
}