import React from "react";
import PropTypes from "prop-types";
import GlobalStyle from "./globalStyle";
import Header from "./Header";
import "./fonts.css";
import Footer from "./Footer";
import styled from "styled-components";

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main#content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
  }

  footer {
    flex-shrink: 0;
  }
`;

export default function Layout({ children }) {
  return (
    <StyledLayout>
      <GlobalStyle />
      <Header />
      <main id="content">{children}</main>
      <Footer />
    </StyledLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
