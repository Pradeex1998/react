import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Card, CardContent, Grid, TextField, Button
} from '@mui/material';
import DataTable from 'react-data-table-component';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { getPlans } from 'api/api';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import findTitleByUrl from '../Utils/getTitleFromMenu';
import menuItems from 'menu-items';

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const location = useLocation();
  const pageTitle = findTitleByUrl(menuItems.items, location.pathname) || 'Plan List';

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlans();
      setPlans(data);
      setFilteredData(data);
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);
    const filtered = plans.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(value) ||
        (item.description || '').toLowerCase().includes(value) ||
        (item.period || '').toLowerCase().includes(value) ||
        (item.status || '').toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '70px' },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Period', selector: row => row.period, sortable: true },
    { name: 'Amount', selector: row => row.amount, sortable: true },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => (
        <span
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '20px',
          color: 'white',
          backgroundColor: row.status == 'Active' ? 'green' : 'red',
          }}
          >
          {row.status == 'Active' ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true,
    },
    // { name: 'Created At', selector: row => row.created_at, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <>
          <IconButton
            component={Link}
            to={`/plan/form/e/${row.id}`}
            color="primary"
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={Link}
            to={`/plan/form/v/${row.id}`}
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
                    to="/plan/form/a"
                    color='error'
                    variant="contained"
                  >
                    Add Plan
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

export default PlanList;
