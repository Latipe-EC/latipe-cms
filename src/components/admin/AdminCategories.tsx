import { AppThunkDispatch, RootState, useAppSelector } from '../../store/store';
import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { Box, Button, ButtonGroup, Flex, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { Attribute, CreateCategoryRequest, UpdateCategoryRequest } from 'api/interface/product';
import { MdSearch } from 'react-icons/md';
import Pagination from "../pagination/Pagination";

import {
	fetchCategories,
	updateCategory,
	addCategory,
	deleteCategory
} from '../../store/slices/categories-slice';
import { AddIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FlexBox from '../FlexBox';
import defaultImage from '../../assets/default.jpg';
import CategoryForm from './CategoryForm';

const CategoriesAdmin = () => {

	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState({
		id: "", name: "", image: "", parentCategory: null, file: null, parentCategoryId: null
	});
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const [size] = useState(10);
	const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
	const [parentCategory, setParentCategory] = useState(null);
	const [attributes, setAttributes] = useState<Attribute[]>([]);
	const [showAddAttribute, setShowAddAttribute] = useState(false);
	const dispatch = useDispatch<AppThunkDispatch>();
	const categories = useAppSelector((state: RootState) => state.categories);

	const toast = useToast();

	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				Cell: ({ row }) => {
					const rowIndex = row.index + 1 + currentPage * size;
					return <div>{rowIndex}</div>;
				},
			},
			{
				Header: 'Name',
				accessor: 'name',
			},
			{
				Header: 'Image',
				accessor: 'image',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Image
								src={value}
								alt="Hình ảnh thể loại"
								boxSize='150px'
								objectFit='cover'
								fallbackSrc={defaultImage}
							/>
						</div>
					);
				},
			},
			{
				Header: 'Parrent Category',
				accessor: 'parentCategoryId',
				sortType: 'basic',
				Cell: ({ value }) => {
					return <div>{value != null ? "YES" : "NO"}</div>;
				},
			},
			{
				Header: 'Action',
				accessor: 'id',
				Cell: ({ value }) => {
					return (
						<Flex justifyContent={'center'}>
							<ButtonGroup spacing="4">
								<Button colorScheme="green" onClick={() => handleEditClick(value)}>
									Edit
								</Button>
								<Button colorScheme="red" onClick={() => handleDeleteClick(value)}>
									Delete
								</Button>
							</ButtonGroup>
						</Flex>
					);
				},
				id: 'action',
			},
		],
		[categories]
	);

	useEffect(() => {
		dispatch(fetchCategories({ skip: currentPage * size, limit: size, name: searchText }));
	}, []);

	useEffect(() => {
		dispatch(fetchCategories({ skip: currentPage * size, limit: size, name: searchText }));
	}, [currentPage]);

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
		{
			columns,
			data: categories.data,
			initialState: { pageIndex: 0 },
			manualPagination: true,
			pageCount: Math.ceil(categories.pagination.total / size),
			manualSortBy: true,
		},
		useSortBy,
		usePagination
	);

	useEffect(() => {
		if (selectedCategory?.parentCategory) {
			setParentCategory({
				value: selectedCategory.parentCategory.Id,
				label: selectedCategory.parentCategory.name,
			});
		} else {
			setParentCategory({ value: '', label: 'None' });
		}
	}, [selectedCategory]);

	useEffect(() => {
		if (!showModal) {
			setParentCategory({ value: '', label: 'None' });
			setImagePreviewUrl(null);
		}
	}, [showModal]);

	const debouncedFetchCategories = debounce((searchText) => {
		dispatch(fetchCategories({ skip: currentPage * size, limit: size, name: searchText }));
	}, 500);

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);
		debouncedFetchCategories(event.target.value);
	};

	const handleAddClick = () => {
		setShowModal(true);
	};

	const handleParentCategoryChange = (selectedOption) => {
		setSelectedCategory({ ...selectedCategory, parentCategory: selectedOption });
		setParentCategory(selectedOption);
	};

	const handleAddSubmit = () => {
		const image = imagePreviewUrl;
		const newCategory: CreateCategoryRequest =
		{
			...selectedCategory, file: image, parentCategoryId: selectedCategory?.parentCategory?.id || null,
			attributes: attributes
		};
		const loadingToastId = toast({
			title: 'Adding new category...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(addCategory(newCategory))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId)
				if (res.status.toString().includes("20")) {
					toast({
						title: 'Success!',
						description: "Add category success",
						status: 'success',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
					setShowModal(false);
					setAttributes([]);
					setSelectedCategory({
						id: "", name: "", image: "", parentCategory: null, file: null
					})
				} else {
					toast({
						title: 'Error!',
						description: "Add category failed",
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
			})
	};

	const handleEditClick = React.useCallback(
		(categoryId) => {
			const category = categories.data.find((category) => category.id === categoryId);
			setSelectedCategory(category);
			setImagePreviewUrl(category.image);
			setShowModal(true);

		},
		[categories]
	);

	const handleEditSubmit = () => {
		const image = imagePreviewUrl;
		const parentCategoryId = parentCategory?.value || null;
		const updatedCategory: UpdateCategoryRequest =
			{ id: selectedCategory.id, name: selectedCategory.name, file: image, parentCategoryId };
		const loadingToastId = toast({
			title: 'Updating new category...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(updateCategory(updatedCategory))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId)
				if (res.status.toString().includes("20")) {
					toast({
						title: 'Success!',
						description: "Update category success",
						status: 'success',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				} else {
					toast({
						title: 'Error!',
						description: "Update category failed",
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
			});
		setShowModal(false);
	};

	const handleDeleteSubmit = () => {
		const loadingToastId = toast({
			title: 'Deleting new category...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(deleteCategory(selectedCategory.id))
			.unwrap()
			.then((res) => {
				if (res === selectedCategory.id) {
					toast.close(loadingToastId)
					toast({
						title: 'Success!',
						description: "Delete category success",
						status: 'success',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				} else {
					toast({
						title: 'Error!',
						description: "Delete category failed",
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
			});
		setShowDeleteModal(false);
	};

	const handleDeleteClick = React.useCallback(
		(categoryId) => {
			console.log(categoryId);
			const category = categories.data.find((category) => category.id === categoryId);
			setSelectedCategory(category);
			setShowDeleteModal(true);
		},
		[categories]
	);

	const handleDeleteClose = () => {
		setShowDeleteModal(false);
	};

	const handleAddAttributes = () => {
		setAttributes([...attributes, { name: "", defaultValue: "", type: "string", isRequired: false, prefixUnit: "", options: '' }]);
	}

	const removeAttribute = (index) => {
		const newAttributes = [...attributes];
		newAttributes.splice(index, 1);
		setAttributes(newAttributes);
	}
	return (
		<div >
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				marginBottom="3"
				width="100%"
			>
				<Box
					position="relative"
					display="inline-block"
					border="1px solid #ced4da"
					borderRadius="6px"
				>
					<InputGroup>
						<InputLeftElement pointerEvents="none" children={<MdSearch />} onChange={handleSearchChange} />
						<Input type="text" placeholder="Search" />
					</InputGroup>
				</Box>
				<Button leftIcon={<AddIcon />} colorScheme='blue' variant='outline' onClick={handleAddClick}>
					Add Category
				</Button>
			</Box>
			<Table {...getTableProps()} variant="striped" borderWidth="1px" borderRadius="md" >
				<Thead >
					{headerGroups.map((headerGroup) => (
						<Tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<Th textAlign="center"
									{...column.getHeaderProps(column.getSortByToggleProps())}
									onClick={(e) => {
										column.getSortByToggleProps().onClick(e);
									}}
									className={`${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''} ${column.id === 'action' ? 'action-column' : ''
										}`}
								>
									{column.render('Header')}
									<span>{column.isSorted ? (column.isSortedDesc ? <ChevronDownIcon /> : <ChevronUpIcon />) : ''}</span>
								</Th>
							))}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{page.map((row) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()} textAlign="center" >
								{row.cells.map((cell) => {
									return (
										<Td textAlign="center" {...cell.getCellProps()} className={cell.column.id === 'action' ? 'action-column' : ''}>
											{cell.render('Cell')}
										</Td>
									);
								})}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
			<FlexBox justifyContent="center" mt="2.5rem" >
				<Pagination
					pageCount={Math.ceil(categories.pagination.total / 10)}
					onChange={(data) => {
						dispatch(
							fetchCategories({ limit: size, skip: (+data) * size, name: searchText })
						);
						setCurrentPage(+data);
					}}
				/>
			</FlexBox>
			<CategoryForm
				attributes={attributes}
				removeAttribute={removeAttribute}
				showAddAttribute={showAddAttribute}
				imagePreviewUrl={imagePreviewUrl}
				setImagePreviewUrl={setImagePreviewUrl}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				setAttributes={setAttributes}
				showModal={showModal}
				setShowAddAttribute={setShowAddAttribute}
				handleParentCategoryChange={handleParentCategoryChange}
				handleModalSubmit={selectedCategory.id === null || selectedCategory.id.trim() === "" ? handleAddSubmit : handleEditSubmit}
				handleAddAttributeClose={() => { setShowAddAttribute(false) }}
				handleModalClose={() => { setShowModal(false) }}
				handleAddAttributes={handleAddAttributes}
			/>


			<Modal isOpen={showDeleteModal} onClose={handleDeleteClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader style={{
						fontWeight: 'bold', fontSize: '20px', color: 'gray.800', textAlign: "center", marginTop: '20px'
					}}>
						Delete Category
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody >
						{`Do you want to delete permernat the category `}
						<strong style={{ fontWeight: 'bold' }}>{selectedCategory?.name || ""}</strong>
						{`?`}
					</ModalBody>
					<ModalFooter>
						<Flex justifyContent="center" alignItems="center" mt={4}>
							<Button colorScheme="teal" mr={4} onClick={handleDeleteClose}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={handleDeleteSubmit}>
								Delete
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>

		</div>
	);
}

export default CategoriesAdmin;
