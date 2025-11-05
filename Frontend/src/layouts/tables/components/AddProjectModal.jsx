/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";

const AddProjectModal = ({ open = false, onClose, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    status: "",
    completion: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddProject = async () => {
    if (!formData.name || !formData.budget || !formData.status) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Nama, budget, dan status wajib diisi.",
      });
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("budget", formData.budget);
    form.append("status", formData.status);
    form.append("completion", formData.completion || 0);
    if (formData.image) form.append("image", formData.image);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/projects", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menambahkan project");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Project berhasil ditambahkan.",
        timer: 1800,
        showConfirmButton: false,
      });

      onProjectAdded?.();
      onClose();
      setFormData({
        name: "",
        budget: "",
        status: "",
        completion: "",
        image: null,
      });
    } catch (error) {
      console.error("🚨 Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi kesalahan saat menghubungi server.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tambah Project Baru</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Nama Project"
          name="name"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Budget"
          name="budget"
          type="number"
          fullWidth
          margin="dense"
          value={formData.budget}
          onChange={handleChange}
        />
        <TextField
          label="Status"
          name="status"
          fullWidth
          margin="dense"
          value={formData.status}
          onChange={handleChange}
        />
        <TextField
          label="Completion (%)"
          name="completion"
          type="number"
          fullWidth
          margin="dense"
          value={formData.completion}
          onChange={handleChange}
        />

        <Box mt={2}>
          <Button variant="outlined" component="label">
            Upload Gambar
            <input type="file" name="image" accept="image/*" hidden onChange={handleChange} />
          </Button>
          {formData.image && (
            <Box mt={1} sx={{ fontSize: "0.9rem", color: "gray" }}>
              📁 {formData.image.name}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Batal
        </Button>
        <Button onClick={handleAddProject} color="primary" variant="contained">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectModal;
