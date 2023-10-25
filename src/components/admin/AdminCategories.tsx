import { AppThunkDispatch, RootState, useAppSelector } from '../../store/store';
import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { Box, Button, ButtonGroup, Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';
import { Attribute, CreateCategoryRequest, UpdateCategoryRequest } from 'api/interface/product';
import { MdSearch } from 'react-icons/md';
import Pagination from "../pagination/Pagination";

import {
  fetchCategories,
  updateCategory,
  addCategory,
  deleteCategory
} from '../../store/slices/categories-slice';
import { AddIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import FlexBox from '../FlexBox';
import defaultImage from '../../assets/default.jpg';
import Dropdown from '../dropdown/Dropdown';
import ImageUploader from '../upload-image/UploadImage';
import AttributeForm from '../attribute/AttributeForm';

const CategoriesAdmin = () => {

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "", name: "", image: "", parentCategory: null, file: null
  });
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [size] = useState(10);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [attributes, setAttributes] = useState<Attribute>([]);

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
    if (!showAddModal && !showEditModal) {
      setParentCategory({ value: '', label: 'None' });
      setImagePreviewUrl(null);
    }
  }, [showAddModal, showEditModal]);

  const debouncedFetchCategories = debounce((searchText) => {
    dispatch(fetchCategories({ skip: currentPage * size, limit: size, name: searchText }));
  }, 500);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedFetchCategories(event.target.value);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddClose = () => {
    setShowAddModal(false);
  };

  const handleParentCategoryChange = (selectedOption) => {
    setSelectedCategory({ ...selectedCategory, parentCategory: selectedOption });
    setParentCategory(selectedOption);
  };

  const parentCategoryOptions = categories.list.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleAddSubmit = () => {
    console.log(123);
    const image = imagePreviewUrl;
    const newCategory: CreateCategoryRequest =
      { ...selectedCategory, file: image, parentCategoryId: selectedCategory?.parentCategory?.id || null };

    console.log(newCategory);
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
        if (res.status.toString().includes("20")) {
          toast.close(loadingToastId)
          toast({
            title: 'Success!',
            description: "Add category success",
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: "top-right",
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
    // setShowAddModal(false);
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = React.useCallback(
    (categoryId) => {
      const category = categories.data.find((category) => category.id === categoryId);
      setSelectedCategory(category);
      setImagePreviewUrl(category.image);
      setShowEditModal(true);
    },
    [categories]
  );

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const image = imagePreviewUrl ? event.target.elements.formImage.files[0] : null;
    const parentCategoryId = parentCategory?.value || null;
    const updatedCategory: UpdateCategoryRequest =
      { id: selectedCategory.id, name, file: image, parentCategoryId };
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
        if (res.status.toString().includes("20")) {
          toast.close(loadingToastId)
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
    setShowEditModal(false);
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
    setAttributes([...attributes, { name: "", defaultValue: "", type: "text", isRequired: false, prefixUnit: "", options: [] }]);
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

      <Modal isOpen={showAddModal} onClose={handleAddClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{
            fontWeight: 'bold', fontSize: '20px', color: 'gray.800', textAlign: "center", marginTop: '20px'
          }}>
            Add Category
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <FormControl isRequired isInvalid={selectedCategory.name === ""}>
              <FormLabel style={{ fontWeight: 'bold' }}>Name</FormLabel>
              <Input value={selectedCategory.name} onChange={(e) => {
                setSelectedCategory({ ...selectedCategory, name: e.target.value })
              }} required />
              <FormErrorMessage>name is required</FormErrorMessage>
            </FormControl >
            <FormControl  >
              <FormLabel style={{ fontWeight: 'bold' }}>Image</FormLabel>
              <ImageUploader value={imagePreviewUrl} setValue={setImagePreviewUrl} ></ImageUploader>
            </FormControl >
            <FormControl  >
              <FormLabel style={{ fontWeight: 'bold' }}>Parent Category</FormLabel>
              <Dropdown
                value={selectedCategory.parentCategory}
                onChange={handleParentCategoryChange}
              />
            </FormControl >
            <FormControl  >
              <FormLabel style={{ fontWeight: 'bold' }}>Add attributes</FormLabel>
              {attributes.map((attribute, index) => {
                return (
                  <>
                    <Flex alignItems="center" mb={2} mt={2}>
                      <FormLabel alignItems="center" fontWeight="bold" mr={2}
                        mt={2}
                        mb={2}>
                        Attribute {index + 1}
                      </FormLabel>
                      <IconButton icon={<CloseIcon />} size="sm" colorScheme="red" onClick={() => removeAttribute(index)} />
                    </Flex>
                    <Box>
                      <Flex alignItems="center" mb="2">
                        <FormLabel htmlFor="name" mr="2">
                          Name
                        </FormLabel>
                        <Input
                          id="name"
                          value={attribute.name}
                          onChange={(e) => { }}
                          isRequired
                          w="70%"
                          mr="2"
                        />
                        <FormLabel htmlFor="type" mr="2">
                          Type
                        </FormLabel>
                        <Select id="type" value={attribute.type} w="30%" mr="2">
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="selectbox">Selectbox</option>
                        </Select>
                      </Flex>
                      <Flex alignItems="center" mb="2">
                        <FormLabel htmlFor="options" mr="2">
                          Options
                        </FormLabel>
                        <Input
                          id="options"
                          value={attribute.options}
                          onChange={(e) => { }}
                          isRequired
                          w="100%"
                          mr="2"
                        />
                      </Flex>
                      <Flex alignItems="center" mb="2">
                        <FormLabel htmlFor="defaultValue" mr="2">
                          Default Value
                        </FormLabel>
                        <Input
                          id="defaultValue"
                          value={attribute.defaultValue}
                          onChange={(e) => { }}
                          isRequired
                          w="50%"
                          mr="2"
                        />
                        <FormLabel htmlFor="prefixUnit" mr="2">
                          Prefix Unit
                        </FormLabel>
                        <Input
                          id="prefixUnit"
                          value={attribute.prefixUnit}
                          onChange={(e) => { }}
                          isRequired
                          w="50%"
                        />
                      </Flex>
                    </Box>
                  </>
                );
              })}
              <IconButton icon={<AddIcon />} onClick={handleAddAttributes}></IconButton>

            </FormControl >
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' color="red" mr={3} onClick={handleAddClose}>
              Close
            </Button>
            <Button variant='ghost' color='green'
              onClick={handleAddSubmit}
            >Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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

      {/* <Modal show={showEditModal} onHide={handleEditClose} centered>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" defaultValue={selectedCategory?.name} />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    marginTop: '10px',
                  }}
                />
              )}
            </Form.Group>
            <Form.Group controlId="parentCategory">
              <Form.Label>Parent Category</Form.Label>
              <Select
                onChange={handleParentCategoryChange}
                value={parentCategory}
              >
                {parentCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}

              </Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
        <Form onSubmit={handleDeleteSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Do you want to delete permernat the category ${selectedCategory?.name || ""} ?`}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Delete
            </Button>
          </Modal.Footer>
        </Form>
      </Modal> */}



    </div>
  );
}

export default CategoriesAdmin;
