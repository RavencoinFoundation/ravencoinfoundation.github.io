import React from "react";
import Layout from "../components/common/Layout";
import { Container } from "../components/common/Container";
import styled from "styled-components";
import theme from "../utils/theme";

const StyledWhitepaper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 50vh;
  @media (min-width: ${theme.screens.tablet}) {
  }
  @media (min-width: ${theme.screens.laptop}) {
    .under-construction {
      font-size: 4vh;
    }
  }
`;
function Whitepaper() {
  return (
    <Layout>
      <StyledWhitepaper>
        <Container>
          <h2 className="under-construction">
            Whitepaper page is under construction.
          </h2>
        </Container>
      </StyledWhitepaper>
    </Layout>
  );
}

Whitepaper.propTypes = {};

export default Whitepaper;
