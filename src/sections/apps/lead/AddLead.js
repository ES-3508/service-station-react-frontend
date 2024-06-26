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
  InputAdornment,
  Dialog
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
import { CameraOutlined, CaretRightOutlined, DeleteFilled, RetweetOutlined } from '@ant-design/icons';
import { deleteLead, updateLead, uploadLeadImage } from 'store/reducers/leads';
import { createLead } from 'store/reducers/leads';
import ConvertToProject from './ConvertToProject';

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

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    onCancel();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
    contactInformation: Yup.object().shape({
      firstName: Yup.string().required('First Name is required'),
      //   lastName: Yup.string().required('Last Name is required'),
      //   surName: Yup.string(),
      //   company: Yup.string(),
      //   companyNumber: Yup.string(),
      //   industry: Yup.string(),
      //   address: Yup.string(),
      phone1: Yup.string().matches(/^\+?[0-9]+$/, 'Phone number must contain only numeric characters and may start with a "+" sign'),
      phone2: Yup.string().matches(/^\+?[0-9]+$/, 'Phone number must contain only numeric characters and may start with a "+" sign'),
      email: Yup.string().email('Invalid email address')
    })
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

  const defaultValues = useMemo(
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
        email: lead?.contactInformation?.email || ''
      },

      projectType: lead?.projectType || 'Glass',
      projectSize: lead?.projectSize || '',
      budgetEstimate: lead?.budgetEstimate || '',
      currency: lead ? lead.currency : 'GBP',
      expectedStart: lead?.expectedStart ? new Date(lead.expectedStart) : new Date(),
      expectedCompletion: lead?.expectedCompletion ? new Date(lead.expectedCompletion) : null

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
            dispatch(uploadLeadImage(selectedImage)).then((fileUrl) => {
              setSelectedImage(undefined);
              if (fileUrl) {
                dispatch(
                  updateLead(lead._id, {
                    ...values,
                    imageUrl: fileUrl.payload
                  })
                );
              }
            });
          } else {
            dispatch(
              updateLead(lead._id, {
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
                  createLead({
                    ...values,
                    imageUrl: fileUrl.payload
                  })
                );
              }
            });
          } else {
            console.log('create values ', values);
            dispatch(createLead(values));
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
      <DialogTitle sx={{ fontSize: 32, p: 3.5 }}>{lead ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
    </Grid>
    <Grid item>
      {lead && (
        <Button variant="contained" color="primary" size="small" sx={{ marginRight: '20px' }} onClick={handleOpenModal}>
          Convert to Project {' '}
        </Button>
      )}
    </Grid>
  </Grid>
  <Divider />
  <DialogContent sx={{ pt: 0.8 }}>
    <Grid container spacing={1}>
      <Grid item xs={12}></Grid>
      <DialogTitle sx={{ marginTop: '10px' }}>Vehicle Information</DialogTitle>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {/* Number Plate */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                id="numberPlate"
                label="Number Plate"
                {...getFieldProps('vehicleInformation.numberPlate')}
                onChange={(event) => setFieldValue('vehicleInformation.numberPlate', event.target.value)}
                error={Boolean(touched.vehicleInformation?.numberPlate && errors.vehicleInformation?.numberPlate)}
                helperText={touched.vehicleInformation?.numberPlate && errors.vehicleInformation?.numberPlate}
              />
            </FormControl>
          </Grid>

          {/* Manufacturer */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                id="manufacturer"
                label="Manufacturer"
                {...getFieldProps('vehicleInformation.manufacturer')}
                onChange={(event) => setFieldValue('vehicleInformation.manufacturer', event.target.value)}
                error={Boolean(touched.vehicleInformation?.manufacturer && errors.vehicleInformation?.manufacturer)}
                helperText={touched.vehicleInformation?.manufacturer && errors.vehicleInformation?.manufacturer}
              />
            </FormControl>
          </Grid>

          {/* Model */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                id="model"
                label="Model"
                {...getFieldProps('vehicleInformation.model')}
                onChange={(event) => setFieldValue('vehicleInformation.model', event.target.value)}
                error={Boolean(touched.vehicleInformation?.model && errors.vehicleInformation?.model)}
                helperText={touched.vehicleInformation?.model && errors.vehicleInformation?.model}
              />
            </FormControl>
          </Grid>

          {/* Manufacture Year */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                id="manufactureYear"
                label="Manufacture Year"
                type="number"
                {...getFieldProps('vehicleInformation.manufactureYear')}
                onChange={(event) => setFieldValue('vehicleInformation.manufactureYear', event.target.value)}
                error={Boolean(touched.vehicleInformation?.manufactureYear && errors.vehicleInformation?.manufactureYear)}
                helperText={touched.vehicleInformation?.manufactureYear && errors.vehicleInformation?.manufactureYear}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Dialog open={openModal} onClose={handleCloseModal}>
      <ConvertToProject lead={lead} onCancel={handleCloseModal} />
    </Dialog>
  </DialogContent>
  <Divider />
  <DialogActions sx={{ p: 2.5 }}>
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        {!isCreating && (
          <Tooltip title="Delete Vehicle" placement="top">
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
