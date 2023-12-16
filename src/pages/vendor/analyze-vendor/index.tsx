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

const AnalyzeVendor = () => {
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
      setStatisticMonth(res.data);
    });

    dispatch(getTotalOrderInYear({date: convertDateYYYYMMDD(dateYear)})).unwrap().then(res => {
      if (res.status !== 200) {
        navigate("/401");
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
      setStatisticCommission(res.data);
    });

  }, []);

  return (
      <div>
        <DashboardPageHeader
            title="Thống kê bán hàng"
            iconName="bag_filled"
            button={
              <a href="/vendor/orders">
                <Button color="primary" bg="primary.light" px="2rem">
                  Quay lại
                </Button>
              </a>
            }
        />

      </div>
  );
};


export default AnalyzeVendor;
