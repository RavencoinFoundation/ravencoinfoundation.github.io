import styled from "styled-components";
import theme from "../../../../../utils/theme";

export const Wrapper = styled.div`
  z-index: 5;
  top: 1.6rem;
  right: 1.8rem;
  display: none;
  cursor: pointer;
  transition: left 500ms cubic-bezier(0.6, 0.05, 0.28, 0.91);
  position: absolute;

  @media (max-width: ${theme.screens.laptop}) {
    display: block;
  }

  ${({ sidebar }) =>
    sidebar &&
    `
			right: 18%;
			top: 1.4rem;
		
			@media (max-width: ${theme.screens.laptop}) {
				right: 35%;
				position: fixed;
			}
		
			@media (max-width: ${theme.screens.tablet}) {
				right: 66%;
			}
	`}
`;

export const Bar = styled.div`
  width: 1.6rem;
  height: 0.15rem;
  margin-bottom: 0.3rem;
  background-color: ${theme.colors.white};
  transition: transform 500ms cubic-bezier(0.6, 0.05, 0.28, 0.91), opacity 500ms,
    box-shadow 250ms, background-color 500ms;

  @media (max-width: ${theme.screens.tablet}) {
    width: 1.6rem;
  }

  ${({ top, sidebar }) =>
    top &&
    sidebar &&
    `
		background-color: '#212121';
		transform: translateY(8px) rotate(-135deg);
		
	`}

  ${({ mid, sidebar }) =>
    mid &&
    sidebar &&
    `
		transform: scale(0);
		`}

	${({ bottom, sidebar }) =>
    bottom &&
    sidebar &&
    `
			background-color: '#212121';
			transform: translateY(-6px) rotate(-45deg);
	`}
`;
