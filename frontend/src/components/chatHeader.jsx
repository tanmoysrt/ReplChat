import { Flex, Text } from "@chakra-ui/react";

export default function ChatHeader(){
    return(
        <Flex p={4} direction="column" width="full" bg="gray.50" borderRadius="16">
            <Text fontWeight="medium">Tanmoy Sarkar</Text>
            <Text color="blackAlpha.700">Online</Text>
        </Flex>
    );
}