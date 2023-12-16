import {AppThunkDispatch, RootState, useAppSelector} from '../../../store/store';
import React, {useEffect, useRef, useState} from 'react';
import {usePagination, useSortBy, useTable} from 'react-table';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import {MdSearch} from 'react-icons/md';
import Pagination from "../../../components/pagination/Pagination";
import {ChevronDownIcon, ChevronUpIcon} from '@chakra-ui/icons';
import FlexBox from '../../../components/FlexBox';
import {Chip} from '../../../components/Chip';
import {Small} from '../../../components/Typography';
import {getPaginatePayment} from '../../../store/slices/payment-slice';

const TransactionsAdmin = () => {

  const transactions = useAppSelector((state: RootState) => state.payments);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [size] = useState(10);
  const dispatch = useDispatch<AppThunkDispatch>();
  const [filterStatus, setFilterStatus] = useState("ALL");
  const initialized = useRef(false)
  const columns = React.useMemo(
      () => [
        {
          Header: 'ID',
          accessor: 'id',
          Cell: ({row}) => {
            const rowIndex = row.index + 1 + currentPage * size;
            return <div>{rowIndex}</div>;
          },
        },
        {
          Header: 'Order Id',
          accessor: 'orderId',
          width: 100,
        },
        {
          Header: 'Checkout Id',
          accessor: 'checkoutId',
          width: 100,
        },
        {
          Header: 'Số lượng',
          accessor: 'amount',
          Cell: ({value}) => {
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  {value.toLocaleString('vi-VN')}₫
                </div>
            );
          },
        },
        {
          Header: 'Phương thức',
          accessor: 'paymentMethod',
          Cell: ({value}) => {
            let bgColor;
            switch (value) {
              case 'COD':
                bgColor = 'purple';
                break;
              case 'BANKING':
                bgColor = 'green';
                break;
              case 'PAYPAL':
                bgColor = 'blue';
                break;
              default:
                bgColor = 'gray';
            }
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Box m="6px">
                    <Chip p="0.25rem 1rem" bg={bgColor}>
                      <Small textAlign="center" color="white" fontWeight="bold">  {value}</Small>
                    </Chip>
                  </Box>
                </div>
            );
          },
        },
        {
          Header: 'Trạng thái',
          accessor: 'paymentStatus',
          Cell: ({value}) => {
            let bgColor;
            switch (value) {
              case 'PENDING':
                bgColor = 'orange';
                break;
              case 'COMPLETED':
                bgColor = 'green';
                break;
              case 'CANCELLED':
                bgColor = 'red';
                break;
              default:
                bgColor = 'gray';
            }

            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Box m="6px">
                    <Chip p="0.25rem 1rem" bg={bgColor}>
                      <Small textAlign="center" color="white" fontWeight="bold">{value}</Small>
                    </Chip>
                  </Box>
                </div>
            );
          },
        },
      ],
      [transactions]
  );

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      dispatch(getPaginatePayment({
        skip: currentPage * size,
        size,
        keyword: searchText,
        statusPayment: filterStatus
      }));
    }
  }, []);

  const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow} = useTable(
      {
        columns,
        data: transactions.data,
        initialState: {pageIndex: 0},
        manualPagination: true,
        pageCount: transactions.pagination ? Math.ceil(transactions.pagination.total / size) : 0,
        manualSortBy: true,
      },
      useSortBy,
      usePagination
  );

  const debouncedGetAdminProduct = debounce((searchText) => {
    if (searchText === "" && transactions.data.length === 0)
      return;
    dispatch(getPaginatePayment({
      skip: currentPage * size,
      size,
      keyword: searchText,
      statusPayment: filterStatus
    }));
  }, 500);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedGetAdminProduct(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    dispatch(getPaginatePayment({
      skip: currentPage * size,
      size,
      keyword: searchText,
      statusPayment: event.target.value
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
              <InputLeftElement pointerEvents="none" children={<MdSearch/>}/>
              <Input type="text" placeholder="Search" onChange={handleSearchChange} max="100"/>
            </InputGroup>
          </Box>
          <Box>
            <Select placeholder="Lọc" onChange={handleFilterChange}>
              <option value="ALL">ALL</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </Select>
          </Box>
        </Flex>
        {transactions.data.length === 0 ? (
            <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="50vh"
            >
              <Box>
                <Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
                  Không tìm thấy giao dịch nào
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
                          <span>{column.isSorted ? (column.isSortedDesc ? <ChevronDownIcon/> :
                              <ChevronUpIcon/>) : ''}</span>
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
                pageCount={transactions.pagination ? Math.ceil(transactions.pagination.total / 10) : 0}
                onChange={(data) => {
                  dispatch(getPaginatePayment({
                    skip: +data * size,
                    size,
                    keyword: searchText,
                    statusPayment: filterStatus
                  }));
                  setCurrentPage(+data);
                }}
            />
          </FlexBox>
        </>}
      </div>
  );
}

export default TransactionsAdmin;
