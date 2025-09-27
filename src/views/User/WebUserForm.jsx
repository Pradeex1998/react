import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { getWebUsers, saveWebUser } from 'api/api';
import { toast } from 'react-toastify';


const emptyForm = {
  id: null,
  username: '',
  email: '',
  password: '',
  is_active: 1, // always a number (0 or 1)
};


// Validation schema for the form
const getValidationSchema = (mode) => Yup.object().shape({
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: mode === 'a' ? Yup.string().required('Required') : Yup.string(),
  is_active: Yup.number().required('Required'), // Validate status as a number (0 or 1)
});

const WebUserForm = () => {
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
        const data = await getWebUsers();
        const user = data.find((u) => String(u.id) === id);
        if (user) {
          setFormData({
            ...user,
            is_active: Number(user.is_active), 
          });
          
        } else {
          setUserNotFound(true);
        }
      };
      fetchData();
    }
  }, [mode, id]);

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      is_active: Number(values.is_active),
    };
  
    if (!isAdd && !payload.password) {
      delete payload.password;
    }
  
    try {
      await saveWebUser(payload);
      toast.success(`User ${isAdd ? 'added' : 'updated'} successfully!`);
      navigate('/user/web-userlist');
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error('Failed to save user. Please try again.');
    }
  };
  
  

  if (userNotFound) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">User not found.</Typography>
        <Button variant="contained" onClick={() => navigate('/user/web-userlist')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Breadcrumb title={`Web ${modeTitle}`} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>{modeTitle}</Typography>

              <Formik
                initialValues={{
                  ...emptyForm,
                  ...formData, 
                }}
                enableReinitialize
                validationSchema={getValidationSchema(mode)}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      {/* Username */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="username"
                          label="Username"
                          value={values.username}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.username && errors.username)}
                          helperText={touched.username && errors.username}
                        />
                      </Grid>

                      {/* Email */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email"
                          value={values.email}
                          onChange={handleChange}
                          disabled={isView}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>

                      {/* Status Dropdown */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          select
                          name="is_active"
                          label="Status"
                          value={values.is_active ?? 1} // fallback to 1 if undefined
                          onChange={handleChange}
                          disabled={isView}
                          SelectProps={{ native: true }}
                          error={Boolean(touched.is_active && errors.is_active)}
                          helperText={touched.is_active && errors.is_active}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </TextField>

                      </Grid>

                      {/* Password Field (Only for Add/Edit Mode) */}
                      {(isAdd || isEdit) && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            disabled={isView}
                            error={Boolean(touched.password && errors.password)}
                            helperText={
                              isEdit
                                ? 'Leave blank if you do not want to change password'
                                : touched.password && errors.password
                            }
                          />
                        </Grid>
                      )}
                    </Grid>

                    {/* Submit Buttons */}
                    <Grid container justifyContent="flex-end" mt={3}>
                      <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                      </Button>&nbsp;
                      {!isView && (
                        <Button type="submit" variant="contained">
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

export default WebUserForm;
