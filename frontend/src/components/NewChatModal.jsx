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

function NewChatModal({ isOpen, onClose, dataRef, onClickSubmit }) {

    useEffect(()=>{
        console.log(isOpen)
    })

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Initiate new chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
                <InputLeftAddon>username</InputLeftAddon>
                <Input type='text' placeholder='Enter username' onChange={(e)=>dataRef.current.new_chat_username=e.target.value} />
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


export default NewChatModal