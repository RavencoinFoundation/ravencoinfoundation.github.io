import React from "react";
import styled from "styled-components";
import theme from "../../../../utils/theme";
import { Container } from "../../Container";
import Category from "./category";
import footerCategories from "./footerData.json";
import ravenIconNegative from "../../../../images/raven-icon-negative.svg";

const StyledFooter = styled.footer`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 4vh 0 5vh;
  @media (min-width: ${theme.screens.tablet}) {
    padding: 3.5vh 0 5vh;
  }
`;

const CategoriesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;

  div.image-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    img {
      max-width: 69px;
    }
  }

  @media (min-width: ${theme.screens.tablet}) {
    grid-template-columns: repeat(4, 1fr);

    div.image-wrapper {
      order: -1;
    }
  }

  @media (min-width: ${theme.screens.laptop}) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

function Footer() {
  return (
    <StyledFooter>
      <Container>
        <CategoriesWrapper>
          {Object.entries(footerCategories).map(([category, links]) => (
            <Category key={category} category={category} links={links} />
          ))}
          <div className="image-wrapper">
            <img src={ravenIconNegative} alt="Raven silhouette" />
          </div>
        </CategoriesWrapper>
      </Container>
    </StyledFooter>
  );
}

export default Footer;
