// material-ui
import {
  Autocomplete,
    Button,
    Chip,
    Divider,
    Grid,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    Stack,
    TextField,
    Typography,
    createFilterOptions,
    useMediaQuery
  } from '@mui/material';
  
  // third-party
  import { PatternFormat } from 'react-number-format';
  import * as yup from 'yup';
  // project import
  import MainCard from 'components/MainCard';
  import Avatar from 'components/@extended/Avatar';
  import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
  
  // assets
  import { AimOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import AutocompleteForms from 'sections/forms/validation/AutoCompleteForm';
import GoogleMapAutocomplete from 'sections/forms/validation/google-map-autocomplete';
import { useFormik } from 'formik';
import { Box } from '@mui/system';
import ChipSelect from 'sections/components-overview/select/ChipSelect';
  
  const avatarImage = require.context('assets/images/users', true);
  
  // ==============================|| ACCOUNT PROFILE - BASIC ||============================== //
  
  const TabLead = () => {

    const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    onCancel();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    
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

    const formik = useFormik({
      initialValues: {
        role: '',
        skills: []
      },
      validationSchema,
      onSubmit: () => {
        // dispatch(
        //   openSnackbar({
        //     open: true,
        //     message: 'Autocomplete - Submit Success',
        //     variant: 'alert',
        //     alert: {
        //       color: 'success'
        //     },
        //     close: false
        //   })
        // );
      }
    });
    return (
      <Grid container spacing={3}>
        <Grid item xs={9}></Grid>
            <Grid item xs={3}>
            <Chip color="success" label="Active" size="medium" variant="light"  sx={{marginRight:'10px'}}/>
              <Button variant="contained" color='primary'  size="small" > Convert to Project  </Button>
            </Grid>
        <Grid item xs={12} sm={5} md={4} xl={3}>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>

              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {/* <Stack direction="row" justifyContent="flex-end">
                      <Chip label="Pro" size="small" color="primary" />
                    </Stack> */}
                   <Stack spacing={2.5} alignItems="center">
                       {/* <Avatar alt="Avatar 1" size="xl" src={avatarImage(`./default.png`)} /> */}
                      <Stack spacing={0.5} alignItems="center">
                        <Typography variant="h5">Anshan H.</Typography>
                        
                        <Typography color="secondary">Company Name</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                      <ListItem>
                        <ListItemIcon>
                          <MailOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">anshan.dh81@gmail.com</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">(+1-876) 8654 239 581</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AimOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">New York</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <EnvironmentOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href="https://google.com" target="_blank">
                            https://anshan.dh.url
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            {/* <Grid item xs={12}>
              <MainCard title="Skills">
                <Grid container spacing={1.25}>
                  <Grid item xs={6}>
                    <Typography color="secondary">Junior</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LinearWithLabel value={30} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="secondary">UX Reseacher</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LinearWithLabel value={80} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="secondary">Wordpress</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LinearWithLabel value={90} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="secondary">HTML</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LinearWithLabel value={30} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="secondary">Graphic Design</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LinearWithLabel value={95} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="secondary">Code Style</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LinearWithLabel value={75} />
                  </Grid>
                </Grid>
              </MainCard>
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={7} md={8} xl={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainCard title="Task">
                <Typography color="secondary">
                 </Typography>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard title="Files">
                
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard title="Notes">
                
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard title="Date and Location">
                <GoogleMapAutocomplete/>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
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
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  
  export default TabLead;
  