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
    .subheader {
      font-size: 1.2rem;
      margin-bottom: 1vh;
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
            <p className="coming-soon">Helping Ravencoin soar.</p>
            <p className="subheader">
              The Ravencoin Foundation is not Ravencoin. Ravencoin is <a href='https://github.com/RavenProject/Ravencoin'> open-source software</a> that volunteers run to create a network of nodes that constructs a massively replicated blockchain-based ledger for RVN, and for any other asset tokens that get created by the network users.</p>
            <p className="subheader">
              The Ravencoin Foundation is a non-profit organization that endeavors to assist and protect the Ravencoin open-source project. It also provides a legal entity that can hold and distribute development funds, apply for signing keys and certificates, hold App Store accounts, run Ravencoin explorers, run seed nodes, connect community members, and communicate a shared vision for the project.</p>
            <p className="subheader">
              Donate: <strong>RVM93VRB9jn6FXps9mMu4iftxt7BpGexGM</strong></p>

          </section>
          <section className="resources">
            <h2>Resources</h2>
            <ul>

              <li>
                <Link to="/stablecoin_proposals"> Stablecoin Proposals </Link>
              </li>              
              <li>
                <Link to="/proposals"> Ravencoin Development Proposals w/Bounties </Link>
              </li>
              <li>
                <Link to="/proposal_desc"> Proposal Descriptions </Link>
              </li>              
              <li>
                <Link to="/accounting"> Accounting </Link>
              </li>
              <li>
                <Link to="/getupdates"> Get Ravencoin and Foundation Updates (by e-mail) </Link>
              </li>
              <li>
                <Link to="/blog"> View updates (blog) </Link>
              </li>              
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
