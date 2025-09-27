import React, { useState, useEffect } from 'react';
import { Grid, TextField, Card, CardContent, Typography } from '@mui/material';
import DataTable from 'react-data-table-component';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { getSubscriptionDetail, getUsers } from 'api/api';
import findTitleByUrl from 'views/Utils/getTitleFromMenu';
import menuItems from 'menu-items';
import Select from 'react-select';
import Loader from '../../component/Loader/Loader';


const SubscriptionHistoryList = () => {
    const [filterText, setFilterText] = useState('');
    const [mobileUsers, setMobileUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pending, setPending] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    
    const pageTitle = findTitleByUrl(menuItems.items, location.pathname) || 'Page';

    // ✅ Define fetchData outside useEffect
    const fetchData = async () => {
        if (!selectedUser) return;
        setPending(true);
        const res = await getSubscriptionDetail({
            userId: selectedUser,
            page,
            perPage,
            search: filterText,
            sortField,
            sortOrder
        });
        setData(res.results || []);
        setTotalRows(res.count || 0);
        setPending(false);
    };

 

    useEffect(() => {
        const fetchMobileUsers = async () => {
            const users = await getUsers('active');
            setMobileUsers(users);
        };
        fetchMobileUsers();
    }, []);

    // Re-fetch data when dependencies change
    useEffect(() => {
        fetchData();
    }, [selectedUser, page, perPage, filterText, sortField, sortOrder]);

    const handlePageChange = page => setPage(page);

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setPage(page);
    };

    const handleSort = (column, sortDirection) => {
        setSortField(column.index ?? 4); 
        setSortOrder(sortDirection);
    };
    



    const handleSearch = (e) => {
        setFilterText(e.target.value);
        setPage(1); // reset to first page on search
    };

    const columns = [
        { name: 'Username', selector: row => row.username, wrap: true, sortable: true, index: 0 },
        { name: 'Plan ID', selector: row => row.plan_id, wrap: false, sortable: true, width: '250px', index: 1 },
        { name: 'Sub.Name', selector: row => row.name, wrap: true, sortable: true, index: 2 },
        { name: 'Method', selector: row => row.method, wrap: true, sortable: true, index: 3 },
        { name: 'Date', selector: row => row.formatted_date, wrap: true, sortable: true, index: 4 },
        { name: 'Time', selector: row => row.formatted_time, wrap: true, sortable: true, index: 5 },
        {
            name: 'Status',
            selector: row => row.subs_status,
            wrap: true,
            sortable: true,
            index: 6,
            cell: row => (
                <span
                    style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        color: 'white',
                        backgroundColor: row.subs_status === 'Success' ? 'green' : 'red'
                    }}
                >
                    {row.subs_status}
                </span>
            )
        }
    ];

    return (
        <>
            <Breadcrumb title={pageTitle} />

            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center" mb={2}>
                                {/* User Dropdown */}
                                <Grid item xs={3}>
                                    <Select
                                        options={mobileUsers.map(user => ({ label: user.username, value: user.id }))}
                                        value={
                                            selectedUser
                                                ? { label: mobileUsers.find(u => u.id === selectedUser)?.username, value: selectedUser }
                                                : null
                                        }
                                        onChange={(selectedOption) => {
                                            setSelectedUser(selectedOption?.value || '');
                                            setPage(1);
                                        }}
                                        placeholder="Select User"
                                        isClearable
                                    />

                                </Grid>

                                {/* Search */}
                                <Grid item xs={3}>
                                    <TextField
                                        label="Search"
                                        variant="outlined"
                                        size="small"
                                        value={filterText}
                                        onChange={handleSearch}
                                        fullWidth
                                        disabled={!selectedUser}
                                    />
                                </Grid>
                            </Grid>

                            {!selectedUser && (
                                <Typography color="error" sx={{ mb: 2 }}>
                                    Please select a user to view subscription details.
                                </Typography>
                            )}

                            <div style={{ overflowX: 'auto' }}>
                                {pending && <Loader />}
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    onChangePage={handlePageChange}
                                    onSort={handleSort}
                                    sortServer
                                    highlightOnHover
                                    striped
                                    responsive
                                    noDataComponent="No data available. Please select a user."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid >
        </>
    );
};

export default SubscriptionHistoryList;
