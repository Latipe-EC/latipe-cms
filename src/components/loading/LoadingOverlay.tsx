import { Modal, ModalOverlay, Spinner } from '@chakra-ui/react';

export const LoadingOverlay = ({ isLoading }) => {
	return (
		<Modal isOpen={isLoading} isCentered onClose={() => { }}>
			<ModalOverlay
				bg="blackAlpha.300"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			</ModalOverlay>
		</Modal>
	);
}

