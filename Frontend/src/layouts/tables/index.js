/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Grid, Card, Button } from "@mui/material";
import Swal from "sweetalert2";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import EditProjectModal from "layouts/tables/components/EditProjectModal";
import AddProjectModal from "layouts/tables/components/AddProjectModal";
import EditUserModal from "layouts/tables/components/EditUserModal";
import AddUserModal from "layouts/tables/components/AddUserModal";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import useProjectsTableData from "layouts/tables/data/projectsTableData";
import useUsersTableData from "layouts/tables/data/usersTableData";

function Tables() {
  // ========= 💼 PROJECTS =========
  const [openAddProject, setOpenAddProject] = useState(false);
  const [openEditProject, setOpenEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshProjects, setRefreshProjects] = useState(false);

  const handleOpenEditProject = (project) => {
    setSelectedProject(project);
    setOpenEditProject(true);
  };

  const handleCloseEditProject = () => {
    setSelectedProject(null);
    setOpenEditProject(false);
  };

  const handleProjectAdded = () => setRefreshProjects((p) => !p);

  const handleDeleteProject = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data project ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus project");

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Project berhasil dihapus!",
        timer: 1500,
        showConfirmButton: false,
      });

      setRefreshProjects((p) => !p);
    } catch (err) {
      console.error("❌ Error saat hapus:", err);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus project", "error");
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject?.id) {
      return Swal.fire("Error", "Project tidak valid!", "error");
    }

    const data = new FormData();
    data.append("name", selectedProject.name || "");
    data.append("budget", selectedProject.budget || "");
    data.append("status", selectedProject.status || "");
    data.append("completion", selectedProject.completion || 0);
    if (selectedProject.image instanceof File) data.append("image", selectedProject.image);
    data.append("_method", "PUT");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/projects/${selectedProject.id}`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Gagal update project");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Project berhasil diperbarui!",
        timer: 1500,
        showConfirmButton: false,
      });

      handleCloseEditProject();
      setRefreshProjects((p) => !p);
    } catch (err) {
      console.error("❌ Error update project:", err);
      Swal.fire("Error", "Terjadi kesalahan saat update project", "error");
    }
  };

  const { columns: pColumns, rows: pRows } = useProjectsTableData(
    handleOpenEditProject,
    handleDeleteProject,
    refreshProjects
  );

  // ========= 👥 USERS =========
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshUsers, setRefreshUsers] = useState(false);

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setOpenEditUser(true);
  };

  const handleCloseEditUser = () => {
    setSelectedUser(null);
    setOpenEditUser(false);
  };

  const handleUserAdded = () => setRefreshUsers((p) => !p);

  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data user ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus user");

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "User berhasil dihapus!",
        timer: 1500,
        showConfirmButton: false,
      });

      setRefreshUsers((p) => !p);
    } catch (err) {
      console.error("❌ Error saat hapus:", err);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus user", "error");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser?.id) {
      return Swal.fire("Error", "User tidak valid!", "error");
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      });

      if (!res.ok) throw new Error("Gagal update user");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil diperbarui!",
        timer: 1500,
        showConfirmButton: false,
      });

      handleCloseEditUser();
      setRefreshUsers((p) => !p);
    } catch (err) {
      console.error("❌ Error update user:", err);
      Swal.fire("Error", "Terjadi kesalahan saat update user", "error");
    }
  };

  const { columns: uColumns, rows: uRows } = useUsersTableData(
    handleOpenEditUser,
    handleDeleteUser,
    refreshUsers
  );

  // ========= RETURN UI =========
  return (
    <>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* 💼 PROJECTS TABLE */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
                <Button variant="contained" color="info" onClick={() => setOpenAddProject(true)}>
                  + Add Project
                </Button>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>

          {/* 👥 USERS TABLE */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Users Table
                </MDTypography>
                <Button variant="contained" color="success" onClick={() => setOpenAddUser(true)}>
                  + Add User
                </Button>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns: uColumns, rows: uRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />

      {/* ✏️ MODAL EDIT PROJECT */}
      {selectedProject && (
        <EditProjectModal
          open={openEditProject}
          onClose={handleCloseEditProject}
          project={selectedProject}
          onChange={(e) =>
            setSelectedProject({
              ...selectedProject,
              [e.target.name]: e.target.files ? e.target.files[0] : e.target.value,
            })
          }
          onUpdate={handleUpdateProject}
        />
      )}

      {/* ➕ MODAL ADD PROJECT */}
      <AddProjectModal
        open={openAddProject}
        onClose={() => setOpenAddProject(false)}
        onProjectAdded={handleProjectAdded}
      />

      {/* ✏️ MODAL EDIT USER */}
      {selectedUser && (
        <EditUserModal
          open={openEditUser}
          onClose={handleCloseEditUser}
          user={selectedUser}
          onChange={(e) =>
            setSelectedUser({
              ...selectedUser,
              [e.target.name]: e.target.value,
            })
          }
          onUpdate={handleUpdateUser}
        />
      )}

      {/* ➕ MODAL ADD USER */}
      <AddUserModal
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
        onUserAdded={handleUserAdded}
      />
    </>
  );
}

export default Tables;
