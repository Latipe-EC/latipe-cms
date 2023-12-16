import {useNavigate} from "react-router-dom";
import Button from "../../../components/buttons/Button";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import {useDispatch} from "react-redux";
import {AppThunkDispatch} from "../../../store/store";
import {useEffect, useState} from "react";
import {
  DataGetTotalCommissionAdmin,
  GetTotalOrderInMonthResponse,
  GetTotalOrderInYear
} from "api/interface/order";
import {
  getTotalCommissionAdmin,
  getTotalOrderInMonthAdmin,
  getTotalOrderInYearAdmin
} from "../../../store/slices/orders-slice";
import {convertDateYYYYMMDD} from "../../../utils/utils";
import {Box, Heading, Input} from "@chakra-ui/react";
import MonthChart from "../../../components/chart/MonthChart";
import YearChart from "../../../components/chart/YearChart";
import CommissionAdminChart from "../../../components/chart/CommissionAdminChart";

const StatisticAdmin = () => {

  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  const dispatch = useDispatch<AppThunkDispatch>();
  const navigate = useNavigate();

  const [statisticMonth, setStatisticMonth] = useState<GetTotalOrderInMonthResponse>();
  const [statisticYear, setStatisticYear] = useState<GetTotalOrderInYear>();
  const [statisticCommission, setStatisticCommission] = useState<DataGetTotalCommissionAdmin>();
  const [dateMonth, setDateMonth] = useState(firstDayOfMonth);
  const [dateYear, setDateYear] = useState(firstDayOfMonth);
  const [commissionStartMonth, setCommissionStartMonth] = useState(firstDayOfMonth);

  useEffect(() => {
    dispatch(getTotalOrderInMonthAdmin(
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

    dispatch(getTotalOrderInYearAdmin({date: convertDateYYYYMMDD(dateYear)})).unwrap().then(res => {
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
    dispatch(getTotalCommissionAdmin(
        {date: convertDateYYYYMMDD(commissionStartMonth)}
    )).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
        return;
      }
      setStatisticCommission(res.data.data);
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
              w="10%"
              type="date"
              value={dateMonth.toISOString().slice(0, 10)}
              onChange={(e) => {
                setDateMonth(new Date(e.target.value))
              }}
          ></Input>
          {statisticMonth && statisticMonth.data.items &&
              <MonthChart statisticMonth={statisticMonth}/>}
        </Box>
        <Box p={5}>
          <Heading mb={5}>Doanh thu theo năm</Heading>
          <Input
              w="10%"
              type="date"
              value={dateYear.toISOString().slice(0, 10)}
              onChange={(e) => {
                setDateYear(new Date(e.target.value))
              }}
          ></Input>
          {statisticYear && statisticYear.data.items && <YearChart statisticYear={statisticYear}/>}
        </Box>
        <Box p={5}>
          <Heading mb={5}>Hoa hồng</Heading>
          <Input
              w="10%"
              type="date"
              value={commissionStartMonth.toISOString().slice(0, 10)}
              onChange={(e) => {
                setCommissionStartMonth(new Date(e.target.value))
              }}
          ></Input>
          {statisticCommission && statisticCommission.items &&
              <CommissionAdminChart statisticCommission={statisticCommission}/>}
        </Box>
      </div>
  );
};


export default StatisticAdmin;
