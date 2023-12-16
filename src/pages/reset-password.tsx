import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  useToast
} from '@chakra-ui/react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {AppThunkDispatch} from '../store/store';
import {resetPassword} from '../store/slices/auth-slice';

const ResetPassword = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const {token} = useParams();

  const handleSubmit = () => {
    const loadingToastId = toast({
      title: 'Đang gửi email...',
      description: <Spinner/>,
      status: 'info',
      duration: null,
      isClosable: true,
      position: "top-right",
    })
    // handle the form submission here
    dispatch(resetPassword({
      token: decodeURIComponent(token), password
    })).unwrap().then((res) => {
      toast.close(loadingToastId);
      if (res.status !== 200) {
        toast({
          title: 'Thất bại!',
          status: 'error',
          duration: 1500,
          isClosable: true,
          position: 'top-right',
        })

      } else {
        toast({
          title: 'Đặt lại mật khẩu thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/login")
        }, 2000);
      }
    }).catch(() => {
      toast.close(loadingToastId);
    });

  };

  const passwordValidation = (password) => {
    if (password === '') return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,16}$/;
    return passwordRegex.test(password);
  };

  const handleError = () => {
    if (password !== confirmPassword) {
      return "Mật khẩu không khớp";
    }
    if (!passwordValidation(password)) {
      return "Mật khẩu phải từ 6 đến 16 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt";
    }
    return "";
  }

  return (
      <Box width="400px" margin="auto" marginTop="100px">
        <Box mx="auto" my="2rem" p={4} boxShadow="lg" borderRadius="md">
          <Heading textAlign="center" mb={6}> Đặt lại mật khẩu</Heading>
          <FormControl id="password" isRequired isInvalid={passwordValidation(password)}>
            <FormLabel>Nhập password</FormLabel>
            <Input value={password} onChange={(e) => setPassword(e.target.value)}/>
          </FormControl>
          <FormControl id="confirmPassword" isRequired
                       isInvalid={passwordValidation(confirmPassword)}>
            <FormLabel>Nhập lại mật khẩu</FormLabel>
            <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <FormErrorMessage>{handleError()}</FormErrorMessage>
          </FormControl>
          <Button colorScheme="blue" type="submit" marginTop="20px" onClick={handleSubmit}
                  isDisabled={password === '' || confirmPassword === '' || password !== confirmPassword ||
                      !passwordValidation(password) || !passwordValidation(confirmPassword)}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
  );
};

export default ResetPassword;