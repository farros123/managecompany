/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

export default function useUsersTableData(onEdit, refreshUsers) {
  const [rows, setRows] = useState([]);

  // 🔄 Ambil data user
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users");
      if (!res.ok) throw new Error("Gagal mengambil data user");

      const users = await res.json();

      const formatted = users.map((user) => ({
        author: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar
              src={`https://i.pravatar.cc/150?u=${user.email}`}
              name={user.name}
              size="sm"
            />
            <MDBox ml={2} lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                {user.name}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {user.email}
              </MDTypography>
            </MDBox>
          </MDBox>
        ),

        job_title: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.job_title || "—"}
          </MDTypography>
        ),

        department: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.department || "—"}
          </MDTypography>
        ),

        status: (
          <MDTypography
            variant="caption"
            color={user.status === "online" ? "success" : "secondary"}
            fontWeight="medium"
          >
            {user.status || "—"}
          </MDTypography>
        ),

        employed: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
          </MDTypography>
        ),

        // ✅ Tombol Aksi: Edit + Hapus
        action: (
          <MDBox display="flex" gap={2} justifyContent="center">
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="info"
              fontWeight="medium"
              sx={{ cursor: "pointer" }}
              onClick={() => onEdit(user)}
            >
              Edit
            </MDTypography>

            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="error"
              fontWeight="medium"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDeleteUser(user.id)}
            >
              Delete
            </MDTypography>
          </MDBox>
        ),
      }));

      setRows(formatted);
    } catch (err) {
      console.error("🚨 Gagal fetch data:", err);
      Swal.fire("Error", "Gagal mengambil data user", "error");
    }
  };

  // ✅ Fungsi DELETE user (pakai SweetAlert)
  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus user?",
      text: "Data user ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus user");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil dihapus.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchUsers(); // 🔁 refresh data
    } catch (err) {
      console.error("❌ Error hapus user:", err);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus user", "error");
    }
  };

  // 🔄 Ambil data setiap kali refreshUsers berubah
  useEffect(() => {
    fetchUsers();
  }, [refreshUsers]);

  return {
    columns: [
      { Header: "Author", accessor: "author", width: "30%", align: "left" },
      { Header: "Job Title", accessor: "job_title", align: "left" },
      { Header: "Department", accessor: "department", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Employed", accessor: "employed", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows,
  };
}
