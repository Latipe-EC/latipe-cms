import { AppThunkDispatch, RootState, useAppSelector } from '../../store/store';
import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Form, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { Box, Button, Flex, Image, Input, InputGroup, InputLeftElement, Select, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { CreateCategoryRequest, UpdateCategoryRequest } from 'api/interface/product';
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

const CategoriesAdmin = () => {

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [size] = useState(5);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [parentCategory, setParentCategory] = useState(null);


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
              />
            </div>
          );
        },
      },
      {
        Header: 'Parrent Category',
        accessor: 'parentCategory',
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
            <Flex>
              <Button colorScheme='green' onClick={() => handleEditClick(value)}>
                edit
              </Button>
              <Button colorScheme='red' onClick={() => handleDeleteClick(value)}>
                remove
              </Button>
            </Flex>
          );
        },
        id: 'action',
      },
    ],
    [categories]
  );

  useEffect(() => {
    dispatch(fetchCategories({ limit: currentPage * size, skip: size, name: searchText }));
  }, []);

  useEffect(() => {
    dispatch(fetchCategories({ limit: currentPage * size, skip: size, name: searchText }));
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
    dispatch(fetchCategories({ limit: currentPage * size, skip: size, name: searchText }));
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
    setParentCategory(selectedOption);
  };

  const parentCategoryOptions = categories.list.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleAddSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const image = event.target.elements.formImage.files[0];
    const parentCategoryId = parentCategory?.value || null;
    const newCategory: CreateCategoryRequest =
      { name, file: image, parentCategoryId };
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
      });
    setShowAddModal(false);
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
      const category = categories.data.find((category) => category.id === categoryId);
      setSelectedCategory(category);
      setShowDeleteModal(true);
    },
    [categories]
  );

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
  };

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
      <Table {...getTableProps()} variant="striped" borderWidth="1px" borderRadius="md">
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
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
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()} className={cell.column.id === 'action' ? 'action-column' : ''}>
                      {cell.render('Cell')}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={Math.ceil(categories.pagination.total / 10)}
          onChange={(data) => {
            dispatch(
              fetchCategories({ limit: (+data + 1) * size, skip: size, name: searchText })
            );
            setCurrentPage(+data);
          }}
        />
      </FlexBox>

      <Modal show={showAddModal} onHide={handleAddClose} centered>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
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
            <Button variant="secondary" onClick={handleAddClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showEditModal} onHide={handleEditClose} centered>
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
      </Modal>
    </div>
  );
}

export default CategoriesAdmin;
