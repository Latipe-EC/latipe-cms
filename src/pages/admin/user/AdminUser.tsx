import { AppThunkDispatch, RootState, useAppSelector } from '../../../store/store';
import React, { useEffect, useRef, useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Flex,
	Image,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	useToast,
	VStack
} from '@chakra-ui/react';
import { UserAdminResponse } from 'api/interface/user';
import { MdSearch } from 'react-icons/md';
import Pagination from "../../../components/pagination/Pagination";
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FlexBox from '../../../components/FlexBox';
import defaultImage from '../../../assets/default.jpg';
import { getAdminUser, updateBanUser } from '../../../store/slices/user-slice';
import { Chip } from '../../../components/Chip';
import { Small } from '../../../components/Typography';

const UsersAdmin = () => {

	const users = useAppSelector((state: RootState) => state.user);
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const [size] = useState(10);
	const dispatch = useDispatch<AppThunkDispatch>();
	const initialized = useRef(false);
	const [filterBanner, setFilterBanner] = useState("ALL");
	const [showModalBan, setShowModalBan] = useState<UserAdminResponse>(null);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const [reasonBan, setReasonBan] = useState("");
	const [showDetailUser, setShowDetailUser] = useState(null);

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
				Header: 'Username',
				accessor: 'username',
				width: 100,
				Cell: ({ value, row }) => {
					const item = row.original;
					return (
						<Flex align='center'>
							<Avatar
								src={item.avatar ? item.avatar : defaultImage}
								w='30px'
								h='30px'
								me='8px'
							/>
							<Text
								color={textColor}
								fontSize='sm'
								fontWeight='600'>
								{value}
							</Text>
						</Flex>
					)
				},
			},
			{
				Header: 'Tên',
				accessor: 'displayName',
				width: 100,
			},
			{
				Header: 'Email',
				accessor: 'email',
				width: 100,
			},
			{
				Header: 'Role',
				accessor: 'role',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{value}
						</div>
					);
				},
			},
			{
				Header: 'Điểm',
				accessor: 'point',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{value}
						</div>
					);
				},
			},
			{
				Header: 'Ví',
				accessor: 'eWallet',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Box m="6px">
								<Chip p="0.25rem 1rem" bg="green">
									<Small textAlign="center" color="white"
										fontWeight="bold">{value.toLocaleString('vi-VN')}₫</Small>
								</Chip>
							</Box>
						</div>
					);
				},
			},
			{
				Header: 'Đã xóa',
				accessor: 'isDeleted',
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
				Header: 'Cấm',
				accessor: 'isBanned',
				Cell: ({ value, row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							{value ? <Button colorScheme="green" onClick={() => {
								setReasonBan(item.reasonBan);
								setShowModalBan(item)
							}}>
								Xem lý do
							</Button> :
								<Button colorScheme="green" onClick={() => setShowModalBan(item)}>
									{value ? "Hủy cấm" : "Cấm"}
								</Button>
							}
						</Flex>
					);
				}
			},
			{
				Header: 'xem',
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							<ButtonGroup spacing="4">
								<Button colorScheme="green" onClick={() => {
									setShowDetailUser(item)
								}}>
									Xem chi tiết
								</Button>
							</ButtonGroup>
						</Flex>
					);
				},
			},
		],
		[users]
	);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true
			dispatch(getAdminUser({
				skip: currentPage * size,
				size,
				name: searchText,
				statusBan: filterBanner,
				orderBy: "createdDate"
			}));
		}
		return () => {
		}
	}, []);


	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
		{
			columns,
			data: users.data,
			initialState: { pageIndex: 0 },
			manualPagination: true,
			pageCount: users.pagination ? Math.ceil(users.pagination.total / size) : 0,
			manualSortBy: true,
		},
		useSortBy,
		usePagination
	);

	const debouncedGetAdminUser = debounce((searchText) => {
		dispatch(getAdminUser({
			skip: currentPage * size,
			size,
			name: searchText,
			statusBan: filterBanner,
			orderBy: "createdDate"
		}));
	}, 500);

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);
		debouncedGetAdminUser(event.target.value);
	};

	const handleUpdateStatusBan = () => {
		const loadingToastId = toast({
			title: 'Đang cập nhật...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(updateBanUser({
			id: showModalBan.id,
			isBanned: !showModalBan.isBanned,
			reason: reasonBan
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
				users.data = users.data.map((item) => {
					if (item.id === showModalBan.id) {
						item.isBan = !showModalBan.isBanned;
					}
					return item;
				})
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
		setReasonBan("");
		setShowModalBan(null);
		setShowDetailUser(null);
	}

	const handleFilterChange = (event) => {
		setFilterBanner(event.target.value);
		dispatch(getAdminUser({
			skip: currentPage * size,
			size,
			name: searchText,
			statusBan: event.target.value
		}));
	}

	return (
		<div>
			<Flex
				borderRadius="6px"
				justifyContent="space-between"
				my={4}
			>
				<Box>
					<InputGroup>
						<InputLeftElement pointerEvents="none" children={<MdSearch />} />
						<Input type="text" placeholder="Search" onChange={handleSearchChange} max="100" />
					</InputGroup>
				</Box>
				<Box>
					<Select placeholder="Lọc cấm" onChange={handleFilterChange}>
						<option value="ALL">ALL</option>
						<option value="TRUE">TRUE</option>
						<option value="FALSE">FALSE</option>
					</Select>
				</Box>
			</Flex>
			{users.data.length === 0 ? (
				<Flex
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					height="50vh"
				>
					<Box>
						<Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
							Không tìm thấy người dùng nào
						</Text>
					</Box>
				</Flex>
			) : <>
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
				<FlexBox justifyContent="center" mt="2.5rem">
					<Pagination
						pageCount={users.pagination ? Math.ceil(users.pagination.total / 10) : 0}
						onChange={(data) => {
							dispatch(getAdminUser({
								skip: +data * size,
								size,
								name: searchText,
								statusBan: filterBanner,
								orderBy: "createdDate"
							}));
							setCurrentPage(+data);
						}}
					/>
				</FlexBox>
				<Modal isOpen={showModalBan !== null} onClose={() => {
					setShowModalBan(null)
					setReasonBan("");
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
							Lý do
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Input
								value={reasonBan}
								min="100"
								onChange={(e) => setReasonBan(e.target.value)}
								readOnly={showModalBan && showModalBan.isBanned}
							>
							</Input>
						</ModalBody>
						<ModalFooter>
							<Flex justifyContent="center" alignItems="center" mt={4}>
								<Button colorScheme="teal" mr={4} onClick={() => {
									setShowModalBan(null)
									setReasonBan("");
								}}>
									Hủy
								</Button>
								<Button colorScheme="red" onClick={handleUpdateStatusBan}>
									{showModalBan && showModalBan.isBanned ? "Hủy cấm" : "Cấm"}
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>

				{showDetailUser &&
					<Modal isOpen={showDetailUser !== null} onClose={() => {
						setShowDetailUser(null)
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
								Thông tin chi tiết
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<VStack align="start" spacing={4}>
									<Image
										src={showDetailUser.avatar}
										boxSize="100px"
										objectFit='cover'
										fallbackSrc={defaultImage}
									/>
									<Text><b>ID:</b> {showDetailUser.id}</Text>
									<Text><b>Name:</b> {showDetailUser.displayName}</Text>
									<Text><b>Phone Number:</b> {showDetailUser.phoneNumber}</Text>
									<Text><b>Email:</b> {showDetailUser.email}</Text>

									<Text><b>Role:</b> {showDetailUser.role}</Text>
									<Text><b>eWallet:</b> {showDetailUser.eWallet}</Text>
									<Text><b>Point:</b> {showDetailUser.point}</Text>
									<Text><b>Username:</b> {showDetailUser.username}</Text>
									<Text><b>Is Banned:</b> {showDetailUser.isBanned ? "Yes" : "No"}</Text>
									{showDetailUser.reasonBan &&
										<Text><b>Reason for Ban:</b> {showDetailUser.reasonBan}</Text>}
									<Text><b>Gender:</b> {showDetailUser.gender}</Text>
									<Text><b>Birthday:</b> {showDetailUser.birthday}</Text>
								</VStack>
							</ModalBody>
							<ModalFooter>
								<Flex justifyContent="center" alignItems="center" mt={4}>
									<Button colorScheme="teal" mr={4} onClick={() => {
										setShowDetailUser(null)
									}}>
										Hủy
									</Button>
									{showDetailUser.isBanned ? <Button colorScheme="green" onClick={() => {
										setReasonBan(showDetailUser.reasonBan);
										setShowModalBan(showDetailUser)
									}}>
										Xem lý do
									</Button> :
										<Button colorScheme="green"
											onClick={() => setShowModalBan(showDetailUser)}>
											{showDetailUser.isBanned ? "Hủy cấm" : "Cấm"}
										</Button>
									}
								</Flex>
							</ModalFooter>
						</ModalContent>
					</Modal>}
			</>}
		</div>
	);
}

export default UsersAdmin;
