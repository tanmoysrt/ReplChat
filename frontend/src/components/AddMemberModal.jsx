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

function AddMemberGroupModal({ isOpen, onClose, dataRef, onClickSubmit }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Member To Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
                <InputLeftAddon>Username</InputLeftAddon>
                <Input type='text' placeholder='Enter user name' onChange={(e)=>dataRef.current.new_member_username=e.target.value} />
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


export default AddMemberGroupModal