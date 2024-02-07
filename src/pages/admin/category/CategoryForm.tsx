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
					{selectedCategory.id === null || selectedCategory.id.trim() === "" ? "Add Category" : "Edit Category"}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl isRequired isInvalid={selectedCategory.name === ""}>
						<FormLabel style={{ fontWeight: 'bold' }}>Name</FormLabel>
						<Input value={selectedCategory.name} onChange={(e) => {
							setSelectedCategory({ ...selectedCategory, name: e.target.value })
						}} required />
						<FormErrorMessage>name is required</FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel style={{ fontWeight: 'bold' }}>Image</FormLabel>
						<ImageUploader value={imagePreviewUrl} setValue={setImagePreviewUrl}></ImageUploader>
					</FormControl>
					<FormControl>
						<FormLabel style={{ fontWeight: 'bold' }}>Parent Category</FormLabel>
						<Dropdown
							value={selectedCategory.parentCategoryId}
							onChange={handleParentCategoryChange}
						/>
					</FormControl>
					<FormControl>
						<FormLabel style={{ fontWeight: 'bold' }}>Edit attributes</FormLabel>
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
						Close
					</Button>
					<Button variant='ghost' color='green'
						onClick={handleModalSubmit}
					>Save</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default CategoryForm;