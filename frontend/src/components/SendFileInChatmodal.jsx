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

function SendFileChatModal({ isOpen, onClose, dataRef, onClickSubmit, uploading }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload and Send</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type='file' placeholder='Enter username' onChange={(e)=>dataRef.current.chat_upload_file_ref=e.target.files} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onClickSubmit} isLoading={uploading}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


export default SendFileChatModal