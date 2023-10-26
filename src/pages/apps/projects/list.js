import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Chip,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { PatternFormat } from 'react-number-format';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project import
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import AddProject from 'sections/apps/project/AddProject';
import ProjectView from 'sections/apps/project/ProjectView';
import AlertProjectDelete from 'sections/apps/project/AlertProjectDelete';

import { GlobalFilter, renderFilterTypes } from 'utils/react-table';

// assets
import {
    CloseOutlined,
    DeleteTwoTone,
    EditTwoTone,
    EyeTwoTone,
    PlusOutlined,
    UnorderedListOutlined,
    AppstoreOutlined,
    BuildOutlined
} from '@ant-design/icons';
import { format, parseISO } from 'date-fns';
import { dispatch, useSelector } from 'store';
import { getProjects } from 'store/reducers/projects';
import { Link } from "react-router-dom";
import ProjectCardPage from './card';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, getHeaderProps, handleAdd }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'projectName', desc: false };

  const [query, setQuery] = useState('')
  const [numOfPages, setNumOfPages] = useState(10)

  const { projects: {
    projects,
    total,
  }, action } = useSelector((state) => state.projects);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    // setGlobalFilter,
    setSortBy,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: projects,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['description'] },
      manualPagination: true,
      pageCount: Math.ceil(total / numOfPages),
      autoResetPage: false,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    dispatch(getProjects(pageIndex, pageSize, query));
  }, [pageIndex, pageSize, query, action])

  // useEffect(() => {
  //   if (matchDownSM) {
  //     setHiddenColumns(['age', 'phone', 'visits', 'email', 'accountStatus', 'imageUrl']);
  //   } else {
  //     setHiddenColumns(['age', 'address', 'imageUrl', 'accountStatus']);
  //   }
  //   // eslint-disable-next-line
  // }, [matchDownSM]);

  const renderRowSubComponent = useCallback(({ row }) => {
    return <ProjectView data={projects.find((project) => project._id === row.values._id)} />;
  }, [projects]);


  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={(value) => {
              if (value !== undefined) {
                setQuery(value);
              } else {
                setQuery('');
              }
            }}
            size="small"
          />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
              Add Project
            </Button>
            {/* <CSVExport data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original) : projects} filename={'customer-list.csv'} /> */}
          </Stack>
        </Stack>

        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell key={index} {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell, index) => (
                      <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, expanded })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination serverSidePagination={true} total={total} gotoPage={gotoPage} rows={rows} setPageSize={(size) => {
                  setPageSize(size);
                  setNumOfPages(size);
                }} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any
};

// ==============================|| CUSTOMER - LIST ||============================== //

// Section Cell and Header
const SelectionCell = ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />;
const SelectionHeader = ({ getToggleAllPageRowsSelectedProps }) => (
  <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
);

const IndexCell = ({ row, state }) => {
  return <Typography variant="subtitle1">{Number(row.id) + 1 + state.pageIndex * state.pageSize}</Typography>;
}

const CustomCell = ({ row }) => {
  const { values } = row;
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Avatar alt="Avatar 1" size="sm" src={values.imageUrl} />
    </Stack>
  );
};

const StartDateCell = ({ row }) => {
  const { values } = row;
  return (
    <>
      <Typography variant="subtitle1">{format(parseISO(values.startDate), "M/d/yyyy")}</Typography>

    </>
  );
}
const EndDateCell = ({ row }) => {
  const { values } = row;
  return (
    <Typography variant="subtitle1">{format(parseISO(values.endDate), "M/d/yyyy")}</Typography>
  );
}

const NumberFormatCell = ({ value }) => <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={value} />;

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

