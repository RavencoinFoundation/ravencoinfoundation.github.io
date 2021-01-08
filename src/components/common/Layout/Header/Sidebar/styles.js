import styled from "styled-components";
import theme from "../../../../../utils/theme";

export const Wrapper = styled.div`
  position: fixed;
  z-index: 4;
  overflow: auto;
  top: 0px;
  right: -275px;
  width: 0;
  opacity: 0;
  height: 100%;
  background-color: ${theme.colors.primary};
  transition: all 350ms cubic-bezier(0.6, 0.05, 0.28, 0.91);

  ${({ active }) =>
    active &&
    `
			width: 20%;
			right: 0px;
			opacity: 1;

			@media (max-width: ${theme.screens.laptop}) {
				width: 40%;
			}

			@media (max-width: ${theme.screens.tablet}) {
				width: 75%;
			}
	`}
`;
