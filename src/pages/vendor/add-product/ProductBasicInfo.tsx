// ProductBasicInfo.tsx
import { Box, FormControl, FormLabel, Input, Switch } from "@chakra-ui/react";
import { useState } from "react";

const ProductBasicInfo = ({ onBasicInfoChange }) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isPublished, setIsPublished] = useState(true);

	const handleNameChange = (event) => {
		setName(event.target.value);
		onBasicInfoChange({ name: event.target.value, description, isPublished });
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
		onBasicInfoChange({ name, description: event.target.value, isPublished });
	};

	const handlePublishChange = () => {
		setIsPublished(!isPublished);
		onBasicInfoChange({ name, description, isPublished: !isPublished });
	};

	return (
		<Box>
			<FormControl>
				<FormLabel>Tên</FormLabel>
				<Input placeholder="Tên" value={name} onChange={handleNameChange} />
			</FormControl>

			<FormControl>
				<FormLabel>Mô tả</FormLabel>
				<Input placeholder="Mô tả" value={description} onChange={handleDescriptionChange} />
			</FormControl>

			<FormControl>
				<FormLabel>Công khai</FormLabel>
				<Switch onChange={handlePublishChange} id='email-alerts' />
			</FormControl>
		</Box>
	);
};

export default ProductBasicInfo;