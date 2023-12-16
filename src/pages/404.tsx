import Button from "../../src/components/buttons/Button";
import FlexBox from "../../src/components/FlexBox";
import Image from "../../src/components/Image";
import {useNavigate} from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  const handleGoBack = async () => {
    navigate(-1);
  };

  return (
      <FlexBox
          flexDirection="column"
          minHeight="100vh"
          justifyContent="center"
          alignItems="center"
          px="1rem"
      >
        <Image
            src="/assets/images/illustrations/404.svg"
            maxWidth="320px"
            width="100%"
            mb="2rem"
        />
        <FlexBox flexWrap="wrap">
          <Button
              variant="outlined"
              color="primary"
              m="0.5rem"
              onClick={handleGoBack}
          >
            Go Back
          </Button>
          <a href="/">
            <Button variant="contained" color="primary" m="0.5rem">
              Go to Home
            </Button>
          </a>
        </FlexBox>
      </FlexBox>
  );
};

export default Error404;
