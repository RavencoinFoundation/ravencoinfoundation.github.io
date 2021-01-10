import styled from "styled-components";
import theme from "../../../../../utils/theme";

export const Wrapper = styled.div`
  a {
    color: ${theme.colors.white};
    text-decoration: none;

    @media (max-width: ${theme.screens.laptop}) {
      color: "#000";
    }
  }

  ${({ desktop }) =>
    desktop
      ? `
			align-items: center;
			display: flex;

			@media (max-width: ${theme.screens.laptop}) {
					display: none;
			}

			a {
					margin-right: 1rem;

					&:last-child {
							margin-right: unset;
					}
			}
		`
      : `
			padding: 3rem;
			display: flex;
			flex-direction: column;

			a {
					margin-bottom: 1rem;

					&:last-child {
							margin-bottom: unset;
					}
			}
	`}
`;
