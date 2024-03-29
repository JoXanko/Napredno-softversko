import React, { useEffect, useState } from "react";

import undf from "../assets/undefined.jpg";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import slikaUsluga from "../assets/slikaUsluga.jpg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Rating,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";

import { app } from "../App.js";
import ProfileBadge from "./ProfileBadge.js";

export const ControlledAccordions = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [niz, setNiz] = useState([]);
  const [sortValue, setSortValue] = useState("");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleEvent = (event) => {
    let temp = props.usluge;
    if (event.target.value === "Najbolje ocenjen") {
      temp.sort((a, b) => b.avgGrade - a.avgGrade);
    } else if (event.target.value === "Najvise ocena") {
      temp.sort((a, b) => b.numberOfGrades - a.numberOfGrades);
    }

    setNiz(temp);
    setSortValue(event.target.value);
  };

  useEffect(() => {
    let temp = props.usluge;
    setNiz(temp);
  }, [props.usluge]);

  return (
    <Grid item sm={12} md={11}>
      {props.usluge.length != 0 ? (
        <Grid container margin={"1rem"}>
          <Grid item xs={12}>
            <Typography borderBottom="solid gray 1px" variant="h4">
              Pretrazene usluge
            </Typography>
          </Grid>
          <Grid item xs={11} sm={11} md={4} marginTop="2rem">
            <FormControl fullWidth sx={{ backgroundColor: "white" }}>
              <InputLabel id="demo-simple-select-label">Sortiranje</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Sortiranje"
                onChange={(event) => handleEvent(event)}
                renderValue={(value) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    <Chip key={value} label={value} />
                  </Box>
                )}
              >
                <MenuItem value={"Najbolje ocenjen"}>Najbolje ocenjen</MenuItem>
                <MenuItem value={"Najvise ocena"}>Najviše ocena</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ) : null}
      {niz.map((usluga) => {
        return (
          <Accordion
            key={usluga.id}
            expanded={expanded === "panel" + niz.indexOf(usluga)}
            onChange={handleChange("panel" + niz.indexOf(usluga))}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={"panel" + niz.indexOf(usluga) + "bh-content"}
              id={"panel" + niz.indexOf(usluga) + "bh-header"}
            >
              <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
                <Box
                  height="150px"
                  minWidth="300px"
                  display={"flex"}
                  justifyContent={"center"}
                  style={{ backgroundColor: "lightGray", marginRight: "2rem" }}
                >
                  {usluga.photo ? (
                    <img src={usluga.photo} height="150px" />
                  ) : (
                    <img src={slikaUsluga} height="150px" />
                  )}
                </Box>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"space-evenly"}
                >
                  <Typography
                    sx={{ flexShrink: 0 }}
                    component="h3"
                    fontWeight="500"
                    variant="h6"
                    style={{ marginRight: "2rem" }}
                  >
                    Naslov: {usluga.name}
                  </Typography>
                  <Typography
                    style={{ display: "flex", alignItems: "center" }}
                    color="primary"
                    component="h1"
                    fontWeight="500"
                    variant="h6"
                  >
                    Prosečna ocena:
                    <Rating
                      name="read-only"
                      precision={0.1}
                      value={usluga.avgGrade}
                      readOnly
                      sx={{ marginLeft: "0.5rem", marginRight: "1rem" }}
                    />
                    Od {usluga.numberOfGrades} ocena
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                varian="h6"
                marginBottom="2rem"
                borderBottom="1px solid gray"
              >
                {usluga.bio}
              </Typography>
              <Typography varian="h6" fontWeight="600">
                Tutor ove usluge je:
              </Typography>
              <ProfileBadge tutor={usluga.user} />

              <Rating
                name="read-only"
                precision={0.5}
                value={usluga.avgGrade}
                readOnly
                sx={{ ml: 2 }}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Grid>
  );
};
