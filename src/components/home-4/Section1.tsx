import Box from "../Box";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import React from "react";
import FashionCard1 from "./FashionCard1";
import FashionCard2 from "./FashionCard2";
import FashionCard3 from "./FashionCard3";

export interface Section1Props {}

const Section1: React.FC<Section1Props> = () => {
  return (
    <Box mb="1.5rem">
      <Grid container spacing={6}>
        <Grid item md={4} xs={12}>
          <FashionCard1 />
        </Grid>
        <Grid item md={8} xs={12}>
          <FlexBox flexDirection="column" height="100%">
            <FashionCard2 />
            <FashionCard3 />
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Section1;
