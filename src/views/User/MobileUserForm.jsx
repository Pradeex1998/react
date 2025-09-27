import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getUsers, saveUser } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Typography, Container, Card, CardContent, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { toast } from 'react-toastify';



const getValidationSchema = (mode) => {
  return Yup.object().shape({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: mode === 'a' ? Yup.string().required('Required') : Yup.string(),
    phone_number: Yup.string().required('Required'),
  });
};

const emptyForm = {
  id: null,
  username: '',
  email: '',
  password: '',
  phone_number: '',
};

const MobileUserForm = () => {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [userNotFound, setUserNotFound] = useState(false);

  const isView = mode === 'v';
  const isEdit = mode === 'e';
  const isAdd = mode === 'a';

  const modeTitle = {
    a: 'Add User',
    e: 'Edit User',
    v: 'View User',
  }[mode] || 'User Form';

  useEffect(() => {
    if ((isEdit || isView) && id) {
      const fetchData = async () => {
        const data = await getUsers();
        const user = data.find((u) => String(u.id) === id);
        if (user) {
          setFormData({
            ...user,
            subscription: user.subscription === null ? "" : user.subscription,  // Handle subscription null
          });
        } else {
          setUserNotFound(true);
        }
      };
      fetchData();
    }
  }, [mode, id]);
  

  const handleSubmit = async (values) => {
    if (isView) return;
  
    try {
      await saveUser(values);
      toast.success(`User ${isAdd ? 'added' : 'updated'} successfully!`);
      navigate('/user/mobile-userlist');
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error('Failed to save user. Please try again.');
    }
  };
  

  if (userNotFound) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Typography variant="h6" color="error">
          User not found.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/user/mobile-userlist')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Breadcrumb title={`Mobile ${modeTitle}`} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {modeTitle}
              </Typography>

              <Formik
                initialValues={formData}
                enableReinitialize
                validationSchema={getValidationSchema(mode)}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      {[
                        { name: 'username', label: 'Username' },
                        { name: 'email', label: 'Email' },
                        ...(isAdd ? [{ name: 'password', label: 'Password', type: 'password' }] : []),
                        { name: 'phone_number', label: 'Phone' },
                        // { name: 'subscription', label: 'Subscription' },
                      ].map(({ name, label, type = 'text', disabled }) => (
                        <Grid item xs={12} sm={6} key={name}>
                          {name === 'subscription' ? (
                            <FormControl fullWidth error={Boolean(touched[name] && errors[name])}>
                              <InputLabel>{label}</InputLabel>
                              <Select
                                name={name}
                                value={values[name]}
                                onChange={handleChange}
                                disabled={disabled || isView}
                                label={label}
                              >
                                <MenuItem value={1}>Yes</MenuItem>
                                <MenuItem value={0}>No</MenuItem>
                              </Select>
                              {touched[name] && errors[name] && (
                                <FormHelperText>{errors[name]}</FormHelperText>
                              )}
                            </FormControl>
                          ) : (
                            <TextField
                              fullWidth
                              label={label}
                              name={name}
                              type={type}
                              value={values[name]}
                              onChange={handleChange}
                              disabled={disabled || isView}
                              error={Boolean(touched[name] && errors[name])}
                              helperText={touched[name] && errors[name]}
                            />
                          )}
                        </Grid>
                      ))}
                    </Grid>

                    <Grid container justifyContent="flex-end" mt={3} >
                      <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                      </Button>&nbsp;
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

export default MobileUserForm;
