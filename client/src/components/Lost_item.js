import React, { useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Paper,
  Grid,
  Button,
  Typography,
  Stack,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  CircularProgress
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Formik, Form } from 'formik'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase.js'
import * as Yup from 'yup';

const LostItem = () => {
  const [loading, setloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const usertoken = window.localStorage.getItem("token");
  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem('user'));
    return user ? user._id : null;
  };

  const config = {
                headers: { Authorization: `Bearer ${usertoken}` },
            };

  const schema = Yup.object().shape({
    name: Yup.string().required('Item name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Item type is required'),
    location: Yup.string().required('Location is required'),
    date: Yup.string().required('Date is required'),
    number: Yup.string().required('Phone number is required'),
  });

  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      const errorMessages = error.inner.map((err) => err.message);
      toast.error(errorMessages.join('\n'), {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!image || image.length === 0) {
      toast.error('Please upload at least one image', {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setloading(true);
    const promises = [];

    for (let i = 0; i < image.length; i++) {
      const img = image[i];
      const storageRef = ref(storage, `/images/${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, img);
      const promise = new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const uploaded = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(uploaded);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((imgUrl) => {
                resolve(imgUrl);
              })
              .catch((error) => {
                console.log(error);
                reject(error);
              });
          }
        );
      });
      promises.push(promise);
    }

    Promise.all(promises)
      .then((urls) => {
        const newItem = { ...values, img: urls, userId: getUserId() };
        axios.post('http://localhost:4000/Items/newItem', newItem, config)
          .then(() => {
            toast.success('Wohoo 🤩! Item listed successfully.', {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setloading(false);
            resetForm();
            setImage(null);
            setProgress(0);
            window.location.href = "/mylistings";
          })
          .catch((error) => {
            console.log("An error occurred:", error);
            toast.error('Oops 🙁! Something went wrong.', {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setloading(false);
          });
      })
      .catch((error) => {
        console.log("An error occurred:", error);
        toast.error('Oops 🙁! Something went wrong.', {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setloading(false);
      });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* Left Section: Form */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Post a Lost or Found Item 📢
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Help others by listing your lost item or something you've found.
          </Typography>

          <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
            <Formik
              initialValues={{
                name: '',
                description: '',
                type: '',
                location: '',
                date: '',
                number: '',
              }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, errors, touched }) => (
                <Form>
                  <Grid container spacing={3}>
                    {/* Item Details */}
                    <Grid item xs={12}>
                      <Typography variant="h6" color="primary.main" gutterBottom>Item Details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="name"
                        name="name"
                        label="Item Name"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        rows={4}
                        value={values.description}
                        onChange={handleChange}
                        error={touched.description && !!errors.description}
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="location"
                        name="location"
                        label="Location (where it was lost/found)"
                        value={values.location}
                        onChange={handleChange}
                        error={touched.location && !!errors.location}
                        helperText={touched.location && errors.location}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="date"
                        name="date"
                        label="Date (e.g., 'Yesterday' or '10/25/2023')"
                        value={values.date}
                        onChange={handleChange}
                        error={touched.date && !!errors.date}
                        helperText={touched.date && errors.date}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="number"
                        name="number"
                        label="Contact Number"
                        value={values.number}
                        onChange={handleChange}
                        error={touched.number && !!errors.number}
                        helperText={touched.number && errors.number}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth required error={touched.type && !!errors.type}>
                        <InputLabel id="type-select-label">Item Type</InputLabel>
                        <Select
                          labelId="type-select-label"
                          id="type"
                          name="type"
                          value={values.type}
                          label="Item Type"
                          onChange={handleChange}
                        >
                          <MenuItem value="Lost">I Lost It</MenuItem>
                          <MenuItem value="Found">I Found It</MenuItem>
                        </Select>
                        <FormHelperText>{touched.type && errors.type}</FormHelperText>
                      </FormControl>
                    </Grid>
                    
                    {/* Image Upload */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary.main" gutterBottom>Upload Image</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<PhotoCamera />}
                          color="primary"
                          sx={{ py: 1.5 }}
                        >
                          Choose File(s)
                          <input hidden accept="image/*" multiple type="file" onChange={handleImageUpload} />
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                          {image ? `${image.length} file(s) selected` : 'No file chosen'}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    {/* Submit Button */}
                    <Grid item xs={12} sx={{ mt: 4 }}>
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          size="large"
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Post'}
                        </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        {/* Right Section: Illustration */}
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img
              width="100%"
              src="https://i.ibb.co/Q65DB0d/list-item.png"
              alt="Illustration of a person listing an item"
              style={{ maxWidth: '450px', height: 'auto' }}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LostItem;