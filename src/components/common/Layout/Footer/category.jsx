import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import theme from "../../../../utils/theme";

const StyledCategory = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
    font-weight: bold;
    font-size: 1.1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      text-align: center;
      a {
        color: ${theme.colors.white};
        opacity: 0.6;
        text-decoration: none;
      }
    }
  }
`;

function Category({ category, links }) {
  return (
    <StyledCategory>
      <h3>{category}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.text}>
            <a target="_blank" rel="noreferrer" href={link.link}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </StyledCategory>
  );
}

Category.propTypes = {
  category: PropTypes.string.isRequired,
  links: PropTypes.array,
};

export default Category;
