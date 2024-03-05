import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import ColorPalette from './ColorPalette';
import IconButton from 'components/@extended/IconButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { createEvent, deleteEvent, updateEvent } from 'store/reducers/calendar';

// assets
import { CalendarOutlined, DeleteFilled } from '@ant-design/icons';

// constant
const getInitialValues = (event, range) => {
  const newEvent = {
    title: '',
    description: '',
    color: '#1890ff',
    textColor: '#fff',
    eventType: '',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date()
  };

  if (event || range) {
    return _.merge({}, newEvent, event);
  }

  return newEvent;
};

// const getInitialValues = (event) => {
//   const newEvent = {
//     title: event ? event.title : '',
//     description: event ? event.description : '',
//     color: '#1890ff',
//     textColor: '#fff',
//     eventType: event ? event.description : '',
//     allDay: false,
//     start: event ? new Date(event.start) : new Date(),
//     end: event ? new Date(event.end) : new Date()
//   };

//   if (event || range) {
//     return _.merge({}, newEvent, event);
//   }

//   return newEvent;
// };

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddEventFrom = ({ event, range, onCancel }) => {
  const theme = useTheme();
  const isCreating = !event;

  const backgroundColor = [
    {
      value: theme.palette.primary.main,
      color: 'primary.main'
    },
    {
      value: theme.palette.error.main,
      color: 'error.main'
    },
    {
      value: theme.palette.success.main,
      color: 'success.main'
    },
    {
      value: theme.palette.secondary.main,
      color: 'secondary.main'
    },
    {
      value: theme.palette.warning.main,
      color: 'warning.main'
    },
    {
      value: theme.palette.primary.lighter,
      color: 'primary.lighter'
    },
    {
      value: theme.palette.error.lighter,
      color: 'error.lighter'
    },
    {
      value: theme.palette.success.lighter,
      color: 'success.lighter'
    },
    {
      value: theme.palette.secondary.lighter,
      color: 'secondary.lighter'
    },
    {
      value: theme.palette.warning.lighter,
      color: 'warning.lighter'
    }
  ];

  const textColor = [
    {
      value: '#fff',
      color: 'white'
    },
    {
      value: theme.palette.error.lighter,
      color: 'error.lighter'
    },
    {
      value: theme.palette.success.lighter,
      color: 'success.lighter'
    },
    {
      value: theme.palette.secondary.lighter,
      color: 'secondary.lighter'
    },
    {
      value: theme.palette.warning.lighter,
      color: 'warning.lighter'
    },
    {
      value: theme.palette.primary.lighter,
      color: 'primary.lighter'
    },
    {
      value: theme.palette.primary.main,
      color: 'primary.main'
    },
    {
      value: theme.palette.error.main,
      color: 'error.main'
    },
    {
      value: theme.palette.success.main,
      color: 'success.main'
    },
    {
      value: theme.palette.secondary.main,
      color: 'secondary.main'
    },
    {
      value: theme.palette.warning.main,
      color: 'warning.main'
    }
  ];

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    // description: Yup.string().max(5000),
    end: Yup.date().when('start', (start, schema) => start && schema.min(start, 'End date must be later than start date')),
    start: Yup.date()
    // color: Yup.string().max(255),
    // textColor: Yup.string().max(255)
  });

  const deleteHandler = () => {
    dispatch(deleteEvent(event?._id));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Event deleted successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  const formik = useFormik({
    initialValues: getInitialValues(event, range),
    validationSchema: EventSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        const newEvent = {
          title: values.title,
          description: values.description,
          color: values.color,
          eventType: values.eventType,
          textColor: values.textColor,
          allDay: values.allDay,
          start: values.start,
          end: values.end
        };

        if (event) {
          dispatch(updateEvent(event._id, newEvent));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Event update successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          dispatch(createEvent(newEvent));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Event add successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              {/* title */}
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-title">Title</InputLabel>
                  <TextField
                    fullWidth
                    id="cal-title"
                    placeholder="Title"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Stack>
              </Grid>

              {/* event Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="event-type-label">Event Type</InputLabel>
                  <Select
                    labelId="event-type"
                    id="event-type"
                    placeholder="Event Type"
                    {...getFieldProps('eventType')}
                    onChange={(event) => setFieldValue('eventType', event.target.value)}
                  >
                    <MenuItem value={'Call'}>Call</MenuItem>
                    <MenuItem value={'Email'}>Email</MenuItem>
                    <MenuItem value={'Meeting'}>Meeting</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* description */}
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-description">Description</InputLabel>
                  <TextField
                    fullWidth
                    id="cal-description"
                    multiline
                    rows={3}
                    placeholder="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>
              </Grid>

              {/* All day */}
              <Grid item xs={12}>
                <FormControlLabel control={<Switch checked={values.allDay} {...getFieldProps('allDay')} />} label="All day" />
              </Grid>

              {/* start date */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-start-date">Start Date</InputLabel>
                  <MobileDateTimePicker
                    value={new Date(values.start)}
                    format="dd/MM/yyyy hh:mm a"
                    onChange={(date) => setFieldValue('start', date)}
                    slotProps={{
                      textField: {
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                              <CalendarOutlined />
                            </InputAdornment>
                          )
                        }
                      }
                    }}
                  />
                  {touched.start && errors.start && <FormHelperText error={true}>{errors.start}</FormHelperText>}
                </Stack>
              </Grid>

              {/* End date */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-end-date">End Date</InputLabel>
                  <MobileDateTimePicker
                    value={new Date(values.end)}
                    format="dd/MM/yyyy hh:mm a"
                    onChange={(date) => setFieldValue('end', date)}
                    slotProps={{
                      textField: {
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                              <CalendarOutlined />
                            </InputAdornment>
                          )
                        }
                      }
                    }}
                  />
                  {touched.end && errors.end && <FormHelperText error={true}>{errors.end}</FormHelperText>}
                </Stack>
              </Grid>

              {/* background color */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Background Color</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-label="color"
                        {...getFieldProps('color')}
                        onChange={(e) => setFieldValue('color', e.target.value)}
                        name="color-radio-buttons-group"
                        sx={{ '& .MuiFormControlLabel-root': { mr: 2 } }}
                      >
                        {backgroundColor.map((item, index) => (
                          <ColorPalette key={index} value={item.value} color={item.color} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* text color */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Text Color</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="textColor"
                        {...getFieldProps('textColor')}
                        onChange={(e) => setFieldValue('textColor', e.target.value)}
                        name="text-color-radio-buttons-group"
                        sx={{ '& .MuiFormControlLabel-root': { mr: 2 } }}
                      >
                        {textColor.map((item, index) => (
                          <ColorPalette key={index} value={item.value} color={item.color} />
                        ))}
                      </RadioGroup>
                    </FormControl>
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
                  <Tooltip title="Delete Event" placement="top">
                    <IconButton onClick={deleteHandler} size="large" color="error">
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
                    {event ? 'Edit' : 'Add'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

AddEventFrom.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func
};

export default AddEventFrom;
