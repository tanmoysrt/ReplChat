import {Box, Flex, Input} from "@chakra-ui/react";

export default function ChatBox({controller}){
    return (
        <Flex px="2" py="2" bg="gray.100" borderRadius="16" direction="row" alignItems="center">
            <Input placeholder='Write your message ..' size='md' variant="unstyled" onChange={(e)=>{
                controller.dataRef.current.message.text = e.target.value;
                controller.sendTypingUpdate();
            }} />
            <Box borderRadius="13" p="2" bg="white" cursor="pointer" _hover={{
                bg: "gray.200"
            }} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height="20px" width="20px">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </Box>

        </Flex>
    );
}