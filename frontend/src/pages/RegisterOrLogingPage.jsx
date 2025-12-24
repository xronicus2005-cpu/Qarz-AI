import { Box, Container, Button, TextField, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

const PRIMARY_BLUE = "#3b82f6";
const API = "http://127.0.0.1:8000/api/auth";

const RegisterOrLoginPage = () => {
  const [mode, setMode] = useState("login");
  const isRegister = mode === "register";

  const [valueForRegister, setValueForRegister] = useState({
    ati: "",
    familiyasi: "",
    login: "",
    parol: "",
  });

  const [valueForLogin, setValueForLogin] = useState({
    login: "",
    parol: "",
  });

  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const { ati, familiyasi, login, parol } = valueForRegister;

      if (!ati || !familiyasi || !login || !parol) {
        toast.error("Magliwmatlar toliq kiritilmegen");
        return;
      }

      const res = await axios.post(`${API}/register/`, valueForRegister);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Dizimnen otildi");
        navigate("/add")
      }
    } catch(err) {
      toast.error("Registraciyada qatelik");
      console.log(err)
    }
  };

  const handleLogin = async () => {
    try {
      const { login, parol } = valueForLogin;

      if (!login || !parol) {
        toast.error("Login ham parolni kiritin");
        return;
      }

      const res = await axios.post(`${API}/login/`, valueForLogin);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Sistemaga kirdiniz!");
        navigate("/add")
      }
    } catch(err) {
      console.log(err)
      toast.error("Login yamasa parol qate");
    }
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${PRIMARY_BLUE}15, #ffffff)`,
      }}
    >
      {/* FORM BOX */}
      <Box
        sx={{
          position: "relative",
          width: 480,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(59,130,246,0.25)",
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            background: "rgba(255,255,255,0.8)",
            borderRadius: "10px",
            px: 1,
            py: 0.5,
            backdropFilter: "blur(6px)",
          }}
        >
          <Box component="img" src={Logo} sx={{ width: 24 }} />
          <Typography fontSize={12} fontWeight={700}>
            FrontAral
          </Typography>
        </Box>

        {/* FORM */}
        <Box
          sx={{
            p: 2.5,
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(18px)",
            display: "flex",
            flexDirection: "column",
            gap: 0.6,
          }}
        >
          {/* ICON */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: `${PRIMARY_BLUE}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
              }}
            >
              <AccountCircleIcon sx={{ color: PRIMARY_BLUE }} />
            </Box>
          </Box>

          {/* SWITCH */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Button
              fullWidth
              onClick={() => {
                setMode("register");
                setValueForLogin({ login: "", password: "" });
              }}
              sx={{
                borderRadius: "12px",
                background: isRegister ? PRIMARY_BLUE : `${PRIMARY_BLUE}20`,
                color: isRegister ? "#fff" : PRIMARY_BLUE,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Register
            </Button>

            <Button
              fullWidth
              onClick={() => {
                setMode("login");
                setValueForRegister({
                  name: "",
                  lastName: "",
                  login: "",
                  password: "",
                });
              }}
              sx={{
                borderRadius: "12px",
                background: !isRegister ? PRIMARY_BLUE : `${PRIMARY_BLUE}20`,
                color: !isRegister ? "#fff" : PRIMARY_BLUE,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Login
            </Button>
          </Box>

          {/* FORMS */}
          {isRegister ? (
            <>
              <Typography fontSize={11} fontWeight={700}>Ati</Typography>
              <TextField
                size="small"
                value={valueForRegister.ati}
                onChange={(e) =>
                  setValueForRegister({
                    ...valueForRegister,
                    ati: e.target.value,
                  })
                }
              />

              <Typography fontSize={11} fontWeight={700}>Familiyasi</Typography>
              <TextField
                size="small"
                value={valueForRegister.familiyasi}
                onChange={(e) =>
                  setValueForRegister({
                    ...valueForRegister,
                    familiyasi: e.target.value,
                  })
                }
              />

              <Typography fontSize={11} fontWeight={700}>Login</Typography>
              <TextField
                size="small"
                value={valueForRegister.login}
                onChange={(e) =>
                  setValueForRegister({
                    ...valueForRegister,
                    login: e.target.value,
                  })
                }
              />

              <Typography fontSize={11} fontWeight={700}>Parol</Typography>
              <TextField
                type="password"
                size="small"
                value={valueForRegister.parol}
                onChange={(e) =>
                  setValueForRegister({
                    ...valueForRegister,
                    parol: e.target.value,
                  })
                }
              />

              <Button
                onClick={handleRegister}
                sx={{
                  mt: 1,
                  borderRadius: "12px",
                  background: PRIMARY_BLUE,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Jaratiw
              </Button>
            </>
          ) : (
            <>
              <Typography fontSize={11} fontWeight={700}>Login</Typography>
              <TextField
                size="small"
                value={valueForLogin.login}
                onChange={(e) =>
                  setValueForLogin({ ...valueForLogin, login: e.target.value })
                }
              />

              <Typography fontSize={11} fontWeight={700}>Password</Typography>
              <TextField
                type="password"
                size="small"
                value={valueForLogin.parol}
                onChange={(e) =>
                  setValueForLogin({
                    ...valueForLogin,
                    parol: e.target.value,
                  })
                }
              />

              <Button
                onClick={handleLogin}
                sx={{
                  mt: 1,
                  borderRadius: "12px",
                  background: PRIMARY_BLUE,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Kiriw
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterOrLoginPage;