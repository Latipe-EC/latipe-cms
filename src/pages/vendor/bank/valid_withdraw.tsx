import {useNavigate} from "react-router-dom";
import Button from "../../../components/buttons/Button";
import {Text} from "@chakra-ui/react";
import FlexBox from "../../../components/FlexBox";
import Image from "../../../components/Image";


const ValidWithdraw = () => {
  const navigate = useNavigate();

  return (
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
          Mail xác nhận đã được gửi đến email của bạn, vui lòng kiểm tra và xác nhận trong vòng 15
          phút!
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
  );
};


export default ValidWithdraw;
