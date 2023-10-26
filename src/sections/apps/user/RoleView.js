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
import { useEffect } from 'react';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| CUSTOMER - VIEW ||============================== //

const RoleView = ({ data }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    console.log(data);
  }, [])

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2.5} alignItems="center">
                      <Stack spacing={0.5} alignItems="center">
                        <Typography variant="h5">{data.name}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
              <Stack spacing={2.5}>
                <MainCard title="Permissions">
                  <List sx={{ py: 0 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={0.5}>
                                <Typography color="secondary">Permission</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Stack spacing={0.5}>
                                <Typography color="secondary">View</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Stack spacing={0.5}>
                                <Typography color="secondary">Write</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Stack spacing={0.5}>
                                <Typography color="secondary">Update</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Stack spacing={0.5}>
                                <Typography color="secondary">Delete</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    { data.rolePermissions.map(permission => (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={0.5}>
                                    <Typography>{ permission.permission.name }</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Stack spacing={0.5}>
                                    <Typography>
                                        <Typography>{ permission.read ? 'True' : 'False' }</Typography>
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Stack spacing={0.5}>
                                    <Typography>
                                        <Typography>{ permission.create ? 'True' : 'False' }</Typography>
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Stack spacing={0.5}>
                                    <Typography>
                                        <Typography>{ permission.update ? 'True' : 'False' }</Typography>
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Stack spacing={0.5}>
                                    <Typography>
                                        <Typography>{ permission.delete ? 'True' : 'False' }</Typography>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    ))}
                  </List>
                </MainCard>
              </Stack>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

RoleView.propTypes = {
  data: PropTypes.object
};

export default RoleView;
