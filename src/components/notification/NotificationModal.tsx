import { Box, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, Flex, Button } from "@chakra-ui/react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import './index.css'
import { Action } from "@/utils/constants";
import { ModalFooter } from "react-bootstrap";

export const NotificationModal = ({ isOpen, onClose, notification }) => {
	return (
		<>
			{notification && (
				<Modal isOpen={isOpen} onClose={onClose} isCentered>
					<ModalOverlay />
					<ModalContent maxW='800px' p={5} borderRadius="lg">
						<Flex align="center" justifyContent="space-between" p={4}>

							<ModalHeader flex="1" textAlign="center" fontSize="2xl" color="teal.500">{notification.title}</ModalHeader>
						</Flex>
						<ModalCloseButton />
						<ModalBody overflowY="auto">
							<Box mb={4} display="flex" justifyContent="center">
								{notification.image && (
									<Box mr={4}>
										<Image boxSize="300px" src={notification.image} alt={notification.title} borderRadius="md" />
									</Box>
								)}
							</Box>
							<Box mb={4}>
								<Text fontSize="sm" color="gray.500">
									Ngày tạo: {new Date(notification.created_at).toLocaleDateString()}
								</Text>
							</Box>
							<Box mb={4}>
								<CKEditor
									editor={ClassicEditor}
									data={notification.body}
									config={{
										toolbar: [],
										removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
										placeholder: 'Type your text here...',
										ckfinder: {
											uploadUrl: ''
										}
									}}
									disabled={true}
								/>
							</Box>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="teal" onClick={onClose}>{Action.CLOSE}</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};