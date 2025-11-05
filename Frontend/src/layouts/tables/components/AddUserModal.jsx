/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";

const AddUserModal = ({ open, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job_title: "",
    department: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) {
      Swal.fire("Peringatan", "Nama dan email wajib diisi", "warning");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menambahkan user");

      Swal.fire("Berhasil!", "User berhasil ditambahkan", "success");
      onUserAdded?.();
      onClose();
      setFormData({ name: "", email: "", job_title: "", department: "", status: "" });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tambah User Baru</DialogTitle>
      <DialogContent dividers>
        {["name", "email", "job_title", "department", "status"].map((field) => (
          <TextField
            key={field}
            label={field.replace("_", " ").toUpperCase()}
            name={field}
            fullWidth
            margin="dense"
            value={formData[field]}
            onChange={handleChange}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Batal
        </Button>
        <Button onClick={handleAddUser} color="primary" variant="contained">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
