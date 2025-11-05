import DataTable from "examples/Tables/DataTable";
import data from "layouts/tables/data/authorsTableData";

function Users() {
  const { columns, rows } = data();

  return (
    <DataTable
      table={{ columns, rows }}
      isSorted={false}
      entriesPerPage={false}
      showTotalEntries={false}
      noEndBorder
    />
  );
}

export default Users;
