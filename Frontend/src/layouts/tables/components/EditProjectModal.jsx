/* eslint-disable react/prop-types */
import React from "react";
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

const EditProjectModal = ({ open, onClose, project, onChange, onUpdate }) => {
  const handleSave = async () => {
    const confirm = await Swal.fire({
      title: "Simpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      onUpdate();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent dividers>
        {["name", "budget", "status", "completion"].map((field) => (
          <TextField
            key={field}
            label={field.replace("_", " ").toUpperCase()}
            name={field}
            fullWidth
            margin="dense"
            value={project[field] || ""}
            onChange={onChange}
          />
        ))}

        <Box mt={2}>
          <Button variant="outlined" component="label" color="primary">
            📤 Ganti Gambar
            <input type="file" name="image" accept="image/*" hidden onChange={onChange} />
          </Button>
          {(project.image || project.img) && (
            <Box mt={1} sx={{ fontSize: "0.9rem", color: "gray" }}>
              📁 {project.image?.name || "Gambar sudah ada"}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Batal
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Simpan Perubahan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;
