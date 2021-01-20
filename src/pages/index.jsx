import * as React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import ravenIcon from "../images/raven-icon.svg";
import theme from "../utils/theme";
import landingBgSm from "../images/landing-sm.png";
import landingBgLg from "../images/landing-lg.png";
import { Link } from "gatsby";
import { Helmet } from "react-helmet"

const StyledIndexPage = styled.div`
  flex-grow: 1;
  background: radial-gradient(
      158.55% 100.19% at 0% 0%,
      #ffffff 32.29%,
      rgba(255, 255, 255, 0) 79.17%
    ),
    url(${landingBgSm});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  header.brand {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Nimbus Sans, sans-serif;
    text-transform: uppercase;
    text-align: center;
    color: ${theme.colors.grey21};

    margin-top: 10vh;
    margin-bottom: 5vh;

    .icon-wrapper {
      width: 50px;
    }

    .title {
      padding: 0 1rem;
      h1 {
        font-weight: 400;
        font-size: 2.3rem;
        font-size: 4.4vh;
        line-height: 44px;
        letter-spacing: 0.15em;

        span {
          text-align: center;
          display: block;
          font-size: 0.6em;
          line-height: 1.4;
          letter-spacing: 0.5em;
        }
      }
    }
  }

  section.info {
    text-align: center;
    color: ${theme.colors.grey21};
    .community {
      font-size: 1.2rem;
      font-weight: 400;
      margin-bottom: 4.2vh;
    }

    .coming-soon {
      font-size: 1.6rem;
      margin-bottom: 5vh;
    }
  }

  section.resources {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10vh;

    h2 {
      font-weight: 400;
    }

    ul {
      list-style: none;
      padding: 0;
      text-align: center;
      margin: 0;
      li a {
        text-decoration: none;
        color: ${theme.colors.accent};
      }
    }
  }

  @media (min-width: ${theme.screens.tablet}) {
    header.brand {
      margin-top: 7vh;
      padding: 0 1.8rem;

      .icon-wrapper {
        width: 109px;
      }

      .title {
        h1 {
          font-size: 6.3vh;
          line-height: 1.5;
        }
      }
    }

    section.info {
      margin-top: 6vh;
      margin-bottom: 8vh;

      .community {
        max-width: 80%;
        margin: 0 auto;
        font-size: 3vh;
      }

      .coming-soon {
        font-size: 4vh;
        margin-top: 6vh;
      }
    }

    section.resources {
      font-size: 2vh;
    }
  }

  @media (min-width: ${theme.screens.laptop}) {
    background: radial-gradient(
        158.55% 100.19% at 0% 0%,
        #ffffff 32.29%,
        rgba(255, 255, 255, 0) 79.17%
      ),
      url(${landingBgLg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;

    header.brand {
      margin-top: 16vh;
      margin-bottom: 9vh;
    }

    section.resources {
    }
  }
`;

const IndexPage = () => {
  return (
    <Layout>
      <StyledIndexPage>
        <Container>
        <Helmet>
            <title>Ravencoin Foundation</title>
            <meta name="title" content="Ravencoin Foundation" />
            <meta name="description" content="The Ravencoin Foundation supports the Ravencoin project." />
            <meta name="google-site-verification" content="Pacm5C3ahyDFbNKYrhIWMQXNYnGquIYEE0_ma-BuFzg" />
        </Helmet>        
          <header className="brand">
            <div className="icon-wrapper">
              <img src={ravenIcon} alt="Raven silhouette" />
            </div>
            <div className="title">
              <h1>
                Ravencoin <span>Foundation</span>
              </h1>
            </div>
          </header>
          <section className="info">
            <p className="community">
              A new community landing to assist the future of Ravencoin to soar.
            </p>
            <p className="coming-soon">Coming Soon</p>
          </section>
          <section className="resources">
            <h2>Resources</h2>
            <ul>
              <li>
                <Link to="/board-meeting-minutes"> Board Meeting Minutes </Link>
              </li>
              <li>
                <Link to="/code-security-audit"> Code Security Audit </Link>
              </li>
            </ul>
          </section>
        </Container>
      </StyledIndexPage>
    </Layout>
  );
};

export default IndexPage;
