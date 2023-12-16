import IconButton from "../buttons/IconButton";
import Image from "../Image";
import React, {useState} from "react";
import Box from "../Box";
import Categories from "../categories/Categories";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import MiniCart from "../mini-cart/MiniCart";
import SearchBox from "../search-box/SearchBox";
import Login from "../sessions/Login";
import Sidenav from "../sidenav/Sidenav";
import {Tiny} from "../Typography";
import StyledHeader from "./HeaderStyle";
import UserLoginDialog from "./UserLoginDialog";
import MenuItem from "../MenuItem";
import Menu from "../Menu";
import {useNavigate} from "react-router-dom";
import {RootState, useAppSelector} from "../../store/store";

type HeaderProps = {
  isFixed?: boolean;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({isFixed, className}) => {
  const [open, setOpen] = useState(false);
  const toggleSidenav = () => setOpen(!open);
  const navigate = useNavigate();
  const REACT_STARTER_AUTH = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  }
  const carts = useAppSelector((state: RootState) => state.carts);


  const redirect = (path: string) => {
    navigate(path);
  }

  const cartHandle = (
      <FlexBox ml="20px" alignItems="flex-start">
        <IconButton bg="gray.200" p="12px">
          <Icon size="20px">bag</Icon>
        </IconButton>

        {!!carts.count && (
            <FlexBox
                borderRadius="300px"
                bg="error.main"
                px="5px"
                py="2px"
                alignItems="center"
                justifyContent="center"
                ml="-1rem"
                mt="-9px"
            >
              <Tiny color="white" fontWeight="600">
                {carts.count}
              </Tiny>
            </FlexBox>
        )}
      </FlexBox>
  );

  return (
      <StyledHeader className={className}>
        <Container
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
        >
          <FlexBox className="logo" alignItems="center" mr="1rem">
            <a href="/">
              <Image src="/assets/images/latipe_logo.jpeg" alt="logo"/>
            </a>

            {isFixed && (
                <div className="category-holder">
                  <Categories>
                    <FlexBox color="text.hint" alignItems="center" ml="1rem">
                      <Icon>categories</Icon>
                      <Icon>arrow-down-filled</Icon>
                    </FlexBox>
                  </Categories>
                </div>
            )}
          </FlexBox>

          <FlexBox justifyContent="center" flex="1 1 0">
            <SearchBox/>
          </FlexBox>

          <FlexBox className="header-right" alignItems="center">
            {REACT_STARTER_AUTH && REACT_STARTER_AUTH.isAuthenticated ?
                <Menu
                    className="category-dropdown"
                    direction="right"
                    handler={
                      <IconButton ml="1rem" bg="gray.200" p="8px">
                        <Icon size="28px">user</Icon>
                      </IconButton>
                    }
                >
                  <MenuItem key="1" onClick={() => redirect("/profile")}>
                    My Account
                  </MenuItem>
                  <MenuItem key="2" onClick={() => redirect("/orders")}>
                    Orders
                  </MenuItem>
                  <MenuItem key="3" onClick={logout}>
                    Logout
                  </MenuItem>
                </Menu>
                :
                <UserLoginDialog
                    handle={
                      <IconButton ml="1rem" bg="gray.200" p="8px">
                        <Icon size="28px">user</Icon>
                      </IconButton>
                    }
                >
                  <Box>
                    <Login/>
                  </Box>
                </UserLoginDialog>

            }


            <Sidenav
                handle={cartHandle}
                position="right"
                open={open}
                width={380}
                toggleSidenav={toggleSidenav}
            >
              <MiniCart toggleSidenav={toggleSidenav}/>
            </Sidenav>
          </FlexBox>
        </Container>
      </StyledHeader>
  );
};

export default Header;
