import { React, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

//--Material UI imports--
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { FormControlLabel, Radio } from "@mui/material";
import { ControlledAccordions } from "../elements/ControlledAccordions";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../App";

import { ColorButton } from "./Theme";
import ResponsiveAppBar from "../elements/ResponsiveAppBar";
import Futer from "../elements/Footer";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const UserPretraga = () => {
  let userLogged = localStorage.getItem("user");
  const [user, setUser] = useState({});
  const [niz1, setNiz1] = useState([]);
  const [niz2, setNiz2] = useState([]);
  const [oblast, setOblast] = useState({});
  const [grad, setGrad] = useState({});
  const [nivo, setNivo] = useState("");
  const [usluge, setUsluge] = useState([]);

  const klikPretraga = () => {
    if (grad !== "" && oblast !== "" && nivo !== "") {
      fetch(api + `class/classesSearch/` + grad.id + "/" + oblast.id)
        .then((response) => {
          return response.json();
        })
        .then((actualData) => {
          if (actualData.length === 0)
            toast.error("Nema dostupnih usluga za date parametre!");
          setUsluge(actualData);
        });
    } else toast.warn("Unesite sve potrebne parametre!");
  };

  useEffect(() => {
    const obj = JSON.parse(userLogged);
    setUser(obj);
    const getGradovi = async () => {
      if (nivo != "") {
        fetch(api + `category/` + nivo)
          .then((response) => {
            return response.json();
          })
          .then((actualData) => setNiz1(actualData));
      }
      fetch(api + `location`, {
        method: "GET",
        withCredentials: true,
      })
        .then((response) => {
          return response.json();
        })
        .then((actualData) => setNiz2(actualData));
    };
    getGradovi();
  }, [nivo]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <ResponsiveAppBar user={user} />
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mt="1rem"
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="600"
            borderBottom="2px solid gray"
          >
            Pretraga usluga
          </Typography>
        </Box>
        <Grid
          item
          container
          xs={12}
          sm={12}
          md={8}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          component={Paper}
          padding={"0.5rem"}
          elevation={10}
          sx={{ marginTop: "2rem", marginBottom: "1rem" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-evenly"
            mb="1rem"
            mt="1rem"
          >
            <Typography
              variant="h6"
              color="text.secondary"
              marginBottom={"1rem"}
            >
              Stepen obrazovanja
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <FormControlLabel
                value="nivoOsnovne"
                control={
                  <Radio
                    onChange={(event) => {
                      setOblast("");
                      setNivo("1");
                    }}
                    checked={nivo === "1"}
                  />
                }
                label="Nivo osnovne škole"
              />
              <FormControlLabel
                value="nivoSrednje"
                control={
                  <Radio
                    onChange={(event) => {
                      setOblast("");
                      setNivo("2");
                    }}
                    checked={nivo === "2"}
                  />
                }
                label="Nivo srednje škole"
              />
              <FormControlLabel
                value="nivoFakulteta"
                control={
                  <Radio
                    onChange={(event) => {
                      setOblast("");
                      setNivo("3");
                    }}
                    checked={nivo === "3"}
                  />
                }
                label="Nivo fakulteta"
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-evenly"
          >
            <Box sx={{ mx: 2 }} width="40%">
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel id="demo-simple-select-label">Oblast</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Oblast"
                  renderValue={(value) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip key={value} label={value} />
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {niz1.map((oblast) => (
                    <MenuItem
                      key={oblast.id}
                      value={oblast.name}
                      onClick={(e) => setOblast(oblast)}
                    >
                      {oblast.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ my: 5, mx: 3 }} width="40%">
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel id="demo-simple-select-label">Lokacija</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Lokacija"
                  renderValue={(value) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip key={value} label={value} />
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {niz2.map((grad) => (
                    <MenuItem
                      key={grad.id}
                      value={grad.name}
                      onClick={(e) => setGrad(grad)}
                    >
                      {grad.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          display="flex"
          justifyContent="center"
          flexDirection="column"
          sx={{ marginTop: "0.2rem", width: 300 }}
        >
          <ColorButton
            fullWidth
            onClick={klikPretraga}
            sx={{ marginTop: "0.2rem", marginBottom: "1rem" }}
            startIcon={<SearchIcon />}
          >
            Pretraga
          </ColorButton>
        </Grid>
      </Grid>

      <Grid container justifyContent={"space-around"} mb="1rem">
        <ControlledAccordions usluge={usluge} />
      </Grid>
      <ToastContainer
        theme="colored"
        position="top-center"
        hideProgressBar={true}
        newestOnTop
      />
      <Futer />
    </div>
  );
};

export default UserPretraga;
