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
							<Box mb={4}>
								<Text fontSize="sm" color="gray.500" textAlign="center">
									Ngày tạo: {new Date(notification.created_at).toLocaleDateString()}
								</Text>
							</Box>
							<Box >
								<Box flex={1} display="flex" alignItems="center" justifyContent="center" height="100%">
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
								</Box>
							</Box>
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};