const ActionCell = (row, setProject, setProjectDeleteId, handleAdd, handleClose, theme) => {
  const collapseIcon = row.isExpanded ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      <Tooltip title="Kanban">
        <Link to={`/apps/project/${row.values._id}/kanban/board`}>
          <IconButton
            color="primary"
          >
            <BuildOutlined twoToneColor={theme.palette.secondary.main} />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip title="View">
          <IconButton
              color="secondary"
              onClick={(e) => {
                  e.stopPropagation();
                  row.toggleRowExpanded();
              }}
          >
              {collapseIcon}
          </IconButton>
      </Tooltip>
        <Tooltip title="Edit">
            <IconButton
                color="primary"
                onClick={(e) => {
                    e.stopPropagation();
                    setProject(row.values);
                    handleAdd();
                }}
            >
                <EditTwoTone twoToneColor={theme.palette.primary.main} />
            </IconButton>
        </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            setProjectDeleteId({
              _id: row.values._id,
              name: row.values.projectName
            });
          }}
        >
          <DeleteTwoTone twoToneColor={theme.palette.error.main} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

StatusCell.propTypes = {
  value: PropTypes.number
};

NumberFormatCell.propTypes = {
  value: PropTypes.string
};

CustomCell.propTypes = {
  row: PropTypes.object
};

SelectionCell.propTypes = {
  row: PropTypes.object
};

SelectionHeader.propTypes = {
  getToggleAllPageRowsSelectedProps: PropTypes.func
};

const ProjectListPage = () => {
  const theme = useTheme();

  const [mode, setMode] = useState('CARD')

  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState();
  const [deletingProject, setDeletingProject] = useState({
    _id: null,
    name: ''
  });

  const handleAdd = () => {
    setAdd(!add);
    if (project && !add) setProject(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: SelectionHeader,
        accessor: 'selection',
        Cell: SelectionCell,
        disableSortBy: true
      },
      {
        Header: '#',
        accessor: '_id',
        className: 'cell-center',
        Cell: IndexCell,
      },
      {
        Header: 'Project Name',
        accessor: 'projectName',
      },
      {
        Header: 'Client Name',
        accessor: 'clientName',
      },
      {
        Header: 'Start Date',
        accessor: 'startDate',
        Cell: StartDateCell,
      },
      {
        Header: 'End Date',
        accessor: 'endDate',
        Cell: EndDateCell
      },
      {
        Header: 'Attachment',
        accessor: 'imageUrl',
        Cell: CustomCell
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: StatusCell
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => ActionCell(row, setProject, setDeletingProject, handleAdd, handleClose, theme)
      }
    ],
    // 
    [theme]
  );

  // const renderRowSubComponent = useCallback(({ row }) => {
  //   console.log('DEVELOPER ROW ', data.find((customer) => customer._id === row.values._id));
  //   console.log('DEVELOPER ', data);
  //   return null;
  //   // return <CustomerView data={data[row._id]} />;
  // }, [data]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <IconButton size="large" color={mode === "TABLE" ? "primary" : "secondary"} onClick={() => setMode("TABLE")}>
          <UnorderedListOutlined />
        </IconButton>
        <IconButton size="large" color={mode === "CARD" ? "primary" : "secondary"} onClick={() => setMode("CARD")}>
          <AppstoreOutlined />
        </IconButton>
      </Box>

      {mode === "TABLE" ? (
        <MainCard content={false}>
          <ScrollX>
            <ReactTable
              columns={columns}
              handleAdd={handleAdd}
              getHeaderProps={(column) => column.getSortByToggleProps()}
            />
          </ScrollX>
          <AlertProjectDelete title={deletingProject.name} projectId={deletingProject._id} open={open} handleClose={handleClose} />
          {/* add user dialog */}
          <Dialog
            maxWidth="sm"
            TransitionComponent={PopupTransition}
            keepMounted
            fullWidth
            onClose={handleAdd}
            open={add}
            sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
            aria-describedby="alert-dialog-slide-description"
          >
            <AddProject project={project} onCancel={handleAdd} />
          </Dialog>
        </MainCard>
      ) : (
        <ProjectCardPage />
      )}

    </>

  );
};

export default ProjectListPage;
