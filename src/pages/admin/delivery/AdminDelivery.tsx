import { AppThunkDispatch } from '@stores/store';
import React, { useEffect, useRef, useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useDispatch } from 'react-redux';
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Textarea,
	Th,
	Thead,
	Tr,
	useToast
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Chip } from '@components/Chip';
import { Small } from '@components/Typography';
import {
	createDelivery,
	getAdminListDelivery,
	upateDelivery,
	upateStatusDelivery
} from '@stores/slices/deliveries-slice';
import { DeliveryResponse } from '@interfaces/delivery';
import { useNavigate } from 'react-router-dom';

const DeliveriesAdmin = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch<AppThunkDispatch>();
	const initialized = useRef(false)
	const [selectDelivery, setSelectDelivery] = useState(null);
	const toast = useToast();
	const [response, setResponse] = useState<DeliveryResponse[]>([]);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true
			dispatch(getAdminListDelivery())
				.unwrap().then((res) => {
					if (res.status !== 200) {
						navigate('/500')
						return;
					}
					setResponse(res.data);
				});
		}
	}, []);
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: '_id',
				Cell: ({ row }) => {
					const rowIndex = row.index + 1;
					return <div>{rowIndex}</div>;
				},
			},
			{
				Header: 'Tên',
				accessor: 'delivery_name',
				width: 100,
			},
			{
				Header: 'Code',
				accessor: 'delivery_code',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{value}
						</div>
					);
				},
			},
			{
				Header: 'Giá mặc định',
				accessor: 'base_cost',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{value}
						</div>
					);
				},
			},
			{
				Header: 'Hoạt động',
				accessor: 'is_active',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Box m="6px">
								<Chip p="0.25rem 1rem" bg={value ? "green" : "red"}>
									<Small textAlign="center" color="white"
										fontWeight="bold">{value ? "Có" : "Không"}</Small>
								</Chip>
							</Box>
						</div>
					);
				},
			},
			{
				Header: 'xem',
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							<ButtonGroup spacing="4">
								<Button colorScheme="green" onClick={() => setSelectDelivery(item)}>
									Xem chi tiết
								</Button>
							</ButtonGroup>
						</Flex>
					);
				},
			},
		],
		[response]
	);
	
	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
		{
			columns,
			data: response,
			initialState: { pageIndex: 0 },
			manualPagination: true,
			pageCount: response?.length,
			manualSortBy: true,
		},
		useSortBy,
		usePagination
	);


	const handleUpdateDelivery = () => {
		const loadingToastId = toast({
			title: 'Đang cập nhật',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(upateDelivery({
			id: selectDelivery._id,
			"delivery_name": selectDelivery.delivery_name,
			"delivery_code": selectDelivery.delivery_code,
			"base_cost": selectDelivery.base_cost,
			"description": selectDelivery.description,
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Thất bại',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			} else {
				const newResponse = [...response];
				const index = newResponse.findIndex((item) => item._id === selectDelivery._id);
				newResponse[index] = { ...selectDelivery }
				setResponse(newResponse);
				toast({
					title: `Thành công`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			}
		}).catch(() => {
			toast.close(loadingToastId);
			toast({
				title: 'Thành công',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
		});
		setSelectDelivery(null);
	}

	const handleAddDelivery = () => {
		const loadingToastId = toast({
			title: 'Đang thêm',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(createDelivery({
			"delivery_name": selectDelivery.delivery_name,
			"delivery_code": selectDelivery.delivery_code,
			"base_cost": parseInt(selectDelivery.base_cost),
			"description": selectDelivery.description,
			"email": selectDelivery.email,
			"phone_number": selectDelivery.phone_number,
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Thất bại',
					status: 'error',
					duration: 3000,
					isClosable: true,
					position: "top-right",
				});
			} else {
				const newResponse = [...response];
				newResponse.push({
					"delivery_name": selectDelivery.delivery_name,
					"delivery_code": selectDelivery.delivery_code,
					"base_cost": parseInt(selectDelivery.base_cost),
					"description": selectDelivery.description,
					is_active: true,
					_id: res.data.id
				});
				setResponse(newResponse);
				toast({
					title: `Thành công`,
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: "top-right",
				});
				setSelectDelivery(null);
			}
		}).catch(() => {
			toast.close(loadingToastId);
			toast({
				title: 'Thành công',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
		});
	}

	const handleUpdateStatus = (status: boolean) => {
		const loadingToastId = toast({
			title: 'Đang cập nhật',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(upateStatusDelivery({
			id: selectDelivery._id,
			status
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Thất bại',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			} else {
				const updatedResponse = [...response];
				const index = updatedResponse.findIndex((item) => item._id === selectDelivery._id);
				if (index !== -1) {
					updatedResponse[index] = { ...selectDelivery, is_active: status };
					setSelectDelivery({ ...selectDelivery, is_active: status });
					setResponse([...updatedResponse]);
				}
				toast({
					title: `Thành công`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			}
		}).catch(() => {
			toast.close(loadingToastId);
			toast({
				title: 'Thành công',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
		});
	}

	return (
		<div>
			{response.length === 0 ? (
				<Flex
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					height="50vh"
				>
					<Box>
						<Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
							Không tìm thấy đơn vị vận chuyển nào
						</Text>
					</Box>
				</Flex>
			) : <>
				<Button colorScheme="green" onClick={() => setSelectDelivery({
					_id: '',
					delivery_name: '',
					delivery_code: '',
					base_cost: 0,
					description: '',
					is_active: true,
					email: null,
					phone_number: null,
				})} mb={4}>Thêm đơn vị vận chuyển</Button>
				<Table {...getTableProps()} variant="striped" borderWidth="1px" borderRadius="md">
					<Thead>
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
										<span>{column.isSorted ? (column.isSortedDesc ? <ChevronDownIcon /> :
											<ChevronUpIcon />) : ''}</span>
									</Th>
								))}
							</Tr>
						))}
					</Thead>
					<Tbody {...getTableBodyProps()}>
						{page.map((row) => {
							prepareRow(row);
							return (
								<Tr {...row.getRowProps()} textAlign="center">
									{row.cells.map((cell) => {
										return (
											<Td textAlign="center" {...cell.getCellProps()}
												className={cell.column.id === 'action' ? 'action-column' : ''}>
												{cell.render('Cell')}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
				{
					selectDelivery && <Modal isOpen={selectDelivery !== null} onClose={() => {
						setSelectDelivery(null)
					}} isCentered>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader style={{
								fontWeight: 'bold',
								fontSize: '20px',
								color: 'gray.800',
								textAlign: "center",
								marginTop: '20px'
							}}>
								{selectDelivery._id ? "Thông tin chi tiết đơn vị vận chuyển" : "Thêm đơn vị vận chuyển"}
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<FormControl id="deliveryName">
									<FormLabel>Tên</FormLabel>
									<Input
										required
										value={selectDelivery.delivery_name}
										min="10"
										onChange={(e) => setSelectDelivery({
											...selectDelivery,
											delivery_name: e.target.value
										})}
									/>
								</FormControl>

								<FormControl id="delivery_code">
									<FormLabel>Mã DVVC</FormLabel>
									<Input
										required
										value={selectDelivery.delivery_code}
										onChange={(e) => setSelectDelivery({
											...selectDelivery,
											delivery_code: e.target.value
										})}
									/>
								</FormControl>

								{!selectDelivery._id &&
									<>
										<FormControl id="delivery_email" isInvalid={selectDelivery.email !== null &&
											!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(selectDelivery.email)}>
											<FormLabel>Email</FormLabel>
											<Input
												required
												type='email'
												value={selectDelivery.email}
												onChange={(e) => setSelectDelivery({
													...selectDelivery,
													email: e.target.value
												})}
												pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"

											/>
											{
												selectDelivery.email !== null &&
												!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(selectDelivery.email) &&
												<FormErrorMessage>
													Email không hợp lệ
												</FormErrorMessage>
											}
										</FormControl>

										<FormControl id="delivery_phone"
											isInvalid={selectDelivery.phone_number !== null &&
												!/^\d{10,11}$/.test(selectDelivery.phone_number)}>
											<FormLabel>Số điện thoại</FormLabel>
											<Input
												required
												type='number'
												value={selectDelivery.phone_number}
												onChange={(e) => setSelectDelivery({
													...selectDelivery,
													phone_number: e.target.value
												})}
												pattern="^\d{10,11}$"
											/>
											{
												!/^\d{10,11}$/.test(selectDelivery.phone_number) &&
												<FormErrorMessage>
													Số điện thoại không hợp lệ
												</FormErrorMessage>
											}
										</FormControl>
									</>
								}

								<FormControl id="base_cost">
									<FormLabel>Giá mặc định</FormLabel>
									<Input
										required
										value={selectDelivery.base_cost}
										type='number'
										min="1"
										onChange={(e) => setSelectDelivery({
											...selectDelivery,
											base_cost: e.target.value
										})}
									/>
								</FormControl>

								<FormControl id="description">
									<FormLabel>Mô tả</FormLabel>
									<Textarea
										required
										value={selectDelivery.description}
										onChange={(e) => setSelectDelivery({
											...selectDelivery,
											description: e.target.value
										})}
										resize="none"
									/>
								</FormControl>

								{selectDelivery._id && <FormControl id="is_active">
									<FormLabel>Hoạt động</FormLabel>
									<Button
										bg={selectDelivery.is_active ? "red" : "green"}
										color={"white"}
										onClick={() => handleUpdateStatus(!selectDelivery.is_active)}
									>{selectDelivery.is_active ? "vô hiệu hóa" : "kích hoạt"}</Button>
								</FormControl>}
							</ModalBody>
							<ModalFooter>
								<Flex justifyContent="center" alignItems="center" mt={4}>
									<Button colorScheme="teal" mr={4} onClick={() => {
										setSelectDelivery(null)
									}}>
										Hủy
									</Button>
									<Button
										isDisabled={
											selectDelivery.delivery_name === ''
											|| selectDelivery.delivery_code === ''
											|| selectDelivery.base_cost < 1
											|| selectDelivery.description === ''
											|| (selectDelivery._id && (selectDelivery.email === ''
												|| selectDelivery.phone_number === ''
												|| !selectDelivery.email
												|| !selectDelivery.phone_number
												|| !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(selectDelivery.email)
												|| !/^\d{10,11}$/.test(selectDelivery.phone_number)
											)
											)

										}

										colorScheme="red" onClick={() => {
											selectDelivery._id ? handleUpdateDelivery() : handleAddDelivery()
										}}>
										Lưu
									</Button>
								</Flex>
							</ModalFooter>
						</ModalContent>
					</Modal>
				}

			</>}
		</div>
	);
}

export default DeliveriesAdmin;
