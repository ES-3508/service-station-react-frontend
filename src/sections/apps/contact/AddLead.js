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
import {  deleteLead, updateLead, uploadLeadImage } from 'store/reducers/leads';
import { createLead } from 'store/reducers/leads';

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
    console.log(lead,'lead //////////////////////////////////////////')
    if (lead) {
      setAvatar(lead.imageUrl);
    }
  }, [lead])

  const deleteHandler = async (lead) => {
    setDeletingLead({
      _id: lead._id,
      name: lead.name
    })
    setOpenAlert(true)
  }

  const LeadSchema = Yup.object().shape({
    // priorityLevel: Yup.string(),
    // companyType: Yup.string(),
    // leadOwner: Yup.string(),
    // startDate: Yup.date(),
    // endDate: Yup.date()
    //   .when(
    //     'startDate',
    //     (date, schema) => date && schema.min(date, "End date can't be before start date")
    //   )
    //   .nullable(),
    // contactInformation: Yup.object().shape({
    //   firstName: Yup.string().required('First Name is required'),
    //   lastName: Yup.string().required('Last Name is required'),
    //   surName: Yup.string(),
    //   company: Yup.string(),
    //   companyNumber: Yup.string(),
    //   industry: Yup.string(),
    //   address: Yup.string(),
    //   phone1: Yup.string(),
    //   phone2: Yup.string(),
    //   email: Yup.string().email('Incorrect email address'),
    // }),
    // descriptionInformation: Yup.array().of(
    //   Yup.object().shape({
    //     note: Yup.string(),
    //     // fileName: Yup.string(),
    //     files: Yup.mixed(),
    //     // Remove createdBy, updatedBy, createdAt, and updatedAt
    //   })
    // ),

    // projectType: Yup.string(),
    // projectSize: Yup.string(),
    // currency: Yup.string(),
    // budgetEstimate: Yup.string(),
    // expectedStart: Yup.date(),
    // expectedCompletion: Yup.date()
    //   .when(
    //     'expectedStart',
    //     (date, schema) => date && schema.min(date, "End date can't be before start date")
    //   )
    //   .nullable(),
  });

  const defaultValues  = useMemo(
    () => ({
      priorityLevel: lead?.priorityLevel || '',
      companyType: lead?.companyType || '',
      leadOwner: lead?.leadOwner || '',

      startDate: lead?.startDate ? new Date(lead.startDate) : new Date(),
      endDate: lead?.endDate ? new Date(lead.endDate) : new Date(),
      contactInformation: {
        firstName: lead?.contactInformation?.firstName || '',
        lastName: lead?.contactInformation?.lastName || '',
        company: lead?.contactInformation?.company || '',
        companyNumber: lead?.contactInformation?.companyNumber || '',
        industry: lead?.contactInformation?.industry || '',
        address: lead?.contactInformation?.address || '',
        phone1: lead?.contactInformation?.phone1 || '',
        phone2: lead?.contactInformation?.phone2 || '',
        email: lead?.contactInformation?.email || '',
      },

      projectType: lead?.projectType || '',
      projectSize: lead?.projectSize || '',
      budgetEstimate: lead?.budgetEstimate || '',
      currency: lead ? lead.currency : '',
      expectedStart: lead?.expectedStart
        ? new Date(lead.expectedStart)
        : new Date(),
      expectedCompletion: lead?.expectedCompletion
        ? new Date(lead.expectedCompletion)
        : null,

      // descriptionInformation: [
      //   {
      //     note: lead?.descriptionInformation[0].note || '',
      //     // fileName: lead?.descriptionInformation[0].fileName || '',
      //     files: lead?.descriptionInformation[0].files || false,
      //   },
      // ],
      // document: lead?.document || false,
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

        if (lead) {

          if (selectedImage) {
            dispatch(uploadLeadImage(selectedImage))
              .then((fileUrl) => {
                setSelectedImage(undefined);
                if (fileUrl) {
                  dispatch(updateLead(lead._id, {
                    ...values, imageUrl: fileUrl.payload
                  }));
                }
              })
          } else {
            dispatch(updateLead(lead._id, {
              ...values,
              imageUrl: lead.imageUrl,
            }));
          }

          resetForm();
        } else {

          if (selectedImage) {
            dispatch(uploadLeadImage(selectedImage))
              .then((fileUrl) => {
                setSelectedImage(undefined);
                if (fileUrl) {
                  dispatch(createLead({
                    ...values, imageUrl: fileUrl.payload
                  }))
                }
              })
          } else {
            console.log('create values ', values )
            dispatch(createLead(values))
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
                <DialogTitle sx={{ fontSize: 32, p: 3.5 }}>{lead ? 'View Contact' : 'Create Contact'}</DialogTitle>
              </Grid>
              <Grid item>
                {lead && (
                    <Button variant="contained" color="primary" size="small" sx={{marginRight:'20px'}}>
                    Convert to Project  <CaretRightOutlined/>
                  </Button>
                )}
                
              </Grid>
            </Grid>
            <Divider />
            <DialogContent sx={{ pt: 0.8 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}> 
                </Grid>

                {/* ===================================+++++++++++++++++++++++++++++++++++++++++++++++++++++++++================================         */}
                <DialogTitle>Contact information </DialogTitle> 

                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {/* first name */}
                    <Grid item xs={12} sm={6}>
                      
                      {/* <Stack spacing={1.25}> */}
                        <FormControl fullWidth>
                        <TextField
                          id="firstName"
                          label="First Name"
                          // placeholder="1st LEG VOYAGE"
                          {...getFieldProps('contactInformation.firstName')}
                          onChange={(event) => setFieldValue('contactInformation.firstName', event.target.value)}
                        />
                      </FormControl>
                        
                    </Grid>

                   {/* last name */}
                   <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="customer-last-name">Last Name</InputLabel> */}
                        <TextField
                        label='Last Name'
                          fullWidth
                          id="lead-last-name"
                          placeholder="Enter Customer Last Name"
                          {...getFieldProps('contactInformation.lastName')}
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
                          label='Phone Number 1'
                          fullWidth
                          type='tel'
                          id="lead-phone 1"
                          placeholder="Enter Phone Number 1"
                          {...getFieldProps('contactInformation.phone1')}
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
                          label='Phone Number 2'
                          fullWidth
                          type='tel'
                          id="lead-phone 2"
                          placeholder="Enter Phone Number 2"
                          {...getFieldProps('contactInformation.phone')}
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
                          label='Email'
                          fullWidth
                          id="lead-email"
                          placeholder="Enter Customer Email"
                          {...getFieldProps('contactInformation.email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>


                    {/* company name */}
                   <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="customer-company-name">Company Name</InputLabel> */}
                        <TextField
                        label='Company Name'
                          fullWidth
                          id="customer-company-name"
                          placeholder="Enter Customer Company Name"
                          {...getFieldProps('contactInformation.company')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                   </Grid>

                   {/* address */}
                   <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        {/* <InputLabel htmlFor="lead-address">Address</InputLabel> */}
                        <TextField
                          label='Address'
                          fullWidth
                          id="lead-address"
                          placeholder="Enter lead Adderess"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                   </Grid>

                    {/* Industry Category */}
                    

                    <Grid item xs={12} sm={6}>                   
                      <FormControl fullWidth>
                        <InputLabel htmlFor="customer-industry-category">Industry Category</InputLabel>
                        <Select
                          labelId="contactInformation.industry"
                          id="contactInformation.industry"
                          placeholder="Industry Category"
                          {...getFieldProps('contactInformation.industry')}
                          onChange={(event) => setFieldValue('contactInformation.industry', event.target.value)}
                        >
                          <MenuItem value={'Consulting'}>Consulting</MenuItem>
                            <MenuItem value={'Analyst'}>Analyst</MenuItem>
                            <MenuItem value={'Developer'}>Developer</MenuItem>
                            <MenuItem value={'Quality Assurance'}>Quality Assurance</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                          {/* Industry Category end */}
                    
                    {/* project type for create             */}
                    {!lead &&(
                      <>
                        <Grid item xs={6} sm={6}>
                        
                        {/* Project TYPE */}
                        <FormControl fullWidth>
                          <InputLabel htmlFor="project-type-label">Project TYPE</InputLabel>
                          <Select
                            labelId="project-type"
                            id="project-type"
                            placeholder="Project Type"
                            {...getFieldProps('projectType')}
                            onChange={(event) => setFieldValue('projectType', event.target.value)}
                          >
                            <MenuItem value={'Electrical'}>Electrical</MenuItem>
                            <MenuItem value={'Civil'}>Civil</MenuItem>
                            <MenuItem value={'Robotics'}>Robotics</MenuItem>
                            <MenuItem value={'Network'}>Network</MenuItem>
                          </Select>
                        </FormControl>
                        </Grid>
                        
                      </>
                      
                      )}

                    

                    

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
      {!isCreating && <AlertLeadDelete title={deletingLead.name} leadId={deletingLead._id} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

AddLead.propTypes = {
  lead: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddLead;
