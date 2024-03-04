import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import {
  Button,
  Checkbox,
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
import { DeleteFilled, WarningOutlined } from '@ant-design/icons';
import UploadSingleFile from 'components/third-party/dropzone/SingleFile';
import UploadAvatar from 'components/third-party/dropzone/Avatar';
import { ProjectStatuses } from 'config';
import { createProject, getProjectAttachment, updateProject, uploadProjectAttachment } from 'store/reducers/projects';
import { Box } from '@mui/system';

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const ConvertToProject = ({ lead, onCancel }) => {
  const [openAlert, setOpenAlert] = useState(false);

  const [deletingProject, setDeletingProject] = useState({
    _id: null,
    name: ''
  });

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const isCreating = !lead;

  const ProjectSchema = Yup.object().shape({
    projectName: Yup.string().max(255).required('Project name is required')
  });

  const defaultValues = useMemo(
    () => ({
      projectName: lead ? lead?.contactInformation?.firstName + ' ' + lead?.contactInformation?.lastName : '',
      clientName: lead ? lead.clientName : '',
      asignTo: lead ? lead.asignTo : '',
      asignBy: lead ? lead.asignBy : '',
      startDate: lead ? new Date(lead.startDate) : new Date(),
      endDate: lead ? new Date(lead.endDate) : null,
      description: lead ? lead?.description : '',
      projectStatus: lead ? lead?.projectStatus : ProjectStatuses.PENDING,
      projectType: lead ? lead?.projectType : ''
    }),
    [lead]
  );

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: getInitialValues(customer),
    initialValues: defaultValues,
    validationSchema: ProjectSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!lead) {
          if (values.files) {
            dispatch(uploadProjectAttachment(values.files[0])).then((fileUrl) => {
              if (fileUrl) {
                dispatch(
                  updateProject(lead._id, {
                    ...values,
                    imageUrl: fileUrl.payload
                  })
                );
              }
            });
          } else {
            dispatch(
              createProject({
                ...values,
                imageUrl: fileUrl.payload
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
  const [edit, setEdit] = useState(false);

  const handleToggle = () => {
    setEdit(!edit);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{lead ? 'Convert To Project' : 'Create Project'}</DialogTitle>
            <Divider />

            <DialogContent sx={{ p: 2.5 }}>
              <Box sx={{ minWidth: '600px' }}></Box>
              <Typography sx={{ fontSize: 'calc(14px + 1px)' }}>
                <Grid container spacing={1}>
                  <Grid item xs={1} space>
                    <WarningOutlined sx={{ fontSize: '1.5rem' }} />
                  </Grid>
                  <Grid item xs={11}>
                    The Lead <span style={{ fontWeight: 'bold' }}>{lead?.contactInformation?.firstName}</span>{' '}
                    <span style={{ fontWeight: 'bold' }}>{lead?.contactInformation?.lastName}</span>
                    {','} will be converted to a new project.
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={11}>
                    The Project name will be as <span style={{ fontWeight: 'bold' }}>{lead?.contactInformation?.firstName}</span>{' '}
                    <span style={{ fontWeight: 'bold' }}>{lead?.contactInformation?.lastName}</span>.
                  </Grid>
                </Grid>

                <br />
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {' '}
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Button
                        onClick={handleToggle}
                        sx={{
                          padding: '0', // Adjust the padding to control the size of the button
                          minWidth: 'auto' // Adjust the minimum width to reduce the space around the Checkbox
                        }}
                      >
                        <Checkbox checked={edit} />
                      </Button>
                    </Grid>
                    <Grid item>
                      <InputLabel sx={{}}>Change Project name and details</InputLabel>
                    </Grid>
                  </Grid>
                </Grid>
                {edit && (
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
                            <MenuItem value={'Electrical'}>Electrical</MenuItem>
                            <MenuItem value={'Civil'}>Civil</MenuItem>
                            <MenuItem value={'Robotics'}>Robotics</MenuItem>
                            <MenuItem value={'Network'}>Network</MenuItem>
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
                              onChange={(event) => setFieldValue('projectStatus', event.target.value)}
                              input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                              renderValue={(selected) => {
                                if (!selected) {
                                  return <Typography variant="subtitle1">Select Status</Typography>;
                                }

                                return <Typography variant="subtitle2">{selected}</Typography>;
                              }}
                            >
                              {Object.values(ProjectStatuses).map((column) => (
                                <MenuItem key={column} value={column}>
                                  <ListItemText primary={column} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched.projectStatus && errors.projectStatus && (
                            <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                              {errors.projectStatus}
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

                      {lead?.imageUrl && !values.files && (
                        <img
                          src={lead?.imageUrl}
                          style={{
                            width: 'calc(100% - 16px)',
                            height: 'calc(100% - 16px)'
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item></Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" variant='outlined' onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Convert
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

ConvertToProject.propTypes = {
  lead: PropTypes.any,
  onCancel: PropTypes.func
};

export default ConvertToProject;
