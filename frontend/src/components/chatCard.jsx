import { Box, Flex, Text } from "@chakra-ui/react";

export default function ChatCard(){
    return(
        <Box 
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
                <Text fontWeight="medium" fontSize="md">Tanmoy Sarkar</Text>
                <Flex gap="2">
                    <Box bg="red.500" color="white" px="2" py="0.5" borderRadius="full" fontWeight="medium" fontSize="sm">100+</Box>
                    <Box bg="green.400" color="white" px="2" py="0.5" borderRadius="full" fontWeight="medium" fontSize="sm">100+</Box>
                </Flex>
            </Flex>
            <Flex direction="row" justifyContent="space-between" mt="1.5">
                <Text fontWeight="normal" fontSize="md" color="gray.700">uptime bot ta halka dekhis na time pv ta</Text>
                <Text fontWeight="medium" fontSize="md" color="gray.700">&nbsp;&nbsp;7:41pm</Text>
            </Flex>
        </Box>
        );
}