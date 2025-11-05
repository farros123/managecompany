/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";

const EditUserModal = ({ open, onClose, user, onChange, onUpdate }) => {
  const handleSubmit = () => {
    Swal.fire({
      title: "Yakin ingin update user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, update",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) onUpdate();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent dividers>
        {["name", "email", "job_title", "department", "status"].map((field) => (
          <TextField
            key={field}
            label={field.replace("_", " ").toUpperCase()}
            name={field}
            fullWidth
            margin="dense"
            value={user[field] || ""}
            onChange={onChange}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Batal
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Simpan Perubahan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;
