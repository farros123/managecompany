/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

export default function useProjectsTableData(onEdit, onDelete, refresh) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data proyek!");
        const projects = await res.json();

        const formatted = projects.map((project) => {
          // ✅ Tentukan URL gambar yang valid
          const imageUrl =
            project.img_url ||
            (project.img
              ? `http://127.0.0.1:8000/images/projects/${project.img}`
              : "https://via.placeholder.com/80?text=No+Image");

          return {
            name: (
              <MDBox display="flex" alignItems="center" lineHeight={1}>
                <MDAvatar
                  src={imageUrl}
                  name={project.name}
                  size="sm"
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                  }}
                />
                <MDBox ml={2} lineHeight={1}>
                  <MDTypography display="block" variant="button" fontWeight="medium">
                    {project.name}
                  </MDTypography>
                </MDBox>
              </MDBox>
            ),

            budget: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Rp {parseInt(project.budget).toLocaleString("id-ID")}
              </MDTypography>
            ),

            status: (
              <MDTypography
                variant="caption"
                color={
                  project.status === "working"
                    ? "info"
                    : project.status === "done"
                    ? "success"
                    : "error"
                }
                fontWeight="medium"
              >
                {project.status}
              </MDTypography>
            ),

            completion: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {project.completion}%
              </MDTypography>
            ),

            action: (
              <MDBox display="flex" justifyContent="center" gap={2}>
                <MDTypography
                  component="a"
                  href="#"
                  variant="caption"
                  color="info"
                  fontWeight="medium"
                  sx={{ cursor: "pointer" }}
                  onClick={() => onEdit(project)}
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
                  onClick={() => onDelete(project.id)}
                >
                  Delete
                </MDTypography>
              </MDBox>
            ),
          };
        });

        setRows(formatted);
      } catch (err) {
        console.error("🚨 Gagal fetch data proyek:", err);
      }
    };

    fetchProjects();
  }, [onEdit, onDelete, refresh]); // ✅ Tambahkan refresh agar update otomatis

  return {
    columns: [
      { Header: "Project", accessor: "name", width: "30%", align: "left" },
      { Header: "Budget", accessor: "budget", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Completion", accessor: "completion", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows,
  };
}
