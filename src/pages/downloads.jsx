import React from "react";
import Layout from "../components/common/Layout";
import { Container } from "../components/common/Container";
import styled from "styled-components";
import theme from "../utils/theme";

const StyledDownloads = styled.div`
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

function Downloads() {
  return (
    <Layout>
      <StyledDownloads>
        <Container>
          <h2 className="under-construction">
            Downloads are hosted on Ravencoin.org.
          </h2>
          <a href='https://ravencoin.org/wallet/'>Downloads for Windows, Mac, Linux, iOS, Android</a>
        </Container>
      </StyledDownloads>
    </Layout>
  );
}

Downloads.propTypes = {};

export default Downloads;
