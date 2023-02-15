import { Flex, Text } from "@chakra-ui/react";

export default function ChatHeader({controller}){
    return(
        <Flex p={4} direction="column" width="full" bg="gray.50" borderRadius="16">
            <Text fontWeight="medium">{controller.getChatDetailsById(controller.currentChatId).name}</Text>
            <Text color="blackAlpha.700">{
                controller.getChatDetailsById(controller.currentChatId).typing ? (
                    controller.getChatDetailsById(controller.currentChatId).typing_name + " typing..."
                ) : controller.userOnlineStatusData[controller.getChatDetailsById(controller.currentChatId).users[0].username] ? "Online" : "Offline"
            }</Text>
        </Flex>
    );
}