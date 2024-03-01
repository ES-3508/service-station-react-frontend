import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';
import { createCustomer, deleteCustomer, updateCustomer, uploadCustomerImage } from 'store/reducers/customers';
import { CustomerStatus } from 'config';
import { useSelector } from 'store';

import SingleFilCustomized from 'components/third-party/dropzone/SingleFileCustomized';

// const avatarImage = require.context('assets/images/users', true);

// constant
// const getInitialValues = (customer) => {

//   const newCustomer = {
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     country: '',
//     status: CustomerStatus.PENDING,
//   };

//   if (customer) {
//     newCustomer.name = customer.name;
//     newCustomer.phone = customer.phone;
//     newCustomer.email = customer.email;
//     newCustomer.address = customer.address;
//     newCustomer.country = customer.country;
//     newCustomer.status = customer.status;
//     newCustomer.age = customer.age;
//     newCustomer.zipCode = customer.zipCode;
//     newCustomer.web = customer.web;
//     newCustomer.description = customer?.description;
//     return _.merge({}, newCustomer, customer);
//   }

//   return newCustomer;
// };

// const allStatus = ['Complicated', 'Single', 'Relationship'];

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddCustomer = ({ customer, onCancel }) => {

  const [openAlert, setOpenAlert] = useState(false);

  // const { uploadedImageUrl } = useSelector((state) => state.customers);

  const [deletingCustomer, setDeletingCustomer] = useState({
    _id: null,
    name: ''
  });

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const theme = useTheme();
  const isCreating = !customer;

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (customer) {
      setAvatar(customer.imageUrl);
    }
  }, [customer])

  const deleteHandler = async (customer) => {
    setDeletingCustomer({
      _id: customer._id,
      name: customer.name
    })
    setOpenAlert(true)
  }

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    phone: Yup.string().matches(/^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{5}\)?[\s-]?\d{4,5}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/, "Invalid phone number").required("Phone number is required"),
    age: Yup.number().min(16).required('Age is required'), // TODO: Define Min and Max age limits
    address: Yup.string().max(255).required('Address is required'),
    country: Yup.string().max(255).required('Country is required'),
    zipCode: Yup.number().typeError("Please enter a number").required('Zip code is required'),
    web: Yup.string().matches(/^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i, "Invalid URL").required('Website is required'),
    description: Yup.string().max(500).optional(),
    status: Yup.mixed().oneOf([CustomerStatus.PENDING, CustomerStatus.VERIFIED, CustomerStatus.REJECTED]).default(CustomerStatus.PENDING)
  });

  const defaultValues = useMemo(() => ({
    name: customer ? customer.name : '',
    phone: customer ? customer.phone : '',
    email: customer ? customer.email : '',
    address: customer ? customer.address : '',
    country: customer ? customer.country : '',
    status: customer ? customer.accountStatus : '',
    age: customer ? customer.age : '',
    zipCode: customer ? customer.zipCode : '',
    web: customer ? customer.web : '',
    description: customer ? customer?.description : '',
  }), [customer])

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: getInitialValues(customer),
    initialValues: defaultValues,
    validationSchema: CustomerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {

        if (customer) {

          if (selectedImage) {
            dispatch(uploadCustomerImage(selectedImage))
              .then((fileUrl) => {
                setSelectedImage(undefined);
                if (fileUrl) {
                  dispatch(updateCustomer(customer._id, {
                    ...values, imageUrl: fileUrl.payload
                  }));
                }
              })
          } else {
            dispatch(updateCustomer(customer._id, {
              ...values,
              imageUrl: customer.imageUrl,
            }));
          }

          resetForm();
        } else {

          if (selectedImage) {
            dispatch(uploadCustomerImage(selectedImage))
              .then((fileUrl) => {
                setSelectedImage(undefined);
                if (fileUrl) {
                  dispatch(createCustomer({
                    ...values, imageUrl: fileUrl.payload
                  }))
                }
              })
          } else {
            dispatch(createCustomer(values))
          }

          resetForm();

        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, resetForm } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 5.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {/* <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>  */}
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {/* first name */}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-first-name">First Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-first-name"
                          placeholder="Enter Customer First Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    {/* end of firts name */}

                   {/* last name */}
                   <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-last-name">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-last-name"
                          placeholder="Enter Customer Last Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>


                    {/* company name */}
                   <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-company-name">Company Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-company-name"
                          placeholder="Enter Customer Company Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>

                    {/* Industry Category */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-industry-category">Industry Category</InputLabel>
                        <Select 
                          labelId='customer-insdustry-category'
                          id='category'
                          placeholder='Select category'
                          {...getFieldProps('status')}
                          onChange={(event) => setFieldValue('category', event.target.value)}
                        >
                          <MenuItem value={'Consulting'}>Consulting</MenuItem>
                          <MenuItem value={'Analyst'}>Analyst</MenuItem>
                          <MenuItem value={'Developer'}>Developer</MenuItem>
                          <MenuItem value={'Qa'}>Quality Assurance</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>


                    {/* address */}
                   <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-address">Address</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-address"
                          placeholder="Enter Customer Adderess"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>

                     {/* phone 1*/}
                     <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-phone 1">Phone Number 1</InputLabel>
                        <TextField
                          fullWidth
                          type='tel'
                          id="customer-phone 1"
                          placeholder="Enter Phone Number 1"
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Stack>
                    </Grid>
                    {/* end of phone */}

                    {/* phone 2*/}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-phone 2">Phone Number 2</InputLabel>
                        <TextField
                          fullWidth
                          type='tel'
                          id="customer-phone 2"
                          placeholder="Enter Phone Number 2"
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Stack>
                    </Grid>
                    {/* end of phone 2*/}


                    {/* email */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          placeholder="Enter Customer Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    {/* end of email */}


                  {/* Priority level */}
                  <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-priority-level">Priority Level</InputLabel>
                        <Select 
                          labelId='customer-priority-level'
                          id='priority'
                          placeholder='Select priority'
                          {...getFieldProps('status')}
                          onChange={(event) => setFieldValue('category', event.target.value)}
                        >
                          <MenuItem value={'Critical'}>Critical</MenuItem>
                          <MenuItem value={'High'}>High</MenuItem>
                          <MenuItem value={'Medium'}>Medium</MenuItem>
                          <MenuItem value={'Low'}>Low</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>

                    {/* Lead owner */}
                  <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="lead-owner">Lead Owner</InputLabel>
                        <Select 
                          labelId='lead-owner'
                          id='leadOwner'
                          placeholder='Select Lead owner'
                          {...getFieldProps('status')}
                          onChange={(event) => setFieldValue('category', event.target.value)}
                        >
                          <MenuItem value={'Mr.X'}>Mr.X</MenuItem>
                          <MenuItem value={'Mr.Y'}>Mr.Y</MenuItem>
                          <MenuItem value={'Mr.Z'}>Mr.Z</MenuItem>
                          <MenuItem value={'Mr.A'}>Mr.A</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>

                    {/* lead creation date */}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="lead-creationdate">Lead Creation Date</InputLabel>
                        <TextField
                          fullWidth
                          type='date'
                          id="lead-creationdate"
                          placeholder="Enter Date"
                          {...getFieldProps('startdate')}
                          error={Boolean(touched.startdate && errors.startdate)}
                          helperText={touched.startdate && errors.startdate}
                        />
                      </Stack>
                    </Grid>


                    {/* Project Type */}
                  <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="project-type">Project Type</InputLabel>
                        <Select 
                          labelId='project-type'
                          id='project-type'
                          placeholder='Select Project Type'
                          {...getFieldProps('status')}
                          onChange={(event) => setFieldValue('category', event.target.value)}
                        >
                          <MenuItem value={'Electrical'}>Electrical</MenuItem>
                          <MenuItem value={'Civil'}>Civil</MenuItem>
                          <MenuItem value={'Robotics'}>Robotics</MenuItem>
                          <MenuItem value={'Network'}>Network</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>

                     {/* project Scope */}
                     <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="budget">Project Scope</InputLabel>
                        <TextField
                          fullWidth
                          id="scope"
                          placeholder="Project Scope"
                          {...getFieldProps('age')}
                          error={Boolean(touched.age && errors.age)}
                          helperText={touched.age && errors.age}
                        />
                      </Stack>
                    </Grid>
                    {/* end of age */}

                    
                    {/* budget */}
                    <Grid item xs={6}>
                      
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="budget">Budget</InputLabel>
                        <TextField
                          fullWidth
                          id="budget"
                          placeholder="Budget Estimate"
                          {...getFieldProps('age')}
                          error={Boolean(touched.age && errors.age)}
                          helperText={touched.age && errors.age}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    {/* end of age */}

                    {/* expected start date */}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="start-date">Expected Start Date</InputLabel>
                        <TextField
                          fullWidth
                          type='date'
                          id="startdate"
                          placeholder="Enter Date"
                          {...getFieldProps('startdate')}
                          error={Boolean(touched.startdate && errors.startdate)}
                          helperText={touched.startdate && errors.startdate}
                        />
                      </Stack>
                    </Grid>

                    {/* expected end date */}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="start-date">Expected Compeltion Date</InputLabel>
                        <TextField
                          fullWidth
                          type='date'
                          id="enddate"
                          placeholder="Enter Date"
                          {...getFieldProps('startdate')}
                          error={Boolean(touched.startdate && errors.startdate)}
                          helperText={touched.startdate && errors.startdate}
                        />
                      </Stack>
                    </Grid>

                  {/* <Grid container spacing={3} >
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-priority-level">Upload File</InputLabel>
                        <SingleFilCustomized />
                        
                      </Stack>
                    </Grid>
                    </Grid> */}

                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {!isCreating && (
                    <Tooltip title="Delete Customer" placement="top">
                      <IconButton onClick={() => deleteHandler(customer)} size="large" color="error">
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {customer ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && <AlertCustomerDelete title={deletingCustomer.name} customerId={deletingCustomer._id} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

AddCustomer.propTypes = {
  customer: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddCustomer;
