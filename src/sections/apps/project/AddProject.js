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
import { ProjectStatus } from 'config';
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
      projectName: project ? project.projectName : '',
      clientName: project ? project.clientName : '',
      asignTo: project ? project.asignTo : '',
      asignBy: project ? project.asignBy : '',
      startDate: project ? new Date(project.startDate) : new Date(),
      endDate: project ? new Date(project.endDate) : null,
      description: project ? project?.description : '',
      status: project ? project?.status : ProjectStatus.PENDING
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
            <DialogTitle>{project ? 'Edit Project' : 'Create Project'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} md={3}>
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
                </Grid> */}
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {/* name */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="project-name">Project Name ( or Lead Name)</InputLabel>
                        <TextField
                          fullWidth
                          id="project-name"
                          placeholder="Enter Project Name"
                          {...getFieldProps('projectName')}
                          error={Boolean(touched.projectName && errors.projectName)}
                          helperText={touched.projectName && errors.projectName}
                        />
                      </Stack>
                    </Grid>
                    {/* end of name */}
                    {/* client name */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="client-name">Contact Name</InputLabel>
                        <TextField
                          fullWidth
                          id="client-name"
                          placeholder="Enter Contact Name"
                          {...getFieldProps('clientName')}
                          error={Boolean(touched.clientName && errors.clientName)}
                          helperText={touched.clientName && errors.clientName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      {/* Project TYPE */}
                      <FormControl fullWidth>
                        <InputLabel htmlFor="project-type-label">Project Type</InputLabel>
                        <Select
                          labelId="project-type"
                          id="project-type"
                          placeholder="Project Type"
                          {...getFieldProps('projectType')}
                          onChange={(event) => setFieldValue('projectType', event.target.value)}
                        >
                          <MenuItem value={'Glass'}>Glass</MenuItem>
                          <MenuItem value={'Electrical'}>Electrical</MenuItem>
                          <MenuItem value={'Building'}>Building</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {/* end of client name */}
                    {/* status */}
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="project-status-label">Status</InputLabel>
                          <Select
                            labelId="project-status"
                            id="column-hiding"
                            placeholder="Status"
                            // displayEmpty
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
                            {Object.values(ProjectStatus).map((column) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.status && errors.status && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.status}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    {/* end of status */}

                    {/* start date */}
                    <Grid item xs={6} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>Start Date</InputLabel>
                        <FormControl sx={{ width: '100%' }} error={Boolean(touched.startDate && errors.startDate)}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              format="dd/MM/yyyy"
                              value={values.startDate}
                              onChange={(newValue) => setFieldValue('startDate', newValue)}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Stack>
                      {touched.startDate && errors.startDate && <FormHelperText error={true}>{errors.startDate}</FormHelperText>}
                    </Grid>
                    {/* end of start date */}

                    {/* end date */}
                    {/* <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>End Date</InputLabel>
                        <FormControl sx={{ width: '100%' }} error={Boolean(touched.endDate && errors.endDate)}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker format="dd/MM/yyyy" value={values.endDate} onChange={(newValue) => setFieldValue('endDate', newValue)} />
                          </LocalizationProvider>
                        </FormControl>
                      </Stack>
                      {touched.endDate && errors.endDate && <FormHelperText error={true}>{errors.endDate}</FormHelperText>}
                    </Grid> */}
                    {/* end of end date */}

                    {/* description */}
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="project-description">Description</InputLabel>
                        <TextField
                          fullWidth
                          id="project-description"
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
                    {/* attachment */}
                    {/* <Grid item xs={12}>
                      <Stack spacing={1.5}>
                        <InputLabel htmlFor="project-attachment">Attachment</InputLabel>
                        <UploadSingleFile setFieldValue={setFieldValue} file={values.files} />
                      </Stack>
                    </Grid> */}
                    {/* end of attachment */}

                    {project?.imageUrl && !values.files && (
                      <img
                        src={project?.imageUrl}
                        style={{
                          width: 'calc(100% - 16px)',
                          height: 'calc(100% - 16px)'
                        }}
                      />
                    )}

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
