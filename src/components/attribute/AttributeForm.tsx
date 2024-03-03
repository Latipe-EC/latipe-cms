import React from "react";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
} from "@chakra-ui/react";
import { Attribute } from "@interfaces/product";
import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Action, Content, Title } from "@/utils/constants";


interface Props {
	attributes: Attribute[];
	onChange: (index: number, name: string, value: string) => void;
	handleAddClose: () => void;
	showAddModal: boolean;
	removeAttribute: (index: number) => void;
	handleAddAttributes: () => void;
}

const AttributeForm: React.FC<Props> = ({
	attributes,
	onChange,
	showAddModal,
	handleAddClose,
	removeAttribute,
	handleAddAttributes
}) => {
	const handleInputChange = (index: number, name: string, value: string) => {
		onChange(index, name, value);
	};
	return (
		<Modal isOpen={showAddModal} onClose={handleAddClose} isCentered size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader style={{
					fontWeight: 'bold',
					fontSize: '20px',
					color: 'gray.800',
					textAlign: "center",
					marginTop: '20px'
				}}>
					{Title.ADD_ATTRIBUTES}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl>
						<FormLabel style={{ fontWeight: 'bold' }}>Add attributes</FormLabel>
						<Flex flexWrap="wrap">
							{attributes.map((attribute, index) =>
								<>
									<Flex alignItems="center" mb={2} mt={2}>
										<FormLabel alignItems="center" fontWeight="bold" mr={2}
											mt={2}
											mb={2}>
											{index + 1}
										</FormLabel>
										<IconButton icon={<SmallCloseIcon />} size="sm" colorScheme="red"
											onClick={() => removeAttribute(index)} aria-label={""} />
									</Flex>
									<Box>
										<Flex alignItems="center" mb="2">
											<FormLabel htmlFor="name" mr="2">
												{Content.NAME_ATTRIBUTE}
											</FormLabel>
											<Input
												id="name"
												value={attribute.name}
												onChange={(e) => handleInputChange(index, "name", e.target.value)}
												isRequired
												w="100%"
												mr="2"
											/>
										</Flex>
										<Flex alignItems="center" mb="2">
											<Select id="type" value={attribute.type} w="50%" mr="2"
												onChange={(e) => handleInputChange(index, "type", e.target.value)}
											>
												<option value="text">{Content.TEXT}</option>
												<option value="number">{Content.NUMBER}</option>
												<option value="selectbox">{Content.SELECT_BOX}</option>
											</Select>
											<FormLabel htmlFor="type" mr="2">
												{Content.TYPE_ATTRIBUTE}
											</FormLabel>
											<FormLabel htmlFor="prefixUnit" mr="2">
												{Content.PREFIX_UNIT_ATTRIBUTE}
											</FormLabel>
											<Input
												id="prefixUnit"
												value={attribute.prefixUnit}
												onChange={(e) => handleInputChange(index, "prefixUnit", e.target.value)}
												isRequired
												w="50%"
											/>
										</Flex>

										{attribute.type === "selectbox" && (
											<>
												<Flex alignItems="center" mb="2">
													<FormLabel htmlFor="options" mr="2">
														{Content.OPTIONS_ATTRIBUTE}
													</FormLabel>
													<Input
														id="options"
														value={attribute.options}
														onChange={(e) => handleInputChange(index, "options", e.target.value)}
														isRequired
														w="100%"
														mr="2"
													/>
												</Flex>
												<Flex alignItems="center" mb="2">
													<FormLabel htmlFor="defaultValue" mr="2">
														{Content.DEFAULT_VALUE_ATTRIBUTE}
													</FormLabel>
													<Select id="defaultValue" value={attribute.defaultValue} w="100%"
														mr="2" onChange={
															(e) => handleInputChange(index, "defaultValue", e.target.value)
														}>
														{attribute.options.split(',').map((option) => (
															<option value={option}>{option}</option>
														))}
													</Select>
												</Flex>
											</>
										)}

									</Box>
								</>
							)}
						</Flex>
						<IconButton icon={<AddIcon />} onClick={handleAddAttributes}
							aria-label={""}></IconButton>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button variant='ghost' color="red" mr={3} onClick={handleAddClose}>
						{Action.CLOSE}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default AttributeForm;