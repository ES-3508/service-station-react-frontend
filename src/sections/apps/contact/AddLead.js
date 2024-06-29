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
  Typography,
  InputAdornment
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertLeadDelete from './AlertLeadDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, CaretRightOutlined, DeleteFilled } from '@ant-design/icons';
import { deleteLead, updateLead, uploadLeadImage } from 'store/reducers/leads';
import { createLead } from 'store/reducers/leads';
import { createContact, updateContact } from 'store/reducers/contact';

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddLead = ({ lead, onCancel }) => {
  const [openAlert, setOpenAlert] = useState(false);

  // const { uploadedImageUrl } = useSelector((state) => state.leads);

  const [deletingLead, setDeletingLead] = useState({
    _id: null,
    name: ''
  });

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const theme = useTheme();
  const isCreating = !lead;

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    console.log(lead, 'lead //////////////////////////////////////////');
    if (lead) {
      setAvatar(lead.imageUrl);
    }
  }, [lead]);

  const deleteHandler = async (lead) => {
    setDeletingLead({
      _id: lead._id,
      name: lead.name
    });
    setOpenAlert(true);
  };

  const LeadSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    phone1: Yup.string().matches(/^\+?[0-9]+$/, 'Phone number must contain only numeric characters and may start with a "+" sign'),
    phone2: Yup.string().matches(/^\+?[0-9]+$/, 'Phone number must contain only numeric characters and may start with a "+" sign'),
    email: Yup.string().email('Invalid email address')
  });

  const defaultValues = useMemo(
    () => ({
      firstName: lead?.firstName || '',
      lastName: lead?.lastName || '',
      company: lead?.company || '',
      address: lead?.address || '',
      phone1: lead?.phone1 || '',
      phone2: lead?.phone2 || '',
      email: lead?.email || ''
    }),
    [lead]
  );

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: getInitialValues(lead),
    initialValues: defaultValues,
    validationSchema: LeadSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('submit lead', values);
        if (lead) {
          if (selectedImage) {
            dispatch(uploadLeadImage(selectedImage)).then((fileUrl) => {
              setSelectedImage(undefined);
              if (fileUrl) {
                dispatch(
                  updateContact(lead._id, {
                    ...values,
                    imageUrl: fileUrl.payload
                  })
                );
              }
            });
          } else {
            dispatch(
              updateContact(lead._id, {
                ...values,
                imageUrl: lead.imageUrl
              })
            );
          }

          resetForm();
        } else {
          if (selectedImage) {
            dispatch(uploadLeadImage(selectedImage)).then((fileUrl) => {
              setSelectedImage(undefined);
              if (fileUrl) {
                dispatch(
                  createContact({
                    ...values,
                    imageUrl: fileUrl.payload
                  })
                );
              }
            });
          } else {
            console.log('create values ', values);
            dispatch(createContact(values));
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
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <DialogTitle sx={{ fontSize: 32, p: 3.5 }}>{lead ? 'Edit Contact' : 'Create Contact'}</DialogTitle>
              </Grid>
              {/* <Grid item>
                {lead && (
                    <Button variant="contained" color="primary" size="small" sx={{marginRight:'20px'}}>
                    Convert to Project  <CaretRightOutlined/>
                  </Button>
                )}
                
              </Grid> */}
            </Grid>
            <Divider />
            <DialogContent sx={{ pt: 0.8 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}></Grid>

                {/* ===================================+++++++++++++++++++++++++++++++++++++++++++++++++++++++++================================         */}
                <DialogTitle>Contact information </DialogTitle>

                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {/* first name */}
                    <Grid item xs={12} sm={6}>
                      {/* <Stack spacing={1.25}> */}
                      <FormControl fullWidth>
                        <TextField
                          id="firstName"
                          label="First Name"
                          // placeholder="1st LEG VOYAGE"
                          {...getFieldProps('firstName')}
                          onChange={(event) => setFieldValue('firstName', event.target.value)}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </FormControl>
                    </Grid>

                    {/* last name */}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="customer-last-name">Last Name</InputLabel> */}
                        <TextField
                          label="Last Name"
                          fullWidth
                          id="lead-last-name"
                          placeholder="Enter Customer Last Name"
                          {...getFieldProps('lastName')}
                          // error={Boolean(touched.lastName && errors.lastName)}
                          // helperText={touched.lastName && errors.lastName}
                        />
                      </Stack>
                    </Grid>

                    {/* phone 1*/}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="customer-phone 1">Phone Number 1</InputLabel> */}
                        <TextField
                          label="Phone Number 1"
                          fullWidth
                          type="tel"
                          id="lead-phone 1"
                          placeholder="Enter Phone Number 1"
                          {...getFieldProps('phone1')}
                          error={Boolean(touched.phone1 && errors.phone1)}
                          helperText={touched.phone1 && errors.phone1}
                        />
                      </Stack>
                    </Grid>

                    {/* phone 2*/}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="lead-phone 2">Phone Number 2</InputLabel> */}
                        <TextField
                          label="Phone Number 2"
                          fullWidth
                          type="tel"
                          id="lead-phone 2"
                          placeholder="Enter Phone Number 2"
                          {...getFieldProps('phone2')}
                          error={Boolean(touched.phone2 && errors.phone2)}
                          helperText={touched.phone2 && errors.phone2}
                        />
                      </Stack>
                    </Grid>

                    {/* email*/}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="lead-email">Email</InputLabel> */}
                        <TextField
                          label="Email"
                          fullWidth
                          id="lead-email"
                          placeholder="Enter Customer Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>

                    {/* address */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="lead-address">Address</InputLabel> */}
                        <TextField
                          label="Address"
                          fullWidth
                          id="lead-address"
                          placeholder="Enter lead Adderess"
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                    </Grid>

                    {/* company name */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="customer-company-name">Company Name</InputLabel> */}
                        <TextField
                          label="Company Name"
                          fullWidth
                          id="customer-company-name"
                          placeholder="Enter Customer Company Name"
                          {...getFieldProps('company')}
                          error={Boolean(touched.company && errors.company)}
                          helperText={touched.company && errors.company}
                        />
                      </Stack>
                    </Grid>

                    {/* Industry Category */}
                  </Grid>
                </Grid>
                {/* end of contact information */}
              </Grid>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {!isCreating && (
                    <Tooltip title="Delete Lead" placement="top">
                      <IconButton onClick={() => deleteHandler(lead)} size="large" color="error">
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
                      {lead ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && (
        <AlertLeadDelete title={deletingLead.name} leadId={deletingLead._id} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
};

AddLead.propTypes = {
  lead: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddLead;
