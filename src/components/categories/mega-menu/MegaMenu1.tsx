import Box from "../../Box";
import Card from "../../Card";
import FlexBox from "../../FlexBox";
import Grid from "../../grid/Grid";
import Image from "../../Image";
import LazyImage from "../../LazyImage";
import NavLink from "../../nav-link/NavLink";
import { SemiSpan } from "../../Typography";
import React from "react";
import { StyledMegaMenu1 } from "./MegaMenuStyle";

interface Image {
  imgUrl: string;
  href: string;
}

interface SubCategory {
  title: string;
  href: string;
}

interface Category {
  title: string;
  href?: string;
  subCategories: SubCategory[];
}

interface MegaMenu {
  categories: Category[];
  rightImage?: Image;
  bottomImage?: Image;
}

interface MegaMenuProps {
  data: MegaMenu;
  minWidth?: string;
}

const MegaMenu1: React.FC<MegaMenuProps> = ({
  data: { categories, rightImage, bottomImage },
  minWidth,
}) => {
  return categories ? (
    <StyledMegaMenu1 className="mega-menu">
      <Card ml="1rem" minWidth={minWidth} boxShadow="regular">
        <FlexBox px="1.25rem" py="0.875rem">
          <Box flex="1 1 0">
            <Grid container spacing={4}>
              {categories?.map((item, ind) => (
                <Grid item md={3} key={ind}>
                  {item.href ? (
                    <NavLink className="title-link" href={item.href}>
                      {item.title}
                    </NavLink>
                  ) : (
                    <SemiSpan className="title-link">{item.title}</SemiSpan>
                  )}
                  {item.subCategories?.map((sub) => (
                    <NavLink className="child-link" href={sub.href}>
                      {sub.title}
                    </NavLink>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Box>

          {rightImage && (
            <a href={rightImage.href}>
              <Box position="relative" width="153px" height="100%">
                <LazyImage
                  src={rightImage.imgUrl}
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
            </a>
          )}
        </FlexBox>

        {bottomImage && (
          <a href={bottomImage.href}>
            <Box position="relative" height="170px">
              <LazyImage
                src={bottomImage.imgUrl}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          </a>
        )}
      </Card>
    </StyledMegaMenu1>
  ) : null;
};

MegaMenu1.defaultProps = {
  minWidth: "760px",
};

export default MegaMenu1;
