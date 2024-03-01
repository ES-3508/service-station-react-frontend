import PropTypes from 'prop-types';
import { useState } from 'react';
// material-ui
import {
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  Fade,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack, Tooltip,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import ProjectPreview from 'sections/apps/project/ProjectPreview';
import AlertProjectDelete from 'sections/apps/project/AlertProjectDelete';
import AddProject from 'sections/apps/project/AddProject';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import ListSmallCard from 'sections/apps/customer/exportpdf/ListSmallCard';
import { Link as RouterLink } from "react-router-dom";

// assets
import {BuildOutlined, CalendarOutlined, MoreOutlined} from '@ant-design/icons';
import { format, parseISO } from "date-fns";
import {useTheme} from "@mui/material/styles";

// const avatarImage = require.context('assets/images/users', true);



// ==============================|| PROJECT - CARD ||============================== //

const ProjectCard = ({ project }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [add, setAdd] = useState(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  const ProjectStatus = ({ value }) => {
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

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                    <MoreOutlined style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                }
              >
                {/* <ListItemAvatar>
                  <Avatar alt={customer.fatherName} src={avatarImage(`./avatar-${!customer.avatar ? 1 : customer.avatar}.png`)} />
                </ListItemAvatar> */}
                <ListItemText
                  primary={<Typography variant="subtitle1">{project.projectName}{' '} <ProjectStatus value={project.status} /></Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      {project.clientName}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button'
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              {/* <MenuItem sx={{ a: { textDecoration: 'none', color: 'inherit' } }}>
                <>
                  {' '}
                  <PDFDownloadLink document={<ListSmallCard customer={customer} />} fileName={`Customer-${customer.fatherName}.pdf`}>
                    Export PDF
                  </PDFDownloadLink>
                </>
              </MenuItem> */}
              <MenuItem onClick={handleAdd}>Edit</MenuItem>
              <MenuItem onClick={handleAlertClose}>Delete</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography>{project.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarOutlined />
                    </ListItemIcon>
                    {/*
                    <ListItemText primary={<Typography color="secondary">Start Date: {format(parseISO(project.startDate), "M/d/yyyy")}</Typography>} />
            */}
                    </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography color="secondary">
                          {/* 
                          <ListItemText primary={<Typography color="secondary"> End Date: {format(parseISO(project.endDate), "M/d/yyyy")}</Typography>} />
                        */}
                          </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              {/* <Grid item xs={6}>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  <ListItem>
                    <ListItemIcon>
                      <EnvironmentOutlined />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="secondary">{project.clientName}</Typography>} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LinkOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link href="https://google.com" target="_blank" sx={{ textTransform: 'lowercase' }}>
                          https://{project.clientName}.en
                        </Link>
                      }
                    />
                  </ListItem>
                </List>
              </Grid> */}
            </Grid>
          </Grid>
          {/* <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0
                }}
                component="ul"
              >
                {customer.skills.map((skill, index) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={skill} />
                  </ListItem>
                ))}
              </Box>
            </Box>
          </Grid> */}
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          {/*
          <Typography variant="caption" color="secondary">

            Created at {format(parseISO(project.created), "M/d/yyyy")}
          </Typography>
        */}
          <Stack direction={'row'} spacing={2}>
            <Tooltip title="Kanban">
              <RouterLink to={`/apps/project/${project._id}/kanban/board`}>
                <IconButton
                    color="primary"
                >
                  <BuildOutlined twoToneColor={theme.palette.secondary.main} />
                </IconButton>
              </RouterLink>
            </Tooltip>

            <Button variant="outlined" size="small" onClick={handleClickOpen}>
              Preview
            </Button>
          </Stack>
        </Stack>
      </MainCard>

      {/* edit customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        <AddProject project={project} onCancel={handleAdd} />
      </Dialog>
       <ProjectPreview project={project} open={open} onClose={handleClose} />
      <AlertProjectDelete title={project.projectName} projectId={project._id} open={openAlert} handleClose={handleAlertClose} />
    </>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object
};

export default ProjectCard;
