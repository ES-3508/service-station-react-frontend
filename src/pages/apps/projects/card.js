import { useMemo, useState, useEffect } from 'react';

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Dialog,
  Slide,
  Pagination,
  Typography
} from '@mui/material';

// project import
import { PopupTransition } from 'components/@extended/Transitions';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import ProjectCard from 'sections/apps/project/ProjectCard';
import AddProject from 'sections/apps/project/AddProject';

import makeData from 'data/react-table';
import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { PlusOutlined } from '@ant-design/icons';
import { dispatch, useSelector } from "../../../store";
import { getProjects } from "../../../store/reducers/projects";

// ==============================|| CUSTOMER - CARD ||============================== //

const allColumns = [
  {
    id: 1,
    header: '#'
  },
  {
    id: 2,
    header: 'Project Name'
  },
  {
    id: 3,
    header: 'Client Name'
  },
  {
    id: 4,
    header: 'Start Date'
  },
  {
    id: 5,
    header: 'End Date'
  },
  {
    id: 6,
    header: 'Attachment'
  },
  {
    id: 7,
    header: 'Status'
  },
  {
    id: 8,
    header: 'Description'
  }
];

const ProductCardPage = () => {
  const data = useMemo(() => makeData(12), []);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Default');
  const [globalFilter, setGlobalFilter] = useState('');
  const [add, setAdd] = useState(false);
  const [project, setProject] = useState(null);
  const [userCard, setUserCard] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('')

  const { projects: {
    projects,
    total,
  }, action } = useSelector((state) => state.projects);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleAdd = () => {
    setAdd(!add);
    if (project && !add) setProject(null);
  };

  // search
  // useEffect(() => {
  //   const newData = data.filter((value) => {
  //     if (globalFilter) {
  //       return value.fatherName.toLowerCase().includes(globalFilter.toLowerCase());
  //     } else {
  //       return value;
  //     }
  //   });
  //   setUserCard(newData);
  // }, [globalFilter, data]);

  const PER_PAGE = 6;

  // const count = Math.ceil(userCard.length / PER_PAGE);
  // const _DATA = usePagination(userCard, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    // _DATA.jump(p);
  };

  useEffect(() => {
    dispatch(getProjects(page - 1, PER_PAGE, query));
  }, [page, action, query])

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            {/*Search & Filter*/}
            <GlobalFilter preGlobalFilteredRows={projects} globalFilter={globalFilter} setGlobalFilter={(value) => {
              if (value !== undefined) {
                setQuery(value);
              } else {
                setQuery('');
              }
            }} />
            {/*End of Search & Filter*/}
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography variant="subtitle1">Sort By</Typography>;
                    }

                    return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                  }}
                >
                  {allColumns.map((column) => {
                    return (
                      <MenuItem key={column.id} value={column.header}>
                        {column.header}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
                Add Project
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/*Content Cards*/}
      <Grid container spacing={3}>
        {projects.length > 0 ? (
          // _DATA
          //   .currentData()
          //   .sort(function (a, b) {
          //     if (sortBy === 'Customer Name') return a.fatherName.localeCompare(b.fatherName);
          //     if (sortBy === 'Email') return a.email.localeCompare(b.email);
          //     if (sortBy === 'Contact') return a.contact.localeCompare(b.contact);
          //     if (sortBy === 'Age') return b.age < a.age ? 1 : -1;
          //     if (sortBy === 'Country') return a.country.localeCompare(b.country);
          //     if (sortBy === 'Status') return a.status.localeCompare(b.status);
          //     return a;
          //   })
          projects.map((project, index) => (
            <Slide key={index} direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                <ProjectCard project={project} />
              </Grid>
            </Slide>
          ))
        ) : (
          <EmptyUserCard title={'You have not created any Project yet.'} />
        )}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          count={Math.ceil(total / PER_PAGE)}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>

      {/* add project dialog */}
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
    </>
  );
};

export default ProductCardPage;
