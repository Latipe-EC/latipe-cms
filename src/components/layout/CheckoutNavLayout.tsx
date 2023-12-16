import React, {useEffect, useState} from "react";
import Container from "../Container";
import Box from "../Box";
import Grid from "../grid/Grid";
import Navbar from "../navbar/Navbar";
import Stepper from "../stepper/Stepper";
import AppLayout from "./AppLayout";
import {Outlet, useNavigate} from "react-router-dom";

const CheckoutNavLayout: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState(0);
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        navigate("/cart");
        break;
      case 1:
        navigate("/checkout");
        break;
      case 2:
        navigate("/payment");
        break;
      case 3:
        navigate("/orders");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setSelectedStep(1);
        break;
      case "/checkout":
        setSelectedStep(2);
        break;
      case "/payment":
        setSelectedStep(3);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
      <AppLayout navbar={<Navbar/>}>
        <Container my="2rem">
          <Box mb="14px">
            <Grid container spacing={6}>
              <Grid item lg={8} md={8} xs={12}>
                <Stepper
                    stepperList={stepperList}
                    selectedStep={selectedStep}
                    onChange={handleStepChange}
                />
              </Grid>
            </Grid>
          </Box>
          <Outlet/>
        </Container>
      </AppLayout>
  );
};

const stepperList = [
  {
    title: "Cart",
    disabled: false,
  },
  {
    title: "Details",
    disabled: false,
  },
  {
    title: "Payment",
    disabled: false,
  },
  {
    title: "Review",
    disabled: true,
  },
];

export default CheckoutNavLayout;
