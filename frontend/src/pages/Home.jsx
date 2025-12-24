import { Typography, Container, Box, Grid, Button } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';


import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000/customers";

const Home = () => {
  const [customers, setCustomers] = useState([]);

  const getStatistics = async () => {
    const res = await axios.get(API);
    setCustomers(res.data);
  };

  useEffect(() => {
    getStatistics();
  }, []);

  const countOfUsers = customers.length;


  ///////////

  //

  const calculateStatistics = (customers) => {
    let totalIncome = 0; // uliwma pul
    let totalProfit = 0; // sap payda
    let totalAvans = 0;

    customers.forEach(c => {
      const bahasi = Number(c.bahasi) || 0;
      const avans = Number(c.avans) || 0;
      const procent = Number(c.procent) || 0;

      // procentten keletin payda
      const profit = bahasi * (procent / 100);

      // klient qaytariwi kerek bolgan summa
      const totalPaid = bahasi + profit;

      totalIncome += totalPaid;
      totalProfit += profit;
      totalAvans += avans;
    });

    return {
      totalIncome,
      totalProfit,
      totalAvans
    };
  };

  const { totalIncome, totalProfit, totalAvans } = calculateStatistics(customers);


  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      {/* Video Background */}
      <video
        src={video1}
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <Container
        sx={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          My Business
        </Typography>

        {/* Statistics Grid */}
        <Grid container spacing={3} sx={{ mt: 4, justifyContent: "center" }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(5px)",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h6">Klientler sani</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {countOfUsers}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(5px)",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h6">Jami daramat</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {totalIncome.toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(5px)",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h6">Sap payda</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {(Math.floor(totalProfit)).toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(5px)",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h6">Avanslar</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {totalAvans.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Button
          sx={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            marginTop: "3rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
          }}
        >
          <PersonIcon style={{ color: "#fff", fontSize: "32px" }} />
        </Button>
      </Container>
    </Box>
  );
};

export default Home
