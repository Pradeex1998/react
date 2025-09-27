import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography
} from '@mui/material';
import DataTable from 'react-data-table-component';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { getUsers } from 'api/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import findTitleByUrl from '../Utils/getTitleFromMenu';
import menuItems from 'menu-items';

const MobileUserList = () => {
  const [filterText, setFilterText] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const pageTitle = findTitleByUrl(menuItems.items, location.pathname) || 'Page';

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers();
      setUsers(data);
      setFilteredData(data);
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);

    const filtered = users.filter((item) =>
      (item.username || '').toLowerCase().includes(value) ||
      (item.email || '').toLowerCase().includes(value) ||
      (item.phone_number || '').toLowerCase().includes(value) ||
      String(item.subscription || '').toLowerCase().includes(value) ||
      (item.razorpay_id || '').toLowerCase().includes(value) ||
      String(item.subs_amt || '').toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '70px' },
    { name: 'Username', selector: row => row.username, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true, width: '270px' },
    { name: 'Phone', selector: row => row.phone_number, sortable: true },
    {
      name: 'Subscription',
      selector: row => row.subscription === 1 ? 'Yes' : 'No',
      sortable: true
    },
    { name: 'Updated At', selector: row => row.updated_at, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <>
          <IconButton
            component={Link}
            to={`/user/mobile-userform/e/${row.id}`}
            size="small"
            color="primary"
            sx={{ mr: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={Link}
            to={`/user/mobile-userform/v/${row.id}`}
            size="small"
            color="secondary"
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
      <Breadcrumb title={pageTitle}>
        {/* <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Mobile User
        </Typography>
        <Typography variant="subtitle2" color="primary">
          List
        </Typography> */}
      </Breadcrumb>

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
                {/* <Grid item>
                  <Button
                    component={Link}
                    to="/user/mobile-userform/a"
                    color='error'
                    variant="contained"
                  >
                    Add User
                  </Button>
                </Grid> */}
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

export default MobileUserList;
