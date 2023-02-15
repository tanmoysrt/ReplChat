import { Flex, Text } from "@chakra-ui/react";

export default function ChatHeader({controller}){
    const chat = controller.getChatDetailsById(controller.currentChatId);
    return(
        <Flex py={2} px={4} mb={2} direction="column" width="full" bg="gray.50" borderRadius="16">
            <Text fontWeight="medium">{chat.name}</Text>
            <Text color="blackAlpha.700">{
                chat.typing ? (
                    chat.typing_name + " typing..."
                ) : chat.is_group_chat ?
                    (controller.dataRef.current.user.name +", "+ chat.users.map(user => user.name).join(", "))
                    : (controller.userOnlineStatusData[chat.users[0].username] ? "Online" : "Offline")
            }</Text>
        </Flex>
    );
}