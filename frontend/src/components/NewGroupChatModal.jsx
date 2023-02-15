import { useEffect } from "react";

const {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputLeftAddon,
  Input,
} = require("@chakra-ui/react");

function NewGroupChatModal({ isOpen, onClose, dataRef, onClickSubmit }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Initiate Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
                <InputLeftAddon>Group Name</InputLeftAddon>
                <Input type='text' placeholder='Enter group name' onChange={(e)=>dataRef.current.new_group_chat_name=e.target.value} />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onClickSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


export default NewGroupChatModal