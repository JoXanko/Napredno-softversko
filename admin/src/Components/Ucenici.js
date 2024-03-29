import React, { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { ButtonGroup, Typography, TextField, Box } from "@mui/material";
import { api } from "../App";

export default function Ucenici() {
  const [ucenici, setUcenici] = useState([]);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [filtrirano, setFiltrirano] = useState([]);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleReset = async (idUcenika) => {
    await fetch(api + `user/` + idUcenika.id, {
      method: "DELETE",
      withCredentials: true,
    }).then((response) => {
      return response.json();
    });
    setRefresh(true);
  };

  useEffect(() => {
    fetch(api + `user/getStudents`, {
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        setUcenici(actualData);
        setFiltrirano(actualData);
      });
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    let temp = [];
    ucenici.forEach((tutor) => {
      if (tutor.name.includes(filter) || tutor.surname.includes(filter)) {
        temp.push(tutor);
      }
    });
    setFiltrirano(temp);
  }, [filter]);

  return (
    <Grid container overflow={"scroll"}>
      <Grid item md={12} padding={"1rem"}>
        <Box width={"30%"}>
          <Typography variant={"h4"} sx={{ mb: "1rem" }}>
            Pregled ucenika
          </Typography>
          <Typography>Pretraga po imenu i prezimenu</Typography>
          <TextField
            variant={"outlined"}
            value={filter}
            onChange={handleFilter}
            fullWidth
          />
        </Box>
      </Grid>
      <Grid item md={12} padding={"1rem"}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Fotografija</TableCell>
                <TableCell>ID korisnika</TableCell>
                <TableCell>Ime</TableCell>
                <TableCell>Prezime</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrirano.map((row) => (
                <TableRow
                  hover={true}
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Avatar src={row.imageUrl} />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.surname}</TableCell>
                  <TableCell align={"right"}>
                    <ButtonGroup>
                      <Button
                        color={"error"}
                        onClick={(event) => handleReset(row)}
                      >
                        Obriši korisnika
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
