import React from "react";
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import { Attribute } from "@interfaces/product";
import { EditIcon } from "@chakra-ui/icons";
import ImageUploader from "@components/upload-image/UploadImage";
import Dropdown from "@components/dropdown/Dropdown";
import AttributeForm from "@components/attribute/AttributeForm";
import { Action, Content, Title } from "@/utils/constants";
import { isBlank } from "@/utils/utils";

interface Category {
	id: string,
	name: string,
	image: string,
	parentCategoryId: string,
	file: File
}

interface Props {
	attributes: Attribute[];
	showModal: boolean;
	selectedCategory: Category;
	imagePreviewUrl: string;
	showAddAttribute: boolean;
	setShowAddAttribute: (value: boolean) => void;
	handleAddAttributeClose: () => void;
	removeAttribute: (index: number) => void;
	handleAddAttributes: () => void;
	setSelectedCategory: (value: unknown) => void;
	setImagePreviewUrl: (value: string) => void;
	handleParentCategoryChange: (value: unknown) => void;
	setAttributes: (value: Attribute[]) => void;
	handleModalClose: () => void;
	handleModalSubmit: () => void;
}

const CategoryForm: React.FC<Props> = ({
	attributes,
	showModal,
	selectedCategory,
	imagePreviewUrl,
	setShowAddAttribute,
	showAddAttribute,
	handleAddAttributes,
	setSelectedCategory,
	setImagePreviewUrl,
	handleParentCategoryChange,
	setAttributes,
	handleModalClose,
	handleModalSubmit
}) => {

	return (
		<Modal isOpen={showModal} onClose={handleModalClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader style={{
					fontWeight: 'bold',
					fontSize: '20px',
					color: 'gray.800',
					textAlign: "center",
					marginTop: '20px'
				}}>
					{selectedCategory.id === null || selectedCategory.id.trim() === "" ?
						Title.ADD_CATEGORY : Title.UPDATE_CATEGORY}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl isRequired isInvalid={isBlank(selectedCategory.name)}>
						<FormLabel style={{ fontWeight: 'bold' }}>{Content.NAME_CATEGORY}</FormLabel>
						<Input value={selectedCategory.name} onChange={(e) => {
							setSelectedCategory({ ...selectedCategory, name: e.target.value })
						}} required />
						<FormErrorMessage>Tên không được để trống</FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel style={{ fontWeight: 'bold' }}>{Content.IMAGE}</FormLabel>
						<ImageUploader value={imagePreviewUrl} setValue={setImagePreviewUrl}></ImageUploader>
					</FormControl>
					<FormControl>
						<FormLabel style={{ fontWeight: 'bold' }}>{Content.PARENT_CATEGORY}</FormLabel>
						<Dropdown
							value={selectedCategory.parentCategoryId}
							onChange={handleParentCategoryChange}
						/>
					</FormControl>
					<FormControl>
						<FormLabel style={{ fontWeight: 'bold' }}>{Content.EDIT_ATTRIBUTES}</FormLabel>
						<AttributeForm
							attributes={attributes}
							removeAttribute={(index) => {
								const newAttributes = [...attributes];
								newAttributes.splice(index, 1);
								setAttributes(newAttributes);
							}}
							onChange={(index, name, value) => {
								const newAttributes = [...attributes];
								newAttributes[index][name] = value;
								setAttributes(newAttributes);
							}}
							showAddModal={showAddAttribute}
							handleAddClose={() => {
								setShowAddAttribute(false)
							}}
							handleAddAttributes={handleAddAttributes}
						></AttributeForm>
						<IconButton icon={<EditIcon />} onClick={() => setShowAddAttribute(true)}
							aria-label={''}></IconButton>

					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button variant='ghost' color="red" mr={3} onClick={handleModalClose}>
						{Action.CLOSE}
					</Button>
					<Button variant='ghost' color='green'
						disabled={isBlank(selectedCategory.name)}
						onClick={handleModalSubmit}
					>	{Action.SAVE}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default CategoryForm;