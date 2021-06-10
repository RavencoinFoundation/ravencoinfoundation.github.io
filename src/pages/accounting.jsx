import React from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledAccounting = styled.div`
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

function Accounting() {
  return (
    <Layout>
      <StyledAccounting>
          <iframe src='https://docs.google.com/spreadsheets/d/1c3YRgO0MrbaTBy8N81C2s0MJveJz8YdnnVId6BpBt6Y' width='100%' height='700'></iframe>
      </StyledAccounting>
    </Layout>
  );
}

export default Accounting;
