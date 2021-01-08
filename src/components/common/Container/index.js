import styled from "styled-components";
import theme from "../../../utils/theme";

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  width: 90%;

  @media (min-width: ${theme.screens.tablet}) {
    width: 90%;
  }

  @media (min-width: ${theme.screens.laptop}) {
    width: 80%;
  }
`;
