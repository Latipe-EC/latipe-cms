import {
	AlertDialog, AlertDialogOverlay, AlertDialogContent,
	AlertDialogHeader, AlertDialogBody
} from '@chakra-ui/react';

export const CustomAlertDialog = ({ isAlterOpen,
	setIsAlterOpen,
	messageAlter,
	titleAlter,
}) => (
	<AlertDialog
		isOpen={isAlterOpen}
		onClose={() => setIsAlterOpen(false)}
		leastDestructiveRef={undefined}
		isCentered
	>
		<AlertDialogOverlay>
			<AlertDialogContent style={{ backgroundColor: '#92b55e' }}>
				<AlertDialogHeader fontSize='lg' fontWeight='bold'>
					{titleAlter}
				</AlertDialogHeader>
				<AlertDialogBody style={{ fontSize: '15px', color: '#ffffff' }}>
					{messageAlter}
				</AlertDialogBody>
			</AlertDialogContent>
		</AlertDialogOverlay>
	</AlertDialog>
);