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

  const { uploadedImageUrl } = useSelector((state) => state.customers);

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
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
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
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    {/* name */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-name"
                          placeholder="Enter Customer Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    {/* end of name */}
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
                    {/* phone */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-phone">Phone Number</InputLabel>
                        <TextField
                          fullWidth
                          type='tel'
                          id="customer-phone"
                          placeholder="Enter Phone Number"
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Stack>
                    </Grid>
                    {/* end of phone */}
                    {/* age */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-age">Age</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-age"
                          placeholder="Enter Age"
                          {...getFieldProps('age')}
                          error={Boolean(touched.age && errors.age)}
                          helperText={touched.age && errors.age}
                        />
                      </Stack>
                    </Grid>
                    {/* end of age */}
                    {/* status */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-status">Status</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('status')}
                            onChange={(event) => setFieldValue('status', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">Select Status</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {Object.values(CustomerStatus).map((column) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.orderStatus && errors.orderStatus && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.orderStatus}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    {/* end of status */}
                    {/* address */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-address">Address</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-address"
                          multiline
                          rows={2}
                          placeholder="Enter Address"
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                    </Grid>
                    {/* end of address */}
                    {/* country */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-country">Country</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-country"
                          placeholder="Enter Country"
                          {...getFieldProps('country')}
                          error={Boolean(touched.country && errors.country)}
                          helperText={touched.country && errors.country}
                        />
                      </Stack>
                    </Grid>
                    {/* end of country */}
                    {/* zip code */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-zip-code">Zip Code</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-zip-code"
                          placeholder="Enter Zip Code"
                          {...getFieldProps('zipCode')}
                          error={Boolean(touched.zipCode && errors.zipCode)}
                          helperText={touched.zipCode && errors.zipCode}
                        />
                      </Stack>
                    </Grid>
                    {/* end of zip code */}
                    {/* web */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-web">Website</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-web"
                          placeholder="Enter Website"
                          {...getFieldProps('web')}
                          error={Boolean(touched.web && errors.web)}
                          helperText={touched.web && errors.web}
                        />
                      </Stack>
                    </Grid>
                    {/* end of web */}
                    {/* description */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-description">Description</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-description"
                          multiline
                          rows={2}
                          placeholder="Enter Description"
                          {...getFieldProps('description')}
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                        />
                      </Stack>
                    </Grid>
                    {/* end of description */}
                    {/* bottom content */}
                    {/* <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1">Make Contact Info Public</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Means that anyone viewing your profile will be able to see your contacts details
                          </Typography>
                        </Stack>
                        <FormControlLabel control={<Switch defaultChecked sx={{ mt: 0 }} />} label="" labelPlacement="start" />
                      </Stack>
                      <Divider sx={{ my: 2 }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1">Available to hire</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Toggling this will let your teammates know that you are available for acquiring new projects
                          </Typography>
                        </Stack>
                        <FormControlLabel control={<Switch sx={{ mt: 0 }} />} label="" labelPlacement="start" />
                      </Stack>
                    </Grid> */}
                    {/* end of bottom content */}
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
