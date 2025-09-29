import React, { useState, useEffect } from "react";
import { Field, Formik, Form } from 'formik'
import * as Yup from 'yup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Link } from 'react-router-dom'
import axios from "axios";
import { toast } from 'react-toastify';
// NOTE: Removed external firebase imports (ref, uploadBytesResumable, getDownloadURL, storage)
// to comply with the single-file mandate and prevent relative import errors.
// Image upload is now mocked to return a placeholder URL.
import SendIcon from '@mui/icons-material/Send';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  Box,
  Avatar,
} from '@mui/material'

// ==========================================================
// 1. OTP CARD COMPONENT (OTPComponent - Merged into Signup.jsx)
// ==========================================================

// Define a validation schema using Yup for the 6-digit OTP
const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, 'OTP must be a 6-digit number')
    .required('OTP is required'),
});

const OtpCard = ({ user_id, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  // Effect to manage the resend timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    setSubmitting(true);
    try {
      await onSubmit(values.otp, user_id);
    } catch (error) {
      console.error('OTP submission failed:', error);
      setErrors({ otp: 'Verification failed. Please check the code.' });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleResendClick = async () => {
    // Replace with your actual backend call to resend OTP
    console.log(`Attempting to resend OTP for user ID: ${user_id}`);
    
    setResendLoading(true);
    try {
      // Simulate successful backend resend
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      toast.info('New OTP sent to your email!', { autoClose: 2000 });
      setResendCooldown(60);
      setIsResendDisabled(true);
    } catch (error) {
      console.error('Resend failed:', error);
      toast.error('Failed to resend OTP.', { autoClose: 3000 });
    } finally {
      setResendLoading(false);
    }
  };


  return (
    <Box 
      sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        bgcolor: 'background.paper',
        maxWidth: 450,
        width: '95%',
        mx: 'auto',
        mt: { xs: 5, md: 10 },
        textAlign: 'center',
      }}
    >
      <Stack spacing={3} alignItems="center">
        {/* Header and Icon */}
        <LockOpenIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700} color="primary.main">
          2-Step Verification
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          A 6-digit code was sent to your associated email.
        </Typography>

        <Formik
          initialValues={{ otp: '' }}
          validationSchema={OtpSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Stack alignItems="center" gap={3}>
                
                {/* OTP Input Field with enhanced styling */}
                <Field
                    as={TextField}
                    fullWidth
                    required
                    id="otp"
                    type="text"
                    name="otp"
                    label="Verification Code (6 Digits)"
                    placeholder="Enter Code"
                    value={values.otp}
                    onChange={handleChange}
                    inputProps={{ 
                      maxLength: 6, 
                      style: { 
                        fontSize: '24px', 
                        letterSpacing: '12px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      } 
                    }}
                    error={touched.otp && Boolean(errors.otp)}
                    helperText={touched.otp && errors.otp}
                  />
                
                {/* Submit Button */}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '18px',
                    height: '50px',
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.4)',
                    '&:hover': {
                        boxShadow: '0 6px 15px rgba(63, 81, 181, 0.6)',
                    }
                  }}
                  disabled={loading || isSubmitting}
                  endIcon={loading ? <CircularProgress size={24} color="inherit" /> : <LockOpenIcon />}
                >
                  {loading ? 'Verifying...' : 'Verify Account'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Divider sx={{ width: '100%', margin: '1rem 0' }} />
        
        {/* Resend OTP Section */}
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Typography fontSize="14px" color="text.secondary">
            Didn't receive the code?
          </Typography>
          <Button
            variant="text"
            onClick={handleResendClick}
            disabled={isResendDisabled || resendLoading}
            sx={{ textTransform: 'none', fontSize: '14px' }}
            endIcon={resendLoading ? <CircularProgress size={16} /> : <SendIcon sx={{ fontSize: 16 }} />}
          >
            {isResendDisabled 
                ? resendLoading ? 'Sending...' : `Resend in ${resendCooldown}s` 
                : 'Resend Code'}
          </Button>
        </Stack>
        
        {/* Footer info */}
        <Typography variant="caption" color="text.disabled" mt={1}>
            User ID: {user_id ? user_id.substring(0, 8) + '...' : 'N/A'}
        </Typography>
      </Stack>
    </Box>
  );
}


