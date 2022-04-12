import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledCommunity = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 50vh;
  font-size: 3vh;
  @media (min-width: ${theme.screens.tablet}) {
  }
  @media (min-width: ${theme.screens.laptop}) {
    .under-construction {
      font-size: 4vh;
    }
  }
`;

function Community() {
  return (
    <Layout>
      <StyledCommunity>
        <iframe src='https://ravencoin.org/community/' width='100%' height='700'></iframe>
      </StyledCommunity>
    </Layout>
  );
}

export default Community;
