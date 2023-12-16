import {useNavigate, useParams} from "react-router-dom";
import Button from "../../../components/buttons/Button";
import {Spinner, Text} from "@chakra-ui/react";
import FlexBox from "../../../components/FlexBox";
import Image from "../../../components/Image";
import {useDispatch} from "react-redux";
import {AppThunkDispatch} from "../../../store/store";
import {validWithdrawPayPal} from "../../../store/slices/payment-slice";
import {useEffect, useState} from "react";

const WithdrawSuccess = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const navigate = useNavigate();
  const {token} = useParams();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    dispatch(validWithdrawPayPal({token: decodeURIComponent(token)})).unwrap().then((res) => {
      if (res.status !== 200)
        navigate('/401');
      setIsSuccess(true);
    });
    return () => {
    }
  }, []);

  return (
      isSuccess ?
          <FlexBox
              flexDirection="column"
              minHeight="80vh"
              justifyContent="center"
              alignItems="center"
              px="0.5rem"
          >
            <Image
                src="/assets/images/order/order_success.svg"
                width="10%"
                mb="1rem"
            />
            <Text fontSize="xl" fontWeight="bold" mb="1rem">
              Xác nhận rút tiền thành công
            </Text>
            <FlexBox flexWrap="wrap">
              <Button
                  variant="outlined"
                  color="primary"
                  m="0.5rem"
                  onClick={() => navigate("/")}
              >
                Về trang chủ
              </Button>
            </FlexBox>
          </FlexBox>
          : (
              <FlexBox
                  flexDirection="column"
                  minHeight="80vh"
                  justifyContent="center"
                  alignItems="center"
                  px="0.5rem"
              >
                <Spinner size="xxl"></Spinner>
              </FlexBox>)
  );
};


export default WithdrawSuccess;
