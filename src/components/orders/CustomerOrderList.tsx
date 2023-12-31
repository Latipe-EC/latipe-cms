import React, {useEffect, useState} from 'react';
import DashboardPageHeader from "../layout/DashboardPageHeader";
import OrderRow from "./OrderRow";
import {Box, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {AppThunkDispatch} from 'store/store';
import {useDispatch} from 'react-redux';
import {getMyOrder} from '../../store/slices/orders-slice';
import {GetMyOrderResponse} from 'api/interface/order';
import {useLocation, useNavigate} from 'react-router-dom';
import FlexBox from '../../components/FlexBox';
import Pagination from '../../components/pagination/Pagination';

export interface CustomerOrderListProps {
}

const CustomerOrderList: React.FC<CustomerOrderListProps> = () => {
  const [indexTab, setTabIndex] = useState(0);
  const dispatch = useDispatch<AppThunkDispatch>();
  const [orderList, setOrderList] = useState<GetMyOrderResponse>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filter = params.get('filter');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(params.get('page') ? params.get('page') : "1");

  useEffect(() => {
    handleGetListOrder();
  }, [currentPage, filter]);


  useEffect(() => {
    if (currentPage !== "1")
      setCurrentPage("1");
    else {
      handleGetListOrder();
    }
  }, [indexTab]);


  const handleGetListOrder = () => {
    const paramFilter = {}
    switch (indexTab) {
      case 1:
        paramFilter["filters[status][$eq]"] = 1;
        break;
      case 2:
        paramFilter["filters[status][$eq]"] = 2;
        break;
      case 3:
        paramFilter["filters[status][$eq]"] = 3;
        break;
      case 4:
        paramFilter["filters[status][$in][0]"] = 4;
        paramFilter["filters[status][$in][1]"] = 5;
        break;
      case 5:
        paramFilter["filters[status][$in][0]"] = 7;
        paramFilter["filters[status][$in][1]"] = -1;
        break;
      case 6:
        paramFilter["filters[status][$eq]"] = 6;
        break;
    }
    dispatch(getMyOrder({
      "size": "5",
      "page": currentPage,
      ...paramFilter
    })).unwrap().then((res) => {
      setOrderList(res.data);
    }).catch(() => {
      navigate("/502")
    });
  }

  return (
      <Box minHeight={"xl"} display="flex" flexDirection="column" justifyContent="space-between">
        <FlexBox flexDirection="column" justifyContent="flex-start">
          <DashboardPageHeader title="Đơn hàng của tôi" iconName="bag_filled"/>
          <Tabs onChange={(index) => setTabIndex(index)} position="relative" variant="unstyled">
            <TabList display="flex">
              <Tab flex="1">Tất cả</Tab>
              <Tab flex="1">Chờ thanh toán</Tab>
              <Tab flex="1">Vận chuyển</Tab>
              <Tab flex="1">Chờ giao hàng</Tab>
              <Tab flex="1">Hoàn thành</Tab>
              <Tab flex="1">Đã hủy</Tab>
              <Tab flex="1">Trả hàng/hoàn tiền</Tab>
            </TabList>
            <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
            />
            <TabPanels>
              {Array.from({length: 7}).map((_, index) => (
                  <TabPanel key={`tab-index${index}`}>
                    {orderList && orderList.data.items.map((item, ind) => (
                        <OrderRow order={item} key={ind}/>
                    ))}
                  </TabPanel>
              ))}

            </TabPanels>
          </Tabs>
          {orderList && orderList.data.items.length === 0 &&
              <FlexBox justifyContent="center" alignItems="center" mt="2.5rem" height={"xl"}>
                <Text
                    fontSize="x-large"
                    textAlign="center"
                    fontWeight="bold"
                >Không có đơn hàng nào</Text>
              </FlexBox>
          }
        </FlexBox>
        {orderList && orderList.data.items.length > 0 &&
            <FlexBox justifyContent="center" mt="2.5rem">
              <Pagination
                  pageCount={Math.ceil(orderList.data.total)}
                  onChange={(data) => {
                    setCurrentPage((data + 1).toString());
                  }}
              />
            </FlexBox>}

      </Box>
  );
};

export default CustomerOrderList;
