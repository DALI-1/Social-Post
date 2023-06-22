import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import CountUp from 'react-countup';
import MainCard from "./cards/MainCard"
import { Avatar } from "@nextui-org/react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import CommenetIMG from "../../Assets/InsightsIcons/CommentIcon.png"
import ShareIMG from "../../Assets/InsightsIcons/ShareIcon.png"
import LikeIMG from "../../Assets/InsightsIcons/LikeIcon.png"

import CommenetIMG2 from "../../Assets/InsightsIcons/Comment2.png"
import ShareIMG2 from "../../Assets/InsightsIcons/Share2.png"
import LikeIMG2 from "../../Assets/InsightsIcons/Like2.png"
const StatsComponent = ({ label,Count,type, color }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
        <MainCard >
          
          <Container>
            <Row>
                <Col>
                {(type=="Comment"&& color=="Blue")&&<Avatar size="xl"  style={{margin:"0.5rem"}} src={CommenetIMG} color="primary" zoomed/>}
                {(type=="Like"&&color=="Blue")&&<Avatar size="xl"  style={{margin:"0.5rem"}} src={LikeIMG} color="primary" zoomed/>}
                {(type=="Share"&&color=="Blue")&&<Avatar size="xl"  style={{margin:"0.5rem"}} src={ShareIMG} color="primary" zoomed/>}

                {(type=="Comment"&& color=="Green")&&<Avatar size="xl"  style={{margin:"0.5rem"}} src={CommenetIMG2} color="primary" zoomed/>}
                {(type=="Like"&&color=="Green")&&<Avatar size="xl"  style={{margin:"0.5rem"}} src={LikeIMG2} color="primary" zoomed/>}
                {(type=="Share"&&color=="Green")&&<Avatar size="xl"  style={{margin:"0.5rem"}} src={ShareIMG2} color="primary" zoomed/>}
                </Col>
                <Col>
                <Typography variant="h6" gutter>
              {label}
            </Typography>
                </Col>
            </Row>
           <div style={{display:"flex",justifyContent: "center",alignItems: "center"}}>
           <Typography variant="h3">
              <CountUp  start={0} end={animated ? Count : 0} duration={4} />
            </Typography>
           </div>
          </Container>

          
        </MainCard>

  );
};

export default StatsComponent;