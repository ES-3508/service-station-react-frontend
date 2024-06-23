import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

// project imports
import IconButton from 'components/@extended/IconButton';

import { dispatch } from 'store';

// assets
import { DeleteFilled } from '@ant-design/icons';
import UploadSingleFile from 'components/third-party/dropzone/SingleFile';
import UploadAvatar from 'components/third-party/dropzone/Avatar';
import { ProjectStatuses } from '../../../config';
import { createProject, getProjectAttachment, updateProject, uploadProjectAttachment } from 'store/reducers/projects';
import AlertProjectDelete from './AlertProjectDelete';

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

const AddProject = ({ project, onCancel }) => {
  const [openAlert, setOpenAlert] = useState(false);

  const [deletingProject, setDeletingProject] = useState({
    _id: null,
    name: ''
  });

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const isCreating = !project;

  const deleteHandler = async (project) => {
    setDeletingProject({
      _id: project._id,
      name: project.projectName
    });
    setOpenAlert(true);
  };

  const ProjectSchema = Yup.object().shape({
    projectName: Yup.string().max(255).required('Project name is required')
    // clientName: Yup.string().max(255).required('Client name is required'),
    // asignTo: Yup.string().max(255)
    //   .optional(),
    // // .required('Assigned persion is required').default(""),
    // asignBy: Yup.string().max(255).optional(),
    // // .required('Assigned by person is required').default(""),
    // startDate: Yup.date().required('Start date is required'),
    // endDate: Yup
    //   .date()
    //   .when('startDate', (date, schema) => date && schema.min(date, "End date can't be before start date"))
    //   .nullable()
    //   .required('End date is required'),
    // description: Yup.string().max(500).optional(),
    // files: Yup.mixed().optional(),
    // status: Yup.mixed().oneOf([ProjectStatus.PENDING, ProjectStatus.VERIFIED, ProjectStatus.REJECTED]).default(ProjectStatus.PENDING)
  });

  const defaultValues = useMemo(
    () => ({
      projectType:project ? project.projectType:' ',
      projectName: project ? project.projectName : '',
      // clientName: project ? project.clientName : (lead?.contactInformation?.firstName + ' ' + lead?.contactInformation?.lastName ),
      asignTo: project ? project.asignTo : '',
      asignBy: project ? project.asignBy : '',
      startDate: project ? new Date(project.startDate) : new Date(),
      endDate: project ? new Date(project.endDate) : null,
      description: project ? project?.description : '',
      status: project ? project?.status : ProjectStatuses.PENDING
    }),
    [project]
  );

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: getInitialValues(customer),
    initialValues: defaultValues,
    validationSchema: ProjectSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (project) {
          if (values.files) {
            dispatch(uploadProjectAttachment(values.files[0])).then((fileUrl) => {
              if (fileUrl) {
                dispatch(
                  updateProject(project._id, {
                    ...values,
                    imageUrl: fileUrl.payload
                  })
                );
              }
            });
          } else {
            dispatch(
              updateProject(project._id, {
                ...values,
                imageUrl: project.imageUrl
              })
            );
          }

          resetForm();
        } else {
          if (values.files) {
            dispatch(uploadProjectAttachment(values.files[0])).then((fileUrl) => {
              if (fileUrl) {
                dispatch(
                  createProject({
                    ...values,
                    imageUrl: fileUrl.payload
                  })
                );
              }
            });
          } else {
            dispatch(createProject(values));
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, resetForm, values } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{project ? 'Edit Service' : 'Create Service'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {/* Service Date */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="service-date">Service Date</InputLabel>
                        <FormControl sx={{ width: '100%' }} error={Boolean(touched.serviceDate && errors.serviceDate)}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              format="dd/MM/yyyy"
                              value={values.serviceDate}
                              onChange={(newValue) => setFieldValue('serviceDate', newValue)}
                            />
                          </LocalizationProvider>
                        </FormControl>
                        {touched.serviceDate && errors.serviceDate && <FormHelperText error={true}>{errors.serviceDate}</FormHelperText>}
                      </Stack>
                    </Grid>
                    {/* Next Service Date */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="next-service-date">Next Service Date</InputLabel>
                        <FormControl sx={{ width: '100%' }} error={Boolean(touched.nextServiceDate && errors.nextServiceDate)}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              format="dd/MM/yyyy"
                              value={values.nextServiceDate}
                              onChange={(newValue) => setFieldValue('nextServiceDate', newValue)}
                            />
                          </LocalizationProvider>
                        </FormControl>
                        {touched.nextServiceDate && errors.nextServiceDate && <FormHelperText error={true}>{errors.nextServiceDate}</FormHelperText>}
                      </Stack>
                    </Grid>
                    {/* Note */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="note">Note</InputLabel>
                        <TextField
                          fullWidth
                          id="note"
                          multiline
                          rows={2}
                          placeholder="Enter Note"
                          {...getFieldProps('note')}
                          error={Boolean(touched.note && errors.note)}
                          helperText={touched.note && errors.note}
                        />
                      </Stack>
                    </Grid>
                    {/* Services */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="services">Services</InputLabel>
                        <TextField
                          fullWidth
                          id="services"
                          placeholder="Enter Services (Comma separated)"
                          {...getFieldProps('services')}
                          error={Boolean(touched.services && errors.services)}
                          helperText={touched.services && errors.services}
                        />
                      </Stack>
                    </Grid>
                    {/* Service Charge */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="service-charge">Service Charge</InputLabel>
                        <TextField
                          fullWidth
                          id="service-charge"
                          placeholder="Enter Service Charge"
                          {...getFieldProps('serviceCharge')}
                          error={Boolean(touched.serviceCharge && errors.serviceCharge)}
                          helperText={touched.serviceCharge && errors.serviceCharge}
                        />
                      </Stack>
                    </Grid>
                    {/* Item List */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="item-list">Item List</InputLabel>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              id="item-name"
                              placeholder="Item Name"
                              {...getFieldProps('itemList.name')}
                              error={Boolean(touched.itemList?.name && errors.itemList?.name)}
                              helperText={touched.itemList?.name && errors.itemList?.name}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              id="item-qty"
                              placeholder="Quantity"
                              {...getFieldProps('itemList.qty')}
                              error={Boolean(touched.itemList?.qty && errors.itemList?.qty)}
                              helperText={touched.itemList?.qty && errors.itemList?.qty}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              id="item-price"
                              placeholder="Price"
                              {...getFieldProps('itemList.price')}
                              error={Boolean(touched.itemList?.price && errors.itemList?.price)}
                              helperText={touched.itemList?.price && errors.itemList?.price}
                            />
                          </Grid>
                        </Grid>
                      </Stack>
                    </Grid>
                    {/* Total Price */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="total-price">Total Price</InputLabel>
                        <TextField
                          fullWidth
                          id="total-price"
                          placeholder="Enter Total Price"
                          {...getFieldProps('totalPrice')}
                          error={Boolean(touched.totalPrice && errors.totalPrice)}
                          helperText={touched.totalPrice && errors.totalPrice}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {!isCreating && (
                    <Tooltip title="Delete Project" placement="top">
                      <IconButton onClick={() => deleteHandler(project)} size="large" color="error">
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
                      {project ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && (
        <AlertProjectDelete title={deletingProject.name} projectId={deletingProject._id} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
};

AddProject.propTypes = {
  project: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddProject;
