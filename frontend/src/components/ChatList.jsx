import { Box, Stack } from "@chakra-ui/react";
import ChatCard from "./chatCard";

export default function ChatList() {
    return(
        <Box 
            w={{
                "sm": "90vw",
                "md": "40vw",
                "lg": "25vw"
            }}
            h="100%"
            bg="gray.50"
            borderRadius={16}
            p={3}
        >
            <Stack gap={2}>
                <ChatCard />
                <ChatCard />
            </Stack>
        </Box>
    );
}
