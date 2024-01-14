import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import React from "react";
import { Grid, Typography } from "@mui/material";
import { api } from "../App";
import { Chart as ChartJS } from "chart.js/auto";

export default function GlavniPrikaz() {
  const [users, setUsers] = useState({});
  const [dataKategorije, setDatakategorije] = useState({
    labels: [],
    datasets: [
      {
        backgroundColor: ["rgba(0,10,220,0.5)"],
        label: "Po kategoriji",
        data: [],
      },
    ],
  });

  const [dataLokacije, setDataLokacije] = useState({
    labels: [],
    datasets: [
      {
        backgroundColor: "rgba(220,0,10,0.5)",
        label: "Po lokaciji",
        data: [],
      },
    ],
  });

  const vratiData = async () => {
    let data = {
      labels: [],
      datasets: [
        {
          backgroundColor: ["rgba(0,10,220,0.5)"],
          label: "Po kategoriji",
          data: [],
        },
      ],
    };

    let classes;
    await fetch(api + `category`, {
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        actualData.forEach((kategorija) => {
          data.labels.push(kategorija.name);
        });
      });

    await fetch(api + `class`, {
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        return response.json();
      })
      .then((actualData) => (classes = actualData));

    data.labels.forEach((value, index) => {
      let counter = 0;
      classes.forEach((cls) => {
        if (cls.category.name == value) counter++;
      });
      data.datasets[0].data.splice(index, 0, counter);
      counter = 0;
    });
    setDatakategorije(data);

    let dataLoc = {
      labels: [],
      datasets: [
        {
          backgroundColor: "rgba(220,0,10,0.5)",
          label: "Po lokaciji",
          data: [],
        },
      ],
    };

    await fetch(api + `location`, {
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        actualData.forEach((lokacija) => {
          dataLoc.labels.push(lokacija.name);
        });
      });

    dataLoc.labels.forEach((value, index) => {
      let counter = 0;
      classes.forEach((cls) => {
        if (cls.location.name == value) counter++;
      });
      dataLoc.datasets[0].data.splice(index, 0, counter);
      counter = 0;
    });
    setDataLokacije(dataLoc);
  };

  const vratiBrojeve = async () => {
    await fetch(api + `user/getByRole`, {
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        return response.json();
      })
      .then((actualData) => setUsers(actualData));
  };

  useEffect(() => {
    vratiData();
    vratiBrojeve();
  }, []);

  return (
    <Grid container sx={{ height: "100%" }}>
      <Grid item xs={12} padding={"1rem"} sx={{ height: "40%" }}>
        <Typography variant={"h4"} sx={{ mb: "1rem" }}>
          Broj tutora na platformi : {users.tutors}
        </Typography>
        <Typography variant={"h4"} sx={{ mb: "1rem" }}>
          Broj ucenika na platformi : {users.students}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Bar data={dataKategorije} />
      </Grid>
      <Grid item xs={6}>
        <Bar data={dataLokacije} />
      </Grid>
    </Grid>
  );
}
