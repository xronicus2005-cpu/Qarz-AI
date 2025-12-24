import { Typography, Container, Box, TextField, Button, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';

import "./Add.css";

const API = "http://localhost:3000/customers";

const Add = () => {

  const emptyForm = {
    familiyasi: "",
    ati: "",
    passport: "",
    telefon: "",
    secondPhone: "",
    email: "",
    tovarAti: "",
    bahasi: "",
    muddet: "",
    avans: "",
    procent: "",
    sane: "",
  };

  const [value, setValue] = useState(emptyForm);
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "bahasi" || name === "avans") {
      setValue((prev) => ({ ...prev, [name]: formatNumber(value) }));
      return;
    }

    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const loadUsers = async () => {
    const res = await axios.get(API);
    setRows(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      ...value,
      bahasi: cleanNumber(value.bahasi),
      avans: cleanNumber(value.avans),
    };

    if (editId) {
      await axios.put(`${API}/${editId}`, payload);
      setEditId(null);
    } else {
      await axios.post(API, payload);
    }

    setValue(emptyForm);
    loadUsers();
  };

  const handleSelect = (row) => {
    setValue(row);
    setEditId(row.id);
  };

  const handleDelete = async (id) => {
    const yes = confirm("Oshiriwdi qaleysizbe?");
    if (yes) {
      await axios.delete(`${API}/${id}`);
    }
    loadUsers();
  };

  const formatNumber = (value) => {
    if (!value) return "";
    const cleaned = value.toString().replace(/\s/g, "");
    if (cleaned === "0") return "-";

    return value.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const cleanNumber = (value) => {
    if (!value) return "";
    return value.toString().replace(/\s/g, "");
  };

  return (
    <Container className="add-container">

      <Typography className="add-title">
        Adam qosiw
      </Typography>

      <Box className="form-wrapper">

        <div className="form-left">
          <p className="form-label">Adam haqqinda magliwmatlar</p>

          <TextField name="familiyasi" value={value.familiyasi} onChange={handleChange} placeholder="Familiyasi" fullWidth size="small" />
          <TextField name="ati" value={value.ati} onChange={handleChange} placeholder="Ati" fullWidth size="small" />
          <TextField name="passport" value={value.passport} onChange={handleChange} placeholder="Passpord/AD" fullWidth size="small" />
          <TextField name="telefon" value={value.telefon} onChange={handleChange} placeholder="Telefon" fullWidth size="small" />
          <TextField name="secondPhone" value={value.secondPhone} onChange={handleChange} placeholder="2-Telefon" fullWidth size="small" />
          <TextField name="email" value={value.email} onChange={handleChange} placeholder="email" fullWidth size="small" />
        </div>

        <div className="form-right">
          <p className="form-label">Tovar haqqinda magliwmatlar</p>

          <TextField name="tovarAti" value={value.tovarAti} onChange={handleChange} placeholder="Tovar ati" fullWidth size="small" />
          <TextField name="bahasi" value={value.bahasi} onChange={handleChange} placeholder="Baxasi" fullWidth size="small"
            InputProps={{ endAdornment: <InputAdornment position="end">uliwma summa</InputAdornment> }} />

          <TextField name="muddet" value={value.muddet} onChange={handleChange} placeholder="Neshe ay" fullWidth size="small"
            InputProps={{ endAdornment: <InputAdornment position="end">ay</InputAdornment> }} />

          <TextField name="avans" value={value.avans} onChange={handleChange} placeholder="Avans" fullWidth size="small"
            InputProps={{ endAdornment: <InputAdornment position="end">avans</InputAdornment> }} />

          <TextField name="procent" value={value.procent} onChange={handleChange} placeholder="Procent" fullWidth size="small"
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />

          <TextField name="sane" type="date" value={value.sane} onChange={handleChange} fullWidth size="small" />
        </div>

      </Box>

      <Button
          fullWidth
          onClick={handleSubmit}
          className={editId ? "btn-edit" : "btn-add"}
          sx={{
            height: "20px",
            fontWeight: "500",
            marginTop: "1rem",
            color: "#fff",
            padding: "1rem",
            backgroundColor: editId ? "orange" : "rgb(13, 109, 204)",
            "&:hover": {
              backgroundColor: editId ? "#cc8400" : "rgb(10, 90, 170)"
            }
          }}
        >
          {editId ? "Ozgertiw" : "Qosiw"}
        </Button>

      <Box className="table-wrapper">
        <Table className="my-table">
          <TableHead>
            <TableRow className="table-head-row">
              <TableCell className="th">Familiyasi</TableCell>
              <TableCell className="th">Ati</TableCell>
              <TableCell className="th">Pasport</TableCell>
              <TableCell className="th">Telefon</TableCell>
              <TableCell className="th">2-Telefon</TableCell>
              <TableCell className="th">Email</TableCell>
              <TableCell className="th">Tovar ati</TableCell>
              <TableCell className="th">Baxasi</TableCell>
              <TableCell className="th">Neshe ay</TableCell>
              <TableCell className="th">Avans</TableCell>
              <TableCell className="th">Procent</TableCell>
              <TableCell className="th">Sane</TableCell>
              <TableCell className="th"></TableCell>
              <TableCell className="th"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="table-row">
                <TableCell>{row.familiyasi}</TableCell>
                <TableCell>{row.ati}</TableCell>
                <TableCell>{row.passport}</TableCell>
                <TableCell>{row.telefon}</TableCell>
                <TableCell>{row.secondPhone}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.tovarAti}</TableCell>
                <TableCell>{formatNumber(row.bahasi)}</TableCell>
                <TableCell>{row.muddet}</TableCell>
                <TableCell>{formatNumber(row.avans)}</TableCell>
                <TableCell>{row.procent}</TableCell>
                <TableCell>{row.sane}</TableCell>

                <TableCell>
                  <Button
                      variant="outlined"
                      size="small"
                      className="btn-edit-icon"
                      onClick={() => handleSelect(row)}
                      sx={{
                        padding: "2px",
                        minWidth: "30px",
                        border: "1px solid #4caf50",
                        "&:hover": {
                          backgroundColor: "#e8f5e9",
                          border: "1px solid #4caf50"
                        }
                      }}
                    >
                      <ModeIcon style={{ color: "#4caf50" }} />
                    </Button>
                </TableCell>

                <TableCell>
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    className="btn-delete-icon"
                    onClick={() => handleDelete(row.id)}
                    sx={{
                      padding: "2px",
                      minWidth: "30px",
                      border: "1px solid #f44336",
                      "&:hover": {
                        backgroundColor: "#ffebee",
                        border: "1px solid #f44336"
                      }
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

    </Container>
  );
};

export default Add;
