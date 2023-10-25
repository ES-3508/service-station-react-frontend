import { useEffect, useState } from 'react';
import { useLocation, Outlet, useParams } from 'react-router-dom';

// material-ui
import {Box, Grid, Typography} from '@mui/material';
import { getUserStory, getUserStoryOrder, getProfiles, getComments, getItems, getColumns, getColumnsOrder } from 'store/reducers/kanban';

// project imports
import Loader from 'components/Loader';

import {useDispatch, useSelector} from 'store';
import { openDrawer } from 'store/reducers/menu';
import ReportCard from "../../../components/cards/statistics/ReportCard";
import {
  AimOutlined,
  EyeOutlined, FieldTimeOutlined,
} from "@ant-design/icons";
import {useTheme} from "@mui/material/styles";
import {getProjectById} from "../../../store/reducers/projects";
import ScrollX from "../../../components/ScrollX";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| APPLICATION - KANBAN ||============================== //

export default function KanbanPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { id } = useParams()

  const [loading, setLoading] = useState(true);

  const { project } = useSelector((state) => state.projects);
  const { boards: { boards, total } } = useSelector((state) => state.boards);
  const { tasks: {total: tasksTotal} } = useSelector((state) => state.tasks);

  let selectedTab = 0;
  switch (pathname) {
    case '/apps/kanban/backlogs':
      selectedTab = 1;
      break;
    case '/apps/kanban/board':
    default:
      selectedTab = 0;
  }

  useEffect(() => {
    if( id) {
      dispatch(getProjectById(id))
    }
  }, [id]);

  const [value, setValue] = useState(selectedTab);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // hide left drawer when email app opens
    dispatch(openDrawer(false));
  }, []);

  useEffect(() => {
    const items = dispatch(getItems());
    const columns = dispatch(getColumns());
    const columnOrder = dispatch(getColumnsOrder());
    const profile = dispatch(getProfiles());
    const comments = dispatch(getComments());
    const story = dispatch(getUserStory());
    const storyOrder = dispatch(getUserStoryOrder());

    Promise.all([items, columns, columnOrder, profile, comments, story, storyOrder]).then(() => setLoading(false));

  }, []);

  if (loading) return <Loader />;

  return (
      <>
        <Box>
          <Typography variant="h2">{project.projectName}</Typography>
        </Box>
        <ScrollX>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={3} sm={6}>
              <ReportCard primary={tasksTotal} secondary="Total tasks" color={theme.palette.secondary.main} iconPrimary={EyeOutlined} />
            </Grid>
            {boards.map((board) => (
                <Grid key={board._id} item xs={12} lg={3} sm={6}>
                  <ReportCard primary={board.taskOrders.length} secondary={board.boardName} color={theme.palette.secondary.main} iconPrimary={EyeOutlined} />
                </Grid>
            ))}

            {/*<Grid item xs={12} lg={3} sm={6}>*/}
            {/*  <ReportCard primary="55" secondary="{Completed} Tasks" color={theme.palette.error.main} iconPrimary={FieldTimeOutlined} />*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12} lg={3} sm={6}>*/}
            {/*  <ReportCard primary="10" secondary="{Todo} Tasks" color={theme.palette.success.dark} iconPrimary={AimOutlined} />*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12} lg={3} sm={6}>*/}
            {/*  <ReportCard primary="1" secondary="{In Progress} Tasks" color={theme.palette.primary.main} iconPrimary={FieldTimeOutlined} />*/}
            {/*</Grid>*/}
          </Grid>
        </ScrollX>

        <Box sx={{ display: 'flex' }} mt={1}>

          <Grid container spacing={1}>
            {/*<Grid item xs={12}>*/}
            {/*  <Tabs value={value} variant="scrollable" onChange={handleChange}>*/}
            {/*    <Tab component={Link} to={`/apps/project/${id}/kanban/board`} label={value === 0 ? 'Board' : 'View as Board'} {...a11yProps(0)} />*/}
            {/*    <Tab component={Link} to={`/apps/project/${id}/kanban/backlogs`} label={value === 1 ? 'Backlogs' : 'View as Backlog'} {...a11yProps(1)} />*/}
            {/*  </Tabs>*/}
            {/*</Grid>*/}
            <Grid item xs={12}>
              <Outlet />
            </Grid>
          </Grid>
        </Box>
      </>

  );
}
