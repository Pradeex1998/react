import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlanById, savePlan } from 'api/api';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, Grid, TextField, Button, Typography, Container, MenuItem } from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  plan_id: Yup.string().required('Required'),
  name: Yup.string().required('Required'),
  period: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
});

const emptyForm = {
  plan_id: '',
  name: '',
  description: '',
  period: '',
  status: 'Active',
  amount: '',  // Add amount to the empty form
};

const PlanForm = () => {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdd = mode === 'a';
  const isEdit = mode === 'e';
  const title = isAdd ? 'Add Plan' : isEdit ? 'Edit Plan' : 'View Plan';
  const isView = mode === 'v';

  useEffect(() => {
    if ((isEdit || isView) && id) {
      setLoading(true);
      getPlanById(id)
        .then((data) => {
          if (data) {
            setFormData(data);
          } else setNotFound(true);
        })
        .catch(() => setError('Failed to load plan data'))
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

  const handleSubmit = async (values) => {
    if (isView) return;
    try {
      await savePlan(values, isEdit ? id : null);
      toast.success(`Plan ${isAdd ? 'added' : 'updated'} successfully!`);
      navigate('/plan/list');
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error('Failed to save plan. Please try again.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (notFound) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Typography variant="h6" color="error">Plan not found.</Typography>
        <Button variant="contained" onClick={() => navigate('/plan/list')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Container>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Breadcrumb title={title} />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>{title}</Typography>

              <Formik
                initialValues={formData}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      {/* Plan ID */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Plan ID"
                          name="plan_id"
                          value={values.plan_id}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.plan_id && errors.plan_id)}
                          helperText={touched.plan_id && errors.plan_id}
                        />
                      </Grid>

                      {/* Name */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Grid>

                      {/* Description */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                          multiline
                          rows={3}
                        />
                      </Grid>

                      {/* Period */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Period"
                          name="period"
                          value={values.period}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.period && errors.period)}
                          helperText={touched.period && errors.period}
                        />
                      </Grid>

                      {/* Amount */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Amount"
                          name="amount"
                          value={values.amount}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.amount && errors.amount)}
                          helperText={touched.amount && errors.amount}
                          type="number"
                        />
                      </Grid>

                      {/* Status Dropdown */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Status"
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>

                    <Grid container justifyContent="flex-end" mt={3}>
                      <Button variant="outlined" onClick={() => navigate('/plan/list')} sx={{ mr: 2 }}>
                        Back
                      </Button>
                      {!isView && (
                        <Button variant="contained" type="submit">
                          {isAdd ? 'Add' : 'Update'}
                        </Button>
                      )}
                    </Grid>
                  </form>
                )}
              </Formik>
            </CardContent>  
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlanForm;
