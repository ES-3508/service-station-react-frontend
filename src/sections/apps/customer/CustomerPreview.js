import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import {
  useMediaQuery,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Tooltip
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import AddCustomer from './AddCustomer';
import AlertCustomerDelete from './AlertCustomerDelete';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { PopupTransition } from 'components/@extended/Transitions';
import ListCard from './exportpdf/ListCard';

// assets
import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';

// const avatarImage = require.context('assets/images/users', true);


const StatusCell = ({ value }) => {
  switch (value) {
    case 'Rejected':
      return <Chip color="error" label="Rejected" size="small" variant="light" />;
    case 'Verified':
      return <Chip color="success" label="Verified" size="small" variant="light" />;
    case 'Pending':
    default:
      return <Chip color="info" label="Pending" size="small" variant="light" />;
  }
};
// ==============================|| CUSTOMER - CARD PREVIEW ||============================== //

export default function CustomerPreview({ customer, open, onClose }) {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [openAlert, setOpenAlert] = useState(false);

  const [add, setAdd] = useState(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  const handleClose = () => {
    setOpenAlert(!openAlert);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ '& .MuiDialog-paper': { width: 1024, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } } }}
      >
        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }}>
          <DialogTitle sx={{ px: 0 }}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    {/*<Tooltip title="Export">*/}
                    {/*  <PDFDownloadLink document={<ListCard customer={customer} />} fileName={`Customer-${customer.fatherName}.pdf`}>*/}
                    {/*    <IconButton color="secondary">*/}
                    {/*      <DownloadOutlined />*/}
                    {/*    </IconButton>*/}
                    {/*  </PDFDownloadLink>*/}
                    {/*</Tooltip>*/}
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={handleAdd}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" onClick={handleClose}>
                      <IconButton color="error">
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              >
                <ListItemAvatar sx={{ mr: 0.75 }}>
                  <Avatar alt={customer.name} size="lg" src={customer?.imageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="h5">{customer.name}{' '} {StatusCell(customer.accountStatus)}</Typography>}
                  secondary={<Typography color="secondary">{customer.email}</Typography>}
                />
              </ListItem>
            </List>
          </DialogTitle>
          <DialogContent dividers sx={{ px: 0 }}>
            <SimpleBar sx={{ height: 'calc(100vh - 290px)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8} xl={9}>
                  <Grid container spacing={2.25}>
                    <Grid item xs={12}>
                      <MainCard title="About me">
                        <Typography>
                          {customer?.description}
                        </Typography>
                      </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                      <MainCard title="Contact Details">
                        <List sx={{ py: 0 }}>
                          <ListItem>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Address</Typography>
                                  <Typography>{customer.address} {customer.zipCode}</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Country</Typography>
                                  <Typography>{customer.country}</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          {/*<ListItem divider>*/}
                          {/*  <Grid container spacing={matchDownMD ? 0.5 : 3}>*/}
                          {/*    <Grid item xs={12} md={6}>*/}
                          {/*      <Stack spacing={0.5}>*/}
                          {/*        <Typography color="secondary">Email Address</Typography>*/}
                          {/*        <Typography>{customer.email}</Typography>*/}
                          {/*      </Stack>*/}
                          {/*    </Grid>*/}
                          {/*    <Grid item xs={12} md={6}>*/}
                          {/*      <Stack spacing={0.5}>*/}
                          {/*        <Typography color="secondary"></Typography>*/}
                          {/*        <Typography>Imperial College London</Typography>*/}
                          {/*      </Stack>*/}
                          {/*    </Grid>*/}
                          {/*  </Grid>*/}
                          {/*</ListItem>*/}
                          {/*<ListItem>*/}
                          {/*  <Grid container spacing={matchDownMD ? 0.5 : 3}>*/}
                          {/*    <Grid item xs={12} md={6}>*/}
                          {/*      <Stack spacing={0.5}>*/}
                          {/*        <Typography color="secondary">School (Year)</Typography>*/}
                          {/*        <Typography>2009-2011</Typography>*/}
                          {/*      </Stack>*/}
                          {/*    </Grid>*/}
                          {/*    <Grid item xs={12} md={6}>*/}
                          {/*      <Stack spacing={0.5}>*/}
                          {/*        <Typography color="secondary">Institute</Typography>*/}
                          {/*        <Typography>School of London, England</Typography>*/}
                          {/*      </Stack>*/}
                          {/*    </Grid>*/}
                          {/*  </Grid>*/}
                          {/*</ListItem>*/}
                        </List>
                      </MainCard>
                    </Grid>
                    {/*<Grid item xs={12}>*/}
                    {/*  <MainCard title="Emplyment">*/}
                    {/*    <List sx={{ py: 0 }}>*/}
                    {/*      <ListItem divider>*/}
                    {/*        <Grid container spacing={matchDownMD ? 0.5 : 3}>*/}
                    {/*          <Grid item xs={12} md={6}>*/}
                    {/*            <Stack spacing={0.5}>*/}
                    {/*              <Typography color="secondary">Senior UI/UX designer (Year)</Typography>*/}
                    {/*              <Typography>2019-Current</Typography>*/}
                    {/*            </Stack>*/}
                    {/*          </Grid>*/}
                    {/*          <Grid item xs={12} md={6}>*/}
                    {/*            <Stack spacing={0.5}>*/}
                    {/*              <Typography color="secondary">Job Responsibility</Typography>*/}
                    {/*              <Typography>*/}
                    {/*                Perform task related to project manager with the 100+ team under my observation. Team management is key*/}
                    {/*                role in this company.*/}
                    {/*              </Typography>*/}
                    {/*            </Stack>*/}
                    {/*          </Grid>*/}
                    {/*        </Grid>*/}
                    {/*      </ListItem>*/}
                    {/*      <ListItem>*/}
                    {/*        <Grid container spacing={matchDownMD ? 0.5 : 3}>*/}
                    {/*          <Grid item xs={12} md={6}>*/}
                    {/*            <Stack spacing={0.5}>*/}
                    {/*              <Typography color="secondary">Trainee cum Project Manager (Year)</Typography>*/}
                    {/*              <Typography>2017-2019</Typography>*/}
                    {/*            </Stack>*/}
                    {/*          </Grid>*/}
                    {/*          <Grid item xs={12} md={6}>*/}
                    {/*            <Stack spacing={0.5}>*/}
                    {/*              <Typography color="secondary">Job Responsibility</Typography>*/}
                    {/*              <Typography>Team management is key role in this company.</Typography>*/}
                    {/*            </Stack>*/}
                    {/*          </Grid>*/}
                    {/*        </Grid>*/}
                    {/*      </ListItem>*/}
                    {/*    </List>*/}
                    {/*  </MainCard>*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={12}>*/}
                    {/*  <MainCard title="Skills">*/}
                    {/*    <Box*/}
                    {/*      sx={{*/}
                    {/*        display: 'flex',*/}
                    {/*        flexWrap: 'wrap',*/}
                    {/*        listStyle: 'none',*/}
                    {/*        p: 0.5,*/}
                    {/*        m: 0*/}
                    {/*      }}*/}
                    {/*      component="ul"*/}
                    {/*    >*/}
                    {/*      {customer.skills.map((skill, index) => (*/}
                    {/*        <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>*/}
                    {/*          <Chip color="secondary" variant="outlined" size="small" label={skill} />*/}
                    {/*        </ListItem>*/}
                    {/*      ))}*/}
                    {/*    </Box>*/}
                    {/*  </MainCard>*/}
                    {/*</Grid>*/}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} xl={3}>
                  <MainCard>
                    <Stack spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Customer Name</Typography>
                        <Typography>
                          Mr. {customer.name} {customer.name}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Age</Typography>
                        <Typography>{customer.age}</Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Contact</Typography>
                        <Typography>
                          <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={customer.phone} />
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Location</Typography>
                        <Typography> {customer.country} </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Website</Typography>
                        <Link href={customer.web} target="_blank" sx={{ textTransform: 'lowercase' }}>
                          {customer.web}
                        </Link>
                      </Stack>
                    </Stack>
                  </MainCard>
                </Grid>
              </Grid>
            </SimpleBar>
          </DialogContent>

          <DialogActions>
            <Button color="error" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* edit customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        <AddCustomer customer={customer} onCancel={handleAdd} />
      </Dialog>

      <AlertCustomerDelete customerId={customer._id} title={customer.name} open={openAlert} handleClose={handleClose} />
    </>
  );
}

CustomerPreview.propTypes = {
  customer: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func
};
