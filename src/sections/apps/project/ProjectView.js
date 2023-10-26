import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Grid,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';

// assets
import { EnvironmentOutlined, LinkOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import {format, parseISO} from "date-fns";

const avatarImage = require.context('assets/images/users', true);

// ==============================|| CUSTOMER - VIEW ||============================== //

const ProjectView = ({ data }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  console.log('ProjectView', data);

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
              <MainCard>
                <Chip
                  label={data.status}
                  size="small"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    fontSize: '0.675rem'
                  }}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2.5} alignItems="center">
                      <Avatar alt="Avatar 1" size="xl" src={data.imageUrl} />
                      <Stack spacing={0.5} alignItems="center">
                        <Typography variant="h5">{data.projectName}</Typography>
                        <Typography color="secondary">Client: {data.clientName}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  {/*<Grid item xs={12}>*/}
                  {/*  <Divider />*/}
                  {/*</Grid>*/}
                  {/*<Grid item xs={12}>*/}
                  {/*  <Stack direction="row" justifyContent="space-around" alignItems="center">*/}
                  {/*    <Stack spacing={0.5} alignItems="center">*/}
                  {/*      <Typography variant="h5">{data.age}</Typography>*/}
                  {/*      <Typography color="secondary">Age</Typography>*/}
                  {/*    </Stack>*/}
                  {/*    <Divider orientation="vertical" flexItem />*/}
                  {/*    <Stack spacing={0.5} alignItems="center">*/}
                  {/*      <Typography variant="h5">{99}%</Typography>*/}
                  {/*      <Typography color="secondary">Progress</Typography>*/}
                  {/*    </Stack>*/}
                  {/*    <Divider orientation="vertical" flexItem />*/}
                  {/*    <Stack spacing={0.5} alignItems="center">*/}
                  {/*      <Typography variant="h5">{'3M'}</Typography>*/}
                  {/*      <Typography color="secondary">Visits</Typography>*/}
                  {/*    </Stack>*/}
                  {/*  </Stack>*/}
                  {/*</Grid>*/}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    {/*<List component="nav" aria-label="main mailbox folders" sx={{ py: 0 }}>*/}
                    {/*  <ListItem>*/}
                    {/*    <ListItemIcon>*/}
                    {/*      <MailOutlined />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemSecondaryAction>*/}
                    {/*      <Typography align="right">{data.email}</Typography>*/}
                    {/*    </ListItemSecondaryAction>*/}
                    {/*  </ListItem>*/}
                    {/*  <ListItem>*/}
                    {/*    <ListItemIcon>*/}
                    {/*      <PhoneOutlined />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemSecondaryAction>*/}
                    {/*      <Typography align="right">*/}
                    {/*        <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={data.phone} />*/}
                    {/*      </Typography>*/}
                    {/*    </ListItemSecondaryAction>*/}
                    {/*  </ListItem>*/}
                    {/*  <ListItem>*/}
                    {/*    <ListItemIcon>*/}
                    {/*      <EnvironmentOutlined />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemSecondaryAction>*/}
                    {/*      <Typography align="right">{data.country}</Typography>*/}
                    {/*    </ListItemSecondaryAction>*/}
                    {/*  </ListItem>*/}
                    {/*  <ListItem>*/}
                    {/*    <ListItemIcon>*/}
                    {/*      <LinkOutlined />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemSecondaryAction>*/}
                    {/*      <Link align="right" href="https://google.com" target="_blank">*/}
                    {/*        {data.web}*/}
                    {/*      </Link>*/}
                    {/*    </ListItemSecondaryAction>*/}
                    {/*  </ListItem>*/}
                    {/*</List>*/}
                    <img src={data.imageUrl} alt={data.projectName} style={{width: '100%', height: 'auto', objectFit: 'contain'}} />
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
              <Stack spacing={2.5}>
                <MainCard title="Project Details">
                  <List sx={{ py: 0 }}>
                    <ListItem>
                      <Grid container spacing={3}>
                        {/*<Grid item xs={12} md={6}>*/}
                        {/*  <Stack spacing={0.5}>*/}
                        {/*    <Typography color="secondary">Full Name</Typography>*/}
                        {/*    <Typography>{data.name}</Typography>*/}
                        {/*  </Stack>*/}
                        {/*</Grid>*/}
                        <Stack direction='row' spacing={3} alignItems={'center'} mt={2}>
                          <Stack direction={'column'} alignItems={'center'}>
                            <Typography variant={'caption'}>Start Date</Typography>
                            <Typography>{format(parseISO(data.startDate), "M/d/yyyy")}</Typography>
                          </Stack>
                          <Typography>&#8594;</Typography>
                          <Stack direction={'column'} alignItems={'center'}>
                            <Typography variant={'caption'}>End Date</Typography>
                            <Typography>{format(parseISO(data.endDate), "M/d/yyyy")}</Typography>
                          </Stack>
                        </Stack>
                        {/* <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Father Name</Typography>
                            <Typography>
                              Mr. {data.firstName} {data.lastName}
                            </Typography>
                          </Stack>
                        </Grid> */}
                      </Grid>
                    </ListItem>
                    {/*<ListItem divider={!matchDownMD}>*/}
                    {/*  <Grid container spacing={3}>*/}
                    {/*    <Grid item xs={12} md={6}>*/}
                    {/*      <Stack spacing={0.5}>*/}
                    {/*        <Typography color="secondary">Country</Typography>*/}
                    {/*        <Typography>{data.country}</Typography>*/}
                    {/*      </Stack>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item xs={12} md={6}>*/}
                    {/*      <Stack spacing={0.5}>*/}
                    {/*        <Typography color="secondary">Zip Code</Typography>*/}
                    {/*        <Typography>*/}
                    {/*          /!* <PatternFormat displayType="text" format="### ###" mask="_" defaultValue={data.zipCode} /> *!/*/}
                    {/*          <Typography>{data.zipCode}</Typography>*/}
                    {/*        </Typography>*/}
                    {/*      </Stack>*/}
                    {/*    </Grid>*/}
                    {/*  </Grid>*/}
                    {/*</ListItem>*/}
                    {/*<ListItem>*/}
                    {/*  <Stack spacing={0.5}>*/}
                    {/*    <Typography color="secondary">Address</Typography>*/}
                    {/*    <Typography>{data.address}</Typography>*/}
                    {/*  </Stack>*/}
                    {/*</ListItem>*/}
                  </List>
                </MainCard>
                {data?.description && (
                  <MainCard title="Description">
                    <Typography color="secondary">
                      {data?.description}
                    </Typography>
                  </MainCard>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

ProjectView.propTypes = {
  data: PropTypes.object
};

export default ProjectView;
