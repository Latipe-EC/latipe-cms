import {useNavigate} from "react-router-dom";
import Button from "../../../components/buttons/Button";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import {useDispatch} from "react-redux";
import {AppThunkDispatch} from "../../../store/store";
import {useEffect, useState} from "react";
import {
  GetTotalCommissionResponse,
  GetTotalOrderInMonthResponse,
  GetTotalOrderInYear
} from "api/interface/order";
import {
  getTotalCommission,
  getTotalOrderInMonth,
  getTotalOrderInYear
} from "../../../store/slices/orders-slice";
import {convertDateYYYYMMDD} from "../../../utils/utils";
import {Box, Heading, Input} from "@chakra-ui/react";
import MonthChart from "../../../components/chart/MonthChart";
import YearChart from "../../../components/chart/YearChart";
import CommissionChart from "../../../components/chart/CommissionChart";

const StatisticVendor = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const navigate = useNavigate();

  const [statisticMonth, setStatisticMonth] = useState<GetTotalOrderInMonthResponse>();
  const [statisticYear, setStatisticYear] = useState<GetTotalOrderInYear>();
  const [statisticCommission, setStatisticCommission] = useState<GetTotalCommissionResponse>();
  const [dateMonth, setDateMonth] = useState(new Date());
  const [dateYear, setDateYear] = useState(new Date());
  const [commissionStartMonth, setCommissionStartMonth] = useState(new Date());


  useEffect(() => {
    dispatch(getTotalOrderInMonth(
        {date: convertDateYYYYMMDD(dateMonth)}
    )).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
        return;
      }
      if (!res.data.data.items) {
        setStatisticMonth({
          "code": 0,
          "error_code": "",
          "message": "success",
          "data": {
            "filter_date": "2023-12-01",
            "items": [
              {
                "day": 7,
                "amount": 163944000,
                "count": 4
              },
              {
                "day": 5,
                "amount": 301083156,
                "count": 7346
              }
            ]
          }
        })
        return;
      }
      setStatisticMonth(res.data);
    });

    dispatch(getTotalOrderInYear({date: convertDateYYYYMMDD(dateYear)})).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
        return;
      }
      if (!res.data.data.items) {
        setStatisticYear({
          "code": 0,
          "error_code": "",
          "message": "success",
          "data": {
            "items": [
              {
                "month": 12,
                "amount": 301165128000,
                "count": 7348
              },
              {
                "month": 11,
                "amount": 81972000,
                "count": 2
              }
            ]
          }
        })
        return;
      }
      setStatisticYear(res.data);
    });

    dispatch(getTotalCommission(
        {date: convertDateYYYYMMDD(commissionStartMonth)}
    )).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
        return;
      }
      if (!res.data.data.items) {
        setStatisticCommission({
          "code": 0,
          "error_code": "",
          "message": "success",
          "data": {
            "filter_date": "2023-11-01",
            "items": [
              {
                "month": 12,
                "total_received": 77900000,
                "total_fee": 4100000,
                "total_orders": 2
              }
            ]
          }
        })
        return;
      }
      setStatisticCommission(res.data);
    });

  }, []);

  useEffect(() => {
    dispatch(getTotalOrderInMonth(
        {date: convertDateYYYYMMDD(dateMonth)}
    )).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
        return;
      }
      if (!res.data.data.items) {
        setStatisticMonth({
          "code": 0,
          "error_code": "",
          "message": "success",
          "data": {
            "filter_date": "2023-12-01",
            "items": [
              {
                "day": 7,
                "amount": 163944000,
                "count": 4
              },
              {
                "day": 5,
                "amount": 301083156,
                "count": 7346
              }
            ]
          }
        })
        return;
      }
      setStatisticMonth(res.data);
    });
  }, [dateMonth]);

  useEffect(() => {

    dispatch(getTotalOrderInYear({date: convertDateYYYYMMDD(dateYear)})).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
        return;
      }
      if (!res.data.data.items) {
        setStatisticYear({
          "code": 0,
          "error_code": "",
          "message": "success",
          "data": {
            "items": [
              {
                "month": 12,
                "amount": 301165128000,
                "count": 7348
              },
              {
                "month": 11,
                "amount": 81972000,
                "count": 2
              }
            ]
          }
        })
        return;
      }
      setStatisticYear(res.data);
    });

  }, [dateYear]);

  useEffect(() => {
    dispatch(getTotalCommission(
        {date: convertDateYYYYMMDD(commissionStartMonth)}
    )).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
        return;
      }
      if (!res.data.data.items) {
        setStatisticCommission({
          "code": 0,
          "error_code": "",
          "message": "success",
          "data": {
            "filter_date": "2023-11-01",
            "items": [
              {
                "month": 12,
                "total_received": 77900000,
                "total_fee": 4100000,
                "total_orders": 2
              }
            ]
          }
        })
        return;
      }
      setStatisticCommission(res.data);
    });
  }, [commissionStartMonth]);

  return (
      <div>
        <DashboardPageHeader
            title="Doanh thu"
            iconName="bag_filled"
            button={
              <a href="/vendor/orders">
                <Button color="primary" bg="primary.light" px="2rem">
                  Quay lại
                </Button>
              </a>
            }
        />
        <Box p={5}>
          <Heading mb={5}>Doanh thu theo tháng</Heading>
          <Input
              w="30%"
              type="date"
              value={dateMonth.toISOString().slice(0, 10)}
              onChange={(e) => {
                setDateMonth(new Date(e.target.value))
              }}
          ></Input>
          {statisticMonth && <MonthChart statisticMonth={statisticMonth}/>}
        </Box>
        <Box p={5}>
          <Heading mb={5}>Doanh thu theo năm</Heading>
          <Input
              w="30%"
              type="date"
              value={dateYear.toISOString().slice(0, 10)}
              onChange={(e) => {
                setDateYear(new Date(e.target.value))
              }}
          ></Input>
          {statisticYear && <YearChart statisticYear={statisticYear}/>}
        </Box>
        <Box p={5}>
          <Heading mb={5}>Hoa hồng</Heading>
          <Input
              w="30%"
              type="date"
              value={commissionStartMonth.toISOString().slice(0, 10)}
              onChange={(e) => {
                setCommissionStartMonth(new Date(e.target.value))
              }}
          ></Input>
          {statisticCommission && <CommissionChart statisticCommission={statisticCommission}/>}
        </Box>
      </div>
  );
};


export default StatisticVendor;
