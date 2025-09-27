import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import DataTable from 'react-data-table-component';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { getWebUsers } from 'api/api';
import findTitleByUrl from 'views/Utils/getTitleFromMenu';
import menuItems from 'menu-items';

const WebUserList = () => {
  const [filterText, setFilterText] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const pageTitle = findTitleByUrl(menuItems.items, location.pathname) || 'Page';

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWebUsers();
      setUsers(data);
      setFilteredData(data);
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);
    setFilteredData(
      users.filter((user) =>
        (user.username || '').toLowerCase().includes(value) ||
        (user.email || '').toLowerCase().includes(value)
      )
    );
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Username', selector: row => row.username, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    {
      name: 'Status',
      selector: row => row.is_active,
      cell: row => (
        <span
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '20px',
            color: 'white',
            backgroundColor: row.is_active == 1 ? 'green' : 'red',
          }}
        >
          {row.is_active == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <>
          <IconButton
            component={Link}
            to={`/user/web-userform/e/${row.id}`}
            color="primary"
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={Link}
            to={`/user/web-userform/v/${row.id}`}
            color="secondary"
            size="small"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </>
      ),
      ignoreRowClick: true,
    }
  ];

  return (
    <>
      <Breadcrumb title={pageTitle} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                <Grid item>
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={filterText}
                    onChange={handleSearch}
                    style={{ width: 250 }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    component={Link}
                    to="/user/web-userform/a"
                    color='error'
                    variant="contained"
                  >
                    Add User
                  </Button>
                </Grid>
              </Grid>

              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, filteredData.length]}
                highlightOnHover
                striped
                responsive
                paginationComponentOptions={{
                  rowsPerPageText: 'Rows per page:',
                  rangeSeparatorText: 'of',
                  noRowsPerPage: false,
                  selectAllRowsItem: false,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default WebUserList;
