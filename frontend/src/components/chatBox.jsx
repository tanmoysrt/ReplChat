import {Box, Flex, Input, useDisclosure} from "@chakra-ui/react";
import SendFileChatModal from "@/components/SendFileInChatmodal";
import {useState} from "react";

export default function ChatBox({controller}){
    const fileUploadDisclosure = useDisclosure();
    const [uploading, setUploading] = useState(false);

    async function uploadAndSendFile(){
        setUploading(true);
        const res = await controller.uploadFile();
        if(res){
            if(res.success){
                controller.dataRef.current.uploaded_file = res.data;
                controller.sendFileMessage();
            }
        }
        setUploading(false);
        fileUploadDisclosure.onClose();
    }

    return (
        <>
            <Flex px="2" py="2" bg="gray.100" borderRadius="16" direction="row" alignItems="center" gap={3}>
                <Box borderRadius="13" p="2" bg="white" cursor="pointer" _hover={{
                    bg: "gray.200"
                }}
                onClick={fileUploadDisclosure.onOpen}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  height="20px" width="20px">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>
                </Box>

                <Input id="text_input_box_chat" placeholder='Write your message ..' size='md' variant="unstyled" onChange={(e)=>{
                    controller.dataRef.current.message.text = e.target.value;
                    controller.sendTypingUpdate();
                }} />
                <Box borderRadius="13" p="2" bg="white" cursor="pointer" _hover={{
                    bg: "gray.200"
                }}
                onClick={()=>{
                    controller.sendTextMessage();
                }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height="20px" width="20px">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </Box>
            </Flex>
            <SendFileChatModal
                dataRef={controller.dataRef}
                isOpen={fileUploadDisclosure.isOpen}
                onClose={fileUploadDisclosure.onClose}
                uploading={uploading}
                onClickSubmit={uploadAndSendFile}
            />
        </>
    );
}