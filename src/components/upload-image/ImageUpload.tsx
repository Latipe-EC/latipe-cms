import React, { useEffect, useState } from 'react';
import {
	Box,
	FormLabel,
	Input,
	Image,
	SimpleGrid,
	Icon,
	Circle,
	IconButton,
	Flex,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface ImageUploadProps {
	title: string;
	isMultiple: boolean;
	initialImages?: string[];
	imageWidth?: number;
	imageHeight?: number;
	onFilesChange: (files: File[]) => void;
}

const PlusIcon = (props) => (
	<Icon viewBox="0 0 24 24" {...props}>
		<path
			fill="currentColor"
			d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
		/>
	</Icon>
);

const ImageUpload: React.FC<ImageUploadProps> = ({
	title,
	isMultiple,
	initialImages = [],
	imageWidth = 100,
	imageHeight = 100,
	onFilesChange,
}) => {
	const [files, setFiles] = useState<File[]>([]);

	useEffect(() => {
		const fetchImages = async () => {
			const imageFiles = await Promise.all(
				initialImages.map(async (url, index) => {
					const response = await fetch(url);
					const blob = await response.blob();
					const file = new File([blob], `image-${index}.jpg`, { type: blob.type });
					return file;
				})
			);
			setFiles(imageFiles);
			onFilesChange(imageFiles);
		};

		if (initialImages.length > 0) {
			fetchImages();
		}
	}, [initialImages, onFilesChange]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files);
		setFiles([...selectedFiles, ...files]);
		onFilesChange([...selectedFiles, ...files]);
	};

	const handleRemoveImage = (index: number) => {
		const updatedFiles = [...files];
		updatedFiles.splice(index, 1);
		setFiles(updatedFiles);
		onFilesChange(updatedFiles);
	};

	return (
		<Box >
			<FormLabel>{title}</FormLabel>
			<Flex alignItems="center">
				<SimpleGrid columns={4} spacing={4}>
					{files.map((file, index) => (
						<Box key={index} position="relative">
							<Image
								src={URL.createObjectURL(file)}
								alt={`Preview ${index + 1}`}
								width={imageWidth}
								height={imageHeight}
								objectFit="cover"
							/>
							<IconButton
								aria-label="Remove image"
								icon={<CloseIcon />}
								size="sm"
								position="absolute"
								top={2}
								right={2}
								onClick={() => handleRemoveImage(index)}
							/>
						</Box>
					))}
					<Box position="relative" display="inline-block">
						<Input
							type="file"
							accept="image/*"
							multiple={isMultiple}
							onChange={handleImageChange}
							display="none"
							id="image-upload-input"
						/>
						<label htmlFor="image-upload-input">
							<Circle
								size={10}
								bg="gray.200"
								color="blue.500"
								cursor="pointer"
								_hover={{ bg: 'gray.300' }}
								transition="background-color 0.2s"
							>
								<PlusIcon boxSize={6} />
							</Circle>
						</label>
					</Box>
				</SimpleGrid>
			</Flex>
		</Box>
	);
};

export default ImageUpload;