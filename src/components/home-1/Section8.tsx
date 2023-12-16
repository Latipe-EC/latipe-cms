import Grid from "../grid/Grid";
import LazyImage from "../LazyImage";
import React from "react";
import Container from "../Container";

const Section8: React.FC = () => {
  return (
      <Container mb="70px">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <a href="/">
              <LazyImage
                  src="/assets/images/banners/banner-1.png"
                  height={342}
                  width={385}
                  layout="responsive"
                  objectFit="contain"
                  alt="banner"
              />
            </a>
          </Grid>
          <Grid item xs={12} md={8}>
            <a href="/">
              <LazyImage
                  src="/assets/images/banners/banner-2.png"
                  height={342}
                  width={790}
                  layout="responsive"
                  objectFit="contain"
                  alt="banner"
              />
            </a>
          </Grid>
        </Grid>
      </Container>
  );
};

export default Section8;
