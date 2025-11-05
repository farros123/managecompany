import React, { useState } from "react";
import { Card, TextField, Button, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: data.message || "Email atau password salah",
        });
        setLoading(false);
        return;
      }

      // Simpan data login ke localStorage
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.setItem("token", data.token || "dummy-token");

      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat datang di dashboard",
        timer: 1500,
        showConfirmButton: false,
      });

      // Arahkan ke dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Login Error:", err);
      Swal.fire("Error", "Terjadi kesalahan server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "#f0f2f5" }}
    >
      <Card sx={{ p: 4, width: 400, textAlign: "center" }}>
        <Typography variant="h5" mb={3}>
          Admin Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Memproses..." : "Login"}
          </Button>
        </form>
      </Card>
    </Box>
  );
}
