import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledBlog = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
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
      <StyledBlog>
          <iframe src='https://blog.ravencoin.email/' width='100%' height='700'></iframe>
      </StyledBlog>
    </Layout>
  );
}

export default Community;
