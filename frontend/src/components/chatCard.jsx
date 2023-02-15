import { Box, Flex, Text } from "@chakra-ui/react";
import Chat from "@/models/chat";

/**
 * @param {Chat} record
 * @returns {JSX.Element}
 * @constructor
 */
export default function ChatCard({record}){
    return(
        <Box
            key={record.id}
            w="100%"
            h={20} 
            bg="white"
            _hover={{
                background: "gray.100"
            }}
            borderRadius={12}
            p={4}
            cursor="pointer"
        >
            <Flex direction="row" justifyContent="space-between">
                <Text fontWeight="medium" fontSize="md">{record.name}</Text>
                <Flex gap="2">
                    {/*<Box bg="red.500" color="white" px="2" py="0.5" borderRadius="full" fontWeight="medium" fontSize="sm">100+</Box>*/}
                    {
                        // record.onl &&  <Box bg="green.400" color="white" px="2" py="0.5" borderRadius="full" fontWeight="medium" fontSize="sm">Online</Box>

                    }
                </Flex>
            </Flex>
            <Flex direction="row" justifyContent="space-between" mt="1.5" gap="2">
                {
                    record.typing ? <Text fontWeight="normal" fontSize="md" color="gray.700" textOverflow="clip" overflow="hidden" whiteSpace="nowrap">typing...</Text> :
                        <>
                            <Text fontWeight="normal" fontSize="md" color="gray.700">&nbsp;&nbsp;{record.last_message_text}</Text>
                            <Text fontWeight="medium" fontSize="md" color="gray.700">&nbsp;&nbsp;{record.last_message_time}</Text>
                        </>
                }
            </Flex>
        </Box>
        );
}