import React, { useState, useEffect } from "react";

//--PNG imports--
import studentImg from "../assets/student.png";
import teacherImg from "../assets/teacher.png";
import logo2 from "../assets/logo2";

//--CSS import--
import "../css/SignUp.css";
import { theme, ColorButton } from "./Theme";

//--Material UI imports--
import Radio from "@mui/material/Radio";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";

import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { api } from "../App";
import useAuth from "../hooks/useAuth";

const ProfileSetup = () => {
  let userLogged = localStorage.getItem("user");
  const [user, setUser] = useState({});
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [tutor, setTutor] = useState(false);
  const navigate = useNavigate();
  const inputIme = (event) => setIme(event.target.value);
  const inputPrezime = (event) => setPrezime(event.target.value);
  const { setAuth } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const setup = async (event) => {
    let role;
    if (tutor) {
      role = "tutor";
    } else {
      role = "student";
    }
    const podaci = {
      name: ime,
      surname: prezime,
      imageUrl: "",
      bio: "",
      role: role,
    };
    console.log(podaci);
    const obj = JSON.parse(userLogged);
    console.log(obj.id);
    await fetch(api + `user/` + obj.id, {
      withCredentials: true,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(podaci),
    })
      .then((response) => {
        console.log("logged in");
        return response.json();
      })
      .then((actualData) => {
        setAuth({});
        let roles = [];
        roles.push(actualData.role);
        const user = [];
        user.push(actualData);
        setAuth({ user, roles });

        localStorage.setItem("user", JSON.stringify(actualData));
        console.log(localStorage.getItem("user"));
        navigate(from, { replace: true });
      });
  };

  const logout = async () => {
    await fetch(api + `auth/logout`, {
      method: "GET",
      withCredentials: true,
    }).then((actualData) => {
      setAuth({});
      localStorage.removeItem("user");
      navigate("/login");
    });
  };

  useEffect(() => {
    const obj = JSON.parse(userLogged);
    setUser(obj);
  }, []);

  return (
    <div>
      {console.log("PROFILESETUP")}
      {console.log(user)}
      {!user ? <Navigate to="/" /> : null}
      <ThemeProvider theme={theme}>
        <Grid
          container
          component="main"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%" }}
        >
          <CssBaseline />

          <Grid
            item
            xs={12}
            sm={8}
            md={4}
            component={Paper}
            elevation={12}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ my: 12, mx: 8 }}
          >
            <Grid item style={{ paddingTop: 16 }}>
              <img src={logo2} height="100px" />
            </Grid>

            <Typography
              color="primary"
              component="h1"
              fontWeight="600"
              variant="h5"
            >
              Podesite svoj profil!
            </Typography>

            <Box className="glavniBox" component="form" noValidate>
              <TextField
                margin="normal"
                required
                onChange={inputIme}
                fullWidth
                label="Ime"
                autoComplete="email"
              />

              <TextField
                margin="normal"
                required
                onChange={inputPrezime}
                fullWidth
                label="Prezime"
              />

              <Box className="avatari">
                <Box className="avatar">
                  <Avatar
                    alt="S"
                    src={studentImg}
                    sx={{ width: 100, height: 100 }}
                  />
                  <FormControlLabel
                    value="ucenik"
                    control={
                      <Radio
                        onChange={(event) => setTutor(false)}
                        checked={!tutor}
                      />
                    }
                    label="Učenik"
                  />
                </Box>

                <Box className="avatar">
                  <Avatar
                    alt="T"
                    src={teacherImg}
                    sx={{ width: 100, height: 100 }}
                  />
                  <FormControlLabel
                    value="tutor"
                    control={
                      <Radio
                        onChange={(event) => setTutor(true)}
                        checked={tutor}
                      />
                    }
                    label="Tutor"
                  />
                </Box>
              </Box>

              <Box style={{}}>
                <ColorButton
                  onClick={setup}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Podesite nalog!
                </ColorButton>
              </Box>

              <Box style={{ marginBottom: 50 }}>
                <ColorButton
                  onClick={logout}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Izlogujte se!
                </ColorButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default ProfileSetup;
