import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import meetupimg from "../images/RavencoinMeetupAtSea2022.png";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledMeetup = styled.div`
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

function Meetup() {
  return (
    <Layout>
      <StyledMeetup>
        <Container>
          <h2>
            Ravencoin Meetup 2022
          </h2>

            <p>
            I don&apos;t know <strong>WHY</strong> Ravencoin attracts the best people in the world.  I only know that it <strong>DOES</strong>.
            </p>

            <p>
            It&apos;s time to get together to discuss, collaborate, and celebrate Ravencoin.
            </p>

            <p>
            <strong>Where:</strong> Aboard the <a href='https://www.royalcaribbean.com/cruise-ships/symphony-of-the-seas'>Royal Caribbean Symphony of the Seas</a><br />
            <strong>When:</strong> Nov 5, 2022 - Nov 12, 2022<br />
            <strong>Who:</strong> The Ravencoin community.  That is you.<br />
            <strong>How:<strong> Book directly with <a='https://www.royalcaribbean.com/booking/landing?groupId=SY07MIA-1110323326&sailDate=2022-11-05&shipCode=SY&packageCode=SY07E306&destinationCode=CARIB&selectedCurrencyCode=USD&country=USA'>Royal Caribbean</a>, or with Sandy Dawkins (see below).  Optional: Check the discount price through <a href='https://www.vacationstogo.com/login.cfm?deal=35983'>Vacations To Go</a>.<br />
            </p>    

            <p>
            These massive cruise ships have <a href='https://www.royalcaribbean.com/booked/cruise-ship-wifi'>internet available</a> and are perfect for remote work, or just relax and join the on-board activities.  This is aboard an <a href='https://www.royalcaribbean.com/cruise-ships/largest-ships-oasis-class'>Oasis Class Ship</a> and is one of the largest cruise ships. If our event is large enough, we can get additional support from the cruise line. 
            </p>

            
            <p>
            <img src={meetupimg}></img>
            </p>



        </Container>
      </StyledMeetup>
    </Layout>
  );
}

export default Meetup;
