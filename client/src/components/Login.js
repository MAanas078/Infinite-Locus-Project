import { Formik, Form } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  CircularProgress, // Add a spinner for the loading state
} from '@mui/material';

// Yup is the react liberary to handle the validation automatically by creating the shape schema of the object
// Define a validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);

  // Log in function will be called when the form is submitted
  // values form values 
  //  setErrors function to set form errors
    const login = async (values, { setErrors }) => {
    setLoading(true);
    try {
      // Use the environment variable for the API call
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email: values.email,
        password: values.password,
      });

      if (response.data.user) {
        toast.success('Logged In Successfully!', {
          position: 'bottom-right',
          autoClose: 1000,
        });
        

        // Store token and user info in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
           
        // Redirect based on user role
      
        if (response.data.user.role === 'Admin') {
          window.location.href = '/admin'; // redirect user to admin page
        } else {
          window.location.href = '/'; // otherwise on home page
        }

      } else {
        // Handle server-side errors
        setErrors({ email: 'Incorrect email or password' });
        toast.error('Oops ! Email or Password is incorrect!', {
          position: 'bottom-right',
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Oops ! An error occurred. Please try again.', {
        position: 'bottom-right',
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // stack is use to create a flexbox container with direction column by default
    // stack is the predefined component in mui
    // h5 is the predefined variant in mui
    // h5 can styled the ui component in terms of font size font weight and margin
    <Stack justifyContent="center" alignItems="center" width="100%" pt="10px">
      <Stack
        direction="row"
        width="100%"
        sx={{ backgroundColor: 'primary.main', height: '125px', alignItems: 'center', justifyContent: 'center' }}
      >
        
        <Stack spacing={0} justifyContent="center" width="100%" maxWidth="1440px" height="125px" ml={10}>
          <Typography fontSize="20px" color="white" fontWeight="">Log In</Typography>
          
          <Typography variant="h5" color="white" fontWeight="bold">Welcome Back!</Typography>
        </Stack>
      </Stack>
      
      <Stack alignItems="center" justifyContent="space-between" mt={3} direction="row" width="100%" maxWidth="1440px">
        <Stack width="50%" display={{ xs: 'none', md: 'flex' }}>
          <img width="100%" src="https://i.ibb.co/G2k63ys/login-1.png" alt="login illustration" />
        </Stack>
        <Stack width={{ xs: '100%', md: '400px' }} margin="0 auto" p={{ xs: '1rem', md: 0 }}>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema} // Add validation schema
            onSubmit={login}
          >
              {/* // Formik provides form state and helpers via render props */}
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <Stack alignItems="start" gap="10px">
                  <Typography variant="h5"><b>Log In</b></Typography>
                  <Typography fontSize="14px" color="primary.main">Please, fill your information below</Typography>
                  
                  <TextField
                    fullWidth
                    required
                    id="email"
                    type="email"
                    name="email"
                    margin="dense"
                    label="Email"
                    placeholder="email@example.com"
                    size="small"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <TextField
                    fullWidth
                    required
                    id="password"
                    type="password"
                    name="password"
                    margin="dense"// dense is used to reduce the height of the textfield
                    label="Password"
                    size="small"
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  
                  <Stack direction="row-reverse" width="100%" sx={{ justifyContent: { xs: 'center', md: 'end' } }}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        width: '100px',
                        fontSize: '16px',
                        mt: 2,
                      }}
                      size="small"
                      disabled={loading} // Disable button while loading
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {loading ? 'Logging In...' : 'Login'}
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
          <Divider sx={{ width: '100%', margin: '1rem 0' }} />
          <Stack justifyContent="center" direction="row" gap="10px">
            <Typography fontSize="16px">Don&apos;t have an account?</Typography> &apos;
            <Typography component={Link} to="/sign-up" fontSize="16px">Sign Up</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Login;