// ==========================================================
// 2. MAIN SIGNUP COMPONENT
// ==========================================================

// Define a validation schema using Yup
const SignupSchema = Yup.object().shape({
    nickname: Yup.string().required('Nickname is required'),
    fullname: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});


function Signup() {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);
    
    const handleImageUpload = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // This function handles the OTP verification call
    const verifyOtp = async (otp, user_id) => {
        setLoading(true);
        try {
            const payload = { otp };
            // Using a mock URL for this demo. Replace with your actual endpoint.
            const response = await axios.post(
                `http://localhost:4000/users/verify-otp/${user_id}`,
                payload
            );

            if (response.status === 200) {
                toast.success('OTP Verified! Redirecting to login...', {
                    position: "bottom-right",
                    autoClose: 1500,
                });
                // In a real app, you might set a cookie/token here, but for this context:
                setTimeout(() => {
                    window.location.href = "/log-in";
                }, 1600);
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
            toast.error('OTP verification failed! Invalid code.', {
                position: "bottom-right",
                autoClose: 2000,
            });
            throw error; // Re-throw to allow OtpCard to set errors/stop loading
        } finally {
            setLoading(false);
        }
    };

    function handleSubmit(values, { setSubmitting, setErrors }) {
        setLoading(true);
        setSubmitting(true);
        const { nickname, fullname, email, password } = values;
        
        // Mock image upload function as Firebase is not configured in this single file
        const uploadImage = async () => {
            // Simulate image upload time
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // Return a mock image URL or null if no image was uploaded
            return image 
                ? `https://placehold.co/100x100/3f51b5/ffffff?text=${nickname.charAt(0).toUpperCase()}` 
                : null; 
        };

        const createAccount = async (imgUrl = null) => {
            const payload = { 
                nickname, 
                fullname, 
                email, 
                password, 
                img: imgUrl 
            };
            
            try {
                // Replace with your actual backend call
                const response = await axios.post("http://localhost:4000/users/create", payload);
                
                if (response.data.id) {
                    setUserId(response.data.id);
                    toast.success('Account created! Please enter your OTP sent to your email.', {
                        position: "bottom-right",
                        autoClose: 2500,
                    });
                } else {
                    // Handle server errors that don't throw an exception (e.g., email already exists)
                    setErrors({ email: response.data.message || 'Signup failed.' });
                    toast.error(response.data.message || 'Something is missing!', {
                        position: "bottom-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error("API Error:", error);
                setErrors({ email: 'A network error occurred during signup.' });
                toast.error('An error occurred during signup. Please try again.', {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
                setSubmitting(false);
            }
        };

        uploadImage().then(createAccount);
    }

    // Conditional rendering: show OTP card if user_id is set
    if (userId) {
        return (
            <OtpCard 
                user_id={userId}
                onSubmit={verifyOtp}
            />
        );
    }
    
    // Default Signup Form
    return (
      <Stack
          justifyContent="center"
          alignItems="center"
          width="100%"
          gap="20px"
          pt="10px"
      >
          <Stack
              direction="row"
              width="100%"
              sx={{ backgroundColor: 'primary.main', alignItems: 'center', justifyContent: 'center' }}
              height="125px"
          >
              <Stack
                  spacing={0}
                  justifyContent="center"
                  width="100%"
                  maxWidth="1440px"
                  height="125px"
                  ml={10}
              >
                  <Typography fontSize="20px" color="white" fontWeight="">
                      Sign Up
                  </Typography>
                  <Typography variant="h5" color="white" fontWeight="bold">
                      Welcome On Board!
                  </Typography>
              </Stack>
          </Stack>

          <Stack
              alignItems="center"
              justifyContent="space-between"
              mt={3}
              direction="row"
              width="100%"
              maxWidth="1440px"
          >
              {/* Illustration */}
              <Stack width="50%" display={{ xs: 'none', md: 'flex' }}>
                  <img
                      width="100%"
                      src="https://i.ibb.co/G2k63ys/login-1.png"
                      alt="Signup illustration"
                  />
              </Stack>
              
              {/* Signup Form */}
              <Stack 
                  width={{ xs: '100%', md: '450px' }} 
                  margin="0 auto"
                  p={{ xs: '1rem', md: 0 }}
                  // Apply card styling directly to the form's container for visual consistency
                  component={Box}
                  sx={{
                    p: { xs: '1rem', md: '2rem' },
                    borderRadius: 4,
                    boxShadow: { md: '0 10px 30px rgba(0, 0, 0, 0.15)' }, 
                    bgcolor: { md: 'background.paper' },
                  }}
              >
                  <Formik
                      initialValues={{
                          nickname: '',
                          fullname: '',
                          email: '',
                          password: '',
                      }}
                      validationSchema={SignupSchema}
                      onSubmit={handleSubmit}
                  >
                      {({
                          values,
                          handleChange,
                          errors,
                          touched,
                          isSubmitting,
                      }) => (
                          <Form>
                              <Stack alignItems="start" gap="10px">
                                  <Typography fontSize="20px" variant="h5">
                                      <b>Sign Up</b>
                                  </Typography>
                                  <Typography fontSize="14px" color="primary.main">
                                      Please, fill your information below
                                  </Typography>

                                  <Stack 
                                      alignItems="center" 
                                      width="100%" 
                                      gap={2} 
                                      mb={2}
                                      direction="row"
                                      justifyContent="space-between"
                                  >
                                      <Avatar
                                          src={image && URL.createObjectURL(image)}
                                          sx={{
                                              width: '80px',
                                              height: '80px',
                                              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                          }}
                                      />
                                      <Stack>
                                        <Typography fontSize="12px" color="text.secondary">
                                            Choose your profile picture
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            component="label" 
                                            endIcon={<PhotoCamera />}
                                            sx={{ textTransform: 'none', mt: 1 }}
                                        >
                                            Upload
                                            <input hidden accept="image/*" type="file" 
                                                id="image"
                                                name="image" 
                                                onChange={handleImageUpload} 
                                            />
                                        </Button>
                                      </Stack>
                                  </Stack>

                                  <TextField
                                      fullWidth
                                      type="text"
                                      name="nickname"
                                      margin="dense"
                                      label="Nickname"
                                      size="small"
                                      required
                                      onChange={handleChange}
                                      value={values.nickname}
                                      error={touched.nickname && Boolean(errors.nickname)}
                                      helperText={touched.nickname && errors.nickname}
                                  />
                                  <TextField
                                      fullWidth
                                      type="text"
                                      name="fullname"
                                      margin="dense"
                                      label="Full Name"
                                      size="small"
                                      required
                                      onChange={handleChange}
                                      value={values.fullname}
                                      error={touched.fullname && Boolean(errors.fullname)}
                                      helperText={touched.fullname && errors.fullname}
                                  />
                                  <TextField
                                      fullWidth
                                      required
                                      type="email"
                                      name="email"
                                      id="email"
                                      margin="dense"
                                      label="Email"
                                      placeholder="email@example.com"
                                      size="small"
                                      onChange={handleChange}
                                      value={values.email}
                                      error={touched.email && Boolean(errors.email)}
                                      helperText={touched.email && errors.email}
                                  />
                                  <TextField
                                      fullWidth
                                      required
                                      type="password"
                                      name="password"
                                      id="password"
                                      margin="dense"
                                      label="Password"
                                      size="small"
                                      onChange={handleChange}
                                      value={values.password}
                                      error={touched.password && Boolean(errors.password)}
                                      helperText={touched.password && errors.password}
                                  />

                                  <Button
                                      variant="contained"
                                      color="primary"
                                      type="submit"
                                      sx={{
                                          color: 'white',
                                          textTransform: 'none',
                                          width: '100px',
                                          fontSize: '16px',
                                          alignSelf: 'end',
                                          margin: '1rem 0 0 0',
                                      }}
                                      size="small"
                                      disabled={loading || isSubmitting}
                                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                  >
                                      {loading ? 'Processing...' : 'Sign Up'}
                                  </Button>
                              </Stack>
                          </Form>
                      )}
                  </Formik>
                  
                  <Divider sx={{ width: '100%', margin: '1rem 0' }} />
                  <Stack
                      justifyContent="center"
                      direction="row"
                      gap="10px"
                  >
                      <Typography fontSize="16px">
                          Already have an account?
                      </Typography>
                      <Typography
                          component={Link}
                          to="/log-in"
                          fontSize="16px"
                          color="primary.main"
                          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                          Login
                      </Typography>
                  </Stack>
              </Stack>
          </Stack>
      </Stack>
    );
}

export default Signup;
