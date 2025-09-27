import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from 'api/api';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ResetPassword = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (values, { setSubmitting }) => {
    setMessage('');
    setErrorMsg('');
    try {
      const res = await resetPassword(token, values.password);
      setMessage(res.message);
    } catch (err) {
      setErrorMsg(err.error || 'Password reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/src/assets/images/forgot-pass-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Grid item xs={12} sm={8} md={5} lg={4}>
        <Card sx={{ boxShadow: 6, borderRadius: 3, backdropFilter: 'blur(4px)' }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Reset Your Password
            </Typography>

            <Formik
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={Yup.object({
                password: Yup.string()
                  .min(6, 'Minimum 6 characters')
                  .required('Password is required'),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('password'), null], 'Passwords must match')
                  .required('Confirm Password is required')
              })}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    margin="normal"
                  />

                  {message && (
                    <Typography color="success.main" sx={{ mt: 1 }}>
                      {message}
                    </Typography>
                  )}
                  {errorMsg && (
                    <Typography color="error.main" sx={{ mt: 1 }}>
                      {errorMsg}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, py: 1.5 }}
                  >
                    Reset Password
                  </Button>
                </form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default ResetPassword;
