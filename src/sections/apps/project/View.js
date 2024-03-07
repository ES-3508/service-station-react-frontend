// material-ui
import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  styled,
  useMediaQuery
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import * as yup from 'yup';
import parse from 'html-react-parser';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// assets
import { AimOutlined, DeleteFilled, EnvironmentOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import AutocompleteForms from 'sections/forms/validation/AutoCompleteForm';
import GoogleMapAutocomplete from 'sections/forms/validation/google-map-autocomplete';
import { useFormik } from 'formik';
import { Box } from '@mui/system';
import ChipSelect from 'sections/components-overview/select/ChipSelect';
import React, { useEffect, useMemo, useState } from 'react';
import { PopupTransition } from 'components/@extended/Transitions';
import AddNote from './AddNote';
import { useParams } from 'react-router';
import { useSelector } from 'store';
import { dispatch } from 'store';
import { getLeads, uploadLeadImage, uploadUserDocuments } from 'store/reducers/leads';

import IconButton from 'components/@extended/IconButton';
import { getProjects, updateProject, updateProjectStatus, uploadProjectAttachment } from 'store/reducers/projects';
import AlertDeletenote from './AlertDeleteNote';
// import ConvertToProject from './ConvertToProject';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabLead = () => {
  const { id } = useParams();
  console.log('proj id', id);
  // const { leads: leads } = useSelector((state) => state.leads);

  const {
    projects: { projects, total },
    action
  } = useSelector((state) => state.projects);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    // onCancel();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const selectedLead = projects.find((lead) => lead._id === id);

  useEffect(() => {
    dispatch(getProjects());
  }, [action]);

  console.log('selected project', selectedLead);
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const fileInput = React.useRef(null);
  const roles = ['User', 'Admin', 'Staff', 'Manager'];

  const skills = ['Java', 'HTML', 'Bootstrap', 'JavaScript', 'NodeJS', 'React', 'Angular', 'CI'];

  const filter = createFilterOptions();
  const filterSkills = createFilterOptions();

  const validationSchema = yup.object({
    role: yup
      .string()
      .trim()
      .required('Role selection is required')
      .matches(/^[a-z\d\-/#_\s]+$/i, 'Only alphanumerics are allowed')
      .max(50, 'Role must be at most 50 characters'),
    skills: yup
      .array()
      .of(
        yup
          .string()
          .trim()
          .required('Leading spaces found in your tag')
          .matches(/^[a-z\d\-/#.&_\s]+$/i, 'Only alphanumerics are allowed')
          .max(50, 'Skill tag field must be at most 50 characters')
      )
      .required('Skill selection is required')
      .min(3, 'Skill tags field must have at least 3 items')
      .max(15, 'Please select a maximum of 15 skills.')
  });

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  });

  const [selectedValues, setSelectedValues] = useState({
    survey: selectedLead? selectedLead.projectStatus?.survey : '',
    framesOrdered: selectedLead? selectedLead.projectStatus?.framesOrdered : '',
    glassOrdered: selectedLead? selectedLead.projectStatus?.glassOrdered : '',
    orderComplete: selectedLead? selectedLead.projectStatus?.orderComplete : '',
    inProduction: selectedLead? selectedLead.projectStatus?.inProduction : '',
    delivery: selectedLead? selectedLead.projectStatus?.delivery : '',
    installationDate: selectedLead? selectedLead.projectStatus?.installationDate : '',
    dispatchInvoicePaid: selectedLead? selectedLead.projectStatus?.dispatchInvoicePaid : '',
    installersRemidailWorks: selectedLead? selectedLead.projectStatus?.installersRemidailWorks : '',
    complete: selectedLead? selectedLead.projectStatus?.complete : '',
  });

  const handleUpdateProject = async (projectId, values) => {
    console.log("up values", values);
    try {
      await dispatch(updateProjectStatus(projectId, values)); // Dispatch the updateProject action with projectId and values
    } catch (error) {
      console.error(error);
      // Handle errors if any
    }
  };

  const handleChange = (event, fieldName) => {
    const updatedValues = {
      ...selectedValues,
      [fieldName]: event.target.value
    };
    setSelectedValues(updatedValues);
    handleUpdateProject(id, updatedValues);
  };

  // Define a function to get background color based on selected value
  const getBackgroundColor = (fieldName) => {
    switch (selectedValues[fieldName]) {
      case 'Started':
        return '#c62e51';
      case 'Paused':
        return '#d59143';
      case 'Done':
        return '#5cb554';
      default:
        return '#e0e0e0';
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    console.log('file', file);
    if (file) {
      console.log('filr>>>', file);
      dispatch(uploadProjectAttachment({ leadId: selectedLead._id, file: file, schemaName: 'project' })); // Dispatch the uploadLeadImage thunk with the selected file
    }
  };

  const [addNote, setAddNote] = useState(false);
  const handleAddNote = () => {
    setAddNote(!addNote);
  };

  const [deletingFile, setDeletingFile] = useState({
    leadId: null,
    fileId: null
  });

  const [deletingNote, setDeletingNote] = useState({
    leadId: null,
    noteId: null
  });

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(!open);
  };

  const defaultValues = useMemo(
    () => ({
      role: '',
      skills: [],
      survey: selectedLead? selectedLead.projectStatus?.survey : '',
      framesOrdered: selectedLead? selectedLead.projectStatus?.framesOrdered : '',
      glassOrdered: selectedLead? selectedLead.projectStatus?.glassOrdered : '',
      orderComplete: selectedLead? selectedLead.projectStatus?.orderComplete : '',
      inProduction: selectedLead? selectedLead.projectStatus?.inProduction : '',
      delivery: selectedLead? selectedLead.projectStatus?.delivery : '',
      installationDate: selectedLead? selectedLead.projectStatus?.installationDate : '',
      dispatchInvoicePaid: selectedLead? selectedLead.projectStatus?.dispatchInvoicePaid : '',
      installersRemidailWorks: selectedLead? selectedLead.projectStatus?.installersRemidailWorks : '',
      complete: selectedLead? selectedLead.projectStatus?.complete : '',
    }),[selectedLead]
  );

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        
      } catch (error) {
        console.error(error);
      }
    }
  });

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: defaultValues,
  //   onSubmit: async (values, {setSubmitting}) => {

  //   }
  // })

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={7}>
          <Grid item xs={11}>
            <Typography variant="h2">{selectedLead?.projectName}</Typography>
          </Grid>
          <Grid item xs={1} sx={{ textAlign: 'right', paddingRight: '2x' }}>
            <Button variant="contained" color="secondary" size="small">
              Message
            </Button>
          </Grid>
          {/* <Grid item xs={1} sm={1}></Grid> */}
          <Grid item xs={12} sm={12}>
            <Grid container columnGap={0.5}>
              <Grid item xs={12} lg={1.2} paddingBottom={2}>
                <Grid item xs={12} sx={{ backgroundColor: 'black' }} borderRadius={2} padding={2}>
                  <Typography variant="h5" sx={{ color: 'white' }} textAlign="center">
                    Pre-Booking
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                    Survey
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel
                      htmlFor="project-type-label"
                      sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                    >
                      Status
                    </InputLabel>
                    <Select
                      sx={{ height: '70px', position: 'relative', backgroundColor: getBackgroundColor('survey'), borderRadius: '8px' }}
                      labelId="project-type-lable"
                      id="project-type"
                      placeholder="Status"
                      value={selectedValues.survey}
                      onChange={(event) => handleChange(event, 'survey')}

                      // {...getFieldProps('projectType')}
                      // onChange={(event) => setFieldValue('projectType', event.target.value)}
                    >
                      <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                        Started
                      </MenuItem>
                      <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                        Paused
                      </MenuItem>
                      <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                        Done
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item xs={12} lg={6} paddingBottom={2}>
                <Grid item xs={12} sx={{ backgroundColor: 'black' }} borderRadius={2} padding={2}>
                  <Typography variant="h5" sx={{ color: 'white' }} textAlign="center">
                    Fulfillment
                  </Typography>
                </Grid>
                <Grid container spacing={0.5} xs={12}>
                  <Grid item xs={12} lg={2.4}>
                    <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                      Frames Ordered
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{
                          height: '70px',
                          position: 'relative',
                          backgroundColor: getBackgroundColor('framesOrdered'),
                          borderRadius: '8px'
                        }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.framesOrdered}
                        onChange={(event) => handleChange(event, 'framesOrdered')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={2.4}>
                    <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                      Glass Ordered
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{
                          height: '70px',
                          position: 'relative',
                          backgroundColor: getBackgroundColor('glassOrdered'),
                          borderRadius: '8px'
                        }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.glassOrdered}
                        onChange={(event) => handleChange(event, 'glassOrdered')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={2.4}>
                    <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                      Order Complete
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{
                          height: '70px',
                          position: 'relative',
                          backgroundColor: getBackgroundColor('orderComplete'),
                          borderRadius: '8px'
                        }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.orderComplete}
                        onChange={(event) => handleChange(event, 'orderComplete')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={2.4}>
                    <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                      In Production
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{ height: '70px', position: 'relative', backgroundColor: getBackgroundColor('inProduction'), borderRadius: '8px' }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.inProduction}
                        onChange={(event) => handleChange(event, 'inProduction')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={2.4}>
                    <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                      Delivery
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{ height: '70px', position: 'relative', backgroundColor: getBackgroundColor('delivery'), borderRadius: '8px' }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.delivery}
                        onChange={(event) => handleChange(event, 'delivery')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} lg={4.7} paddingBottom={2}>
                <Grid item xs={12} sx={{ backgroundColor: 'black' }} borderRadius={2} padding={2}>
                  <Typography variant="h5" sx={{ color: 'white' }} textAlign="center">
                    Followup
                  </Typography>
                </Grid>
                <Grid container spacing={0.5} xs={12}>
                  <Grid item xs={12} lg={3}>
                    <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                      Installation Date
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{
                          height: '70px',
                          position: 'relative',
                          backgroundColor: getBackgroundColor('installationDate'),
                          borderRadius: '8px'
                        }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.installationDate}
                        onChange={(event) => handleChange(event, 'installationDate')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={3}>
                    <Typography paddingBottom={1} paddingTop={2.2} variant="h5" textAlign="center">
                      Dispatch Invoice Paid
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{ height: '70px', position: 'relative', backgroundColor: getBackgroundColor('dispatchInvoicePaid'), borderRadius: '8px' }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.dispatchInvoicePaid}
                        onChange={(event) => handleChange(event, 'dispatchInvoicePaid')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={3}>
                    <Typography paddingBottom={1} paddingTop={2.2} variant="h5" textAlign="center">
                      Installers Remidail Works
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{ height: '70px', position: 'relative', backgroundColor: getBackgroundColor('installersRemidailWorks'), borderRadius: '8px' }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.installersRemidailWorks}
                        onChange={(event) => handleChange(event, 'installersRemidailWorks')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={3}>
                    <Typography paddingBottom={3} paddingTop={3.1} variant="h5" textAlign="center">
                      Complete
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="project-type-label"
                        sx={{ position: 'absolute', top: '20%', background: 'transparent !important' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        sx={{ height: '70px', position: 'relative', backgroundColor: getBackgroundColor('complete'), borderRadius: '8px' }}
                        labelId="project-type"
                        id="project-type"
                        placeholder="Status"
                        value={selectedValues.complete}
                        onChange={(event) => handleChange(event, 'complete')}
                        // {...getFieldProps('projectType')}
                        // onChange={(event) => setFieldValue('projectType', event.target.value)}
                      >
                        <MenuItem value={'Started'} sx={{ backgroundColor: '#c62e51', color: 'white' }}>
                          Started
                        </MenuItem>
                        <MenuItem value={'Paused'} sx={{ backgroundColor: '#d59143', color: 'white' }}>
                          Paused
                        </MenuItem>
                        <MenuItem value={'Done'} sx={{ backgroundColor: '#5cb554', color: 'white' }}>
                          Done
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid container spacing={3} paddingTop={3}>
              

              

              
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      <Stack padding={5} width="100%" alignItems="center">
        <Grid item xs={12} sm={7} md={8} xl={9} width="inherit">
          <Grid container spacing={3}>
            {/* <Grid item xs={12}>
              <MainCard title="Task">
                <Typography color="secondary"></Typography>
              </MainCard>
            </Grid> */}

            <Grid item xs={12}>
              <MainCard title="Notes" sx={{ position: 'relative' }}>
                <Grid item xs={1}>
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', right: '15px', top: '15px' }}
                    startIcon={<PlusOutlined />}
                    onClick={handleAddNote}
                  >
                    {' '}
                    Add Note{' '}
                  </Button>

                  <Dialog
                    maxWidth="sm"
                    TransitionComponent={PopupTransition}
                    keepMounted
                    fullWidth
                    onClose={handleAddNote}
                    open={addNote}
                    sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <AddNote lead={selectedLead} onCancel={handleAddNote} />
                  </Dialog>
                </Grid>
                {selectedLead?.leadNote?.map((note, index) => (
                  // <Grid item xs={12} key={index} width="100%">
                  <>
                    <Card
                      key={index}
                      sx={{
                        maxWidth: '100%',
                        width: '100%',
                        padding: '10px',
                        boxShadow: 'none',
                        borderBottom: 'solid 1px',
                        borderColor: '#dbdbdb',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography>
                        {parse(note.note)}
                        {/* {note.note} */}
                      </Typography>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        // sx={{ position: 'absolute', right: '15px', top: '15px' }}
                        // startIcon={<PlusOutlined />}
                        onClick={() => {
                          setDeletingNote({
                            leadId: selectedLead?._id,
                            noteId: note._id
                          });
                          handleClose();
                        }}
                      >
                        Remove Note
                      </Button>
                    </Card>
                    {deletingNote.noteId && (
                      <AlertDeletenote
                        title={deletingNote?.noteId?.createdBy}
                        deletingNote={deletingNote}
                        open={open}
                        type={'notedelete'}
                        handleClose={handleClose}
                      />
                    )}
                  </>
                ))}
              </MainCard>
            </Grid>

            <Grid item xs={12}>
              <MainCard title="Files" sx={{ position: 'relative' }}>
                <Grid item xs={1}>
                  {/* <Button variant="text" color='primary'  size="small" sx={{position: 'absolute', right:'15px', top: '15px'}} startIcon={<PlusOutlined />} onClick={() => fileInput.current.click()}> Add File </Button> */}
                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    tabIndex={-1}
                    startIcon={<PlusOutlined />}
                    sx={{ position: 'absolute', right: '15px', top: '15px' }}
                  >
                    Upload file
                    {/* <VisuallyHiddenInput type="file" /> */}
                    <input type="file" onChange={handleFileInputChange} style={{ display: 'none' }} ref={fileInput} />
                  </Button>
                </Grid>
                {selectedLead?.leadFiles?.map((file, index) => (
                  <>
                    <Card
                      key={index}
                      sx={{
                        maxWidth: '100%',
                        width: '100%',
                        padding: '10px',
                        boxShadow: 'none',
                        borderBottom: 'solid 1px',
                        borderColor: '#dbdbdb',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Link
                        href={file.fileUrl}
                        target="_blank"
                        sx={{
                          ':hover': {
                            textDecoration: 'underline',
                            color: 'black' // Set the color to black on hover
                          }
                        }}
                      >
                        <Typography>{file.fileName}</Typography>
                      </Link>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => {
                          setDeletingFile({
                            leadId: selectedLead?._id,
                            fileId: file._id
                          });
                          handleClose();
                        }}
                      >
                        Remove File
                      </Button>
                    </Card>
                    {deletingFile.fileId && (
                      <AlertDeletenote
                        title={deletingFile?.fileId?.createdBy}
                        deletingFile={deletingFile}
                        open={open}
                        type={'filedelete'}
                        handleClose={handleClose}
                      />
                    )}
                  </>
                ))}
              </MainCard>
            </Grid>

            {/* <Grid item xs={12}>
              <MainCard title="Date and Location">
                <GoogleMapAutocomplete />
              </MainCard>
            </Grid> */}
            <Grid item xs={12}>
              { false && (
                <MainCard title="Tags">
                <Autocomplete
                  id="skills"
                  multiple
                  fullWidth
                  autoHighlight
                  freeSolo
                  disableCloseOnSelect
                  options={skills}
                  value={formik.values.skills}
                  onBlur={formik.handleBlur}
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => {
                    const jobExist = skills.includes(newValue[newValue.length - 1]);
                    if (!jobExist) {
                      formik.setFieldValue('skills', newValue);
                    } else {
                      formik.setFieldValue('skills', newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filterSkills(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push(inputValue);
                    }

                    return filtered;
                  }}
                  renderOption={(props, option) => {
                    return (
                      <Box component="li" {...props}>
                        {!skills.some((v) => option.includes(v)) ? `Add "${option}"` : option}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="skills"
                      placeholder="Write your skills"
                      error={formik.touched.skills && Boolean(formik.errors.skills)}
                      // helperText={TagsError}
                    />
                  )}
                />
                {/* <Dialog open={openModal} onClose={handleCloseModal}>
                  <ConvertToProject lead={selectedLead} onCancel={handleCloseModal} />
                </Dialog> */}
              </MainCard>
              )}
              
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default TabLead;
