import Box from "../Box";
import Card from "../Card";
import CategorySectionCreator from "../CategorySectionCreator";
import Grid from "../grid/Grid";
import LazyImage from "../LazyImage";
import {H3, H5} from "../Typography";
import React from "react";

export interface Section6Props {
}

const Section6: React.FC<Section6Props> = () => {
  return (
      <CategorySectionCreator title="Featured Categories">
        <Grid container spacing={6} containerHeight="100%">
          <Grid item md={6} xs={12}>
            <a href="/product/34543543">
              <Card height="100%" hoverEffect>
                <LazyImage
                    src="/assets/images/products/Rectangle 133.png"
                    width="100%"
                    height="auto"
                    layout="responsive"
                />
                <H3 fontWeight="600" p="1.5rem">
                  CAMERA
                </H3>
              </Card>
            </a>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box height="100%">
              <Grid container spacing={6} containerHeight="100%">
                {gridProductList.map((item) => (
                    <Grid item sm={6} xs={12} key={item.title}>
                      <a href={item.productUrl}>
                        <Card height="100%" hoverEffect>
                          <LazyImage
                              src={item.imgUrl}
                              width="100%"
                              height="auto"
                              layout="responsive"
                          />
                          <H5 fontWeight="600" p="1rem" mt="1rem">
                            {item.title}
                          </H5>
                        </Card>
                      </a>
                    </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CategorySectionCreator>
  );
};

const gridProductList = [
  {
    title: "GAMING",
    imgUrl: "/assets/images/products/Rectangle 134432.png",
    productUrl: "/product/34543543",
  },
  {
    title: "WATCH",
    imgUrl: "/assets/images/products/Rectangle 134 (1).png",
    productUrl: "/product/34543543",
  },
  {
    title: "DRONES",
    imgUrl: "/assets/images/products/Rectangle 137.png",
    productUrl: "/product/34543543",
  },
  {
    title: "PHONES",
    imgUrl: "/assets/images/products/Rectangle 134.png",
    productUrl: "/product/34543543",
  },
];

export default Section6;
