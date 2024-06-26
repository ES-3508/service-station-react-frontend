import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
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

// third-party
import { PatternFormat } from 'react-number-format';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import AddLead from 'sections/apps/contact/AddLead';

import LeadView from 'sections/apps/contact/LeadView';
import AlertLeadDelete from 'sections/apps/contact/AlertLeadDelete';

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import {CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone, PhoneOutlined, UnorderedListOutlined, AppstoreOutlined} from '@ant-design/icons';
import { dispatch, useSelector } from 'store';
import { getLeads } from 'store/reducers/leads';
import LeadCardPage from "./card";
import ViewLead from 'sections/apps/contact/LeadView';


// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, getHeaderProps, handleAdd }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'created', desc: false };

  const [query, setQuery] = useState('')
  const [numOfPages, setNumOfPages] = useState(10)

  const { leads: {
    leads,
    total,
  }, action } = useSelector((state) => state.leads);

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
      data: leads,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['age', 'address', 'imageUrl', 'zipCode', 'web', 'description'] },
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
    dispatch(getLeads(pageIndex, pageSize, query));
  }, [pageIndex, pageSize, query, action])

 
  const renderRowSubComponent = useCallback(({ row }) => {
    return <LeadView data={leads.find((lead) => lead._id === row.values._id)} />;
  }, [leads]);


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
            <Button variant="contained" color='primary' startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
              Add Contact
            </Button>
            
            <CSVExport data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original) : leads} filename={'lead-list.csv'} />
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

// ==============================|| lead - LIST ||============================== //

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
    <Stack direction="row" spacing={1.5} alignItems="center">
      {/* <Avatar alt="Avatar 1" size="sm" src={values.imageUrl} /> */}
      <Stack spacing={0}>
        <Typography variant="subtitle1">{values.created}</Typography>
        <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography>
      </Stack>
    </Stack>
  );
};

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

const ProjectType = ({ value }) => {
  switch (value) {
    case 'Electrical':
      return <Chip color="error" label="Electrical" size="small" variant="light" />;
    case 'Mechanical':
      return <Chip color="success" label="Mechanical" size="small" variant="light" />;
    case 'Civil':
    default:
      return <Chip color="info" label="Civil" size="small" variant="light" />;
  }
};

const ActionCell = (row, setLead, setLeadDeleteId, handleAdd, handleView, handleClose, theme) => {
  const collapseIcon = row.isExpanded ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );

  const { leads: {
    leads,
    total,
  }, action } = useSelector((state) => state.leads);
 
  const filterLeadsById = (_id) => {
    console.log(_id,"idddddddddd")
    const selectedLead = leads.find((lead) => lead._id === _id);
    // Do something with the selected lead, for example, set it in state
    setLead(selectedLead);
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      {/* <Tooltip title="View">
        <IconButton
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            row.toggleRowExpanded();
          }}
        >
          {collapseIcon}
        </IconButton>
      </Tooltip> */}
      <Tooltip title="view">
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            filterLeadsById(row.values._id);
            handleView();
          }}
        >
          <EyeTwoTone twoToneColor={theme.palette.primary.main} />
        </IconButton>
      </Tooltip>

      <Tooltip title="edit">
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            console.log(row.values)
            filterLeadsById(row.values._id); // Pass the _id of the selected row
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
            setLeadDeleteId({
              _id: row.values._id,
              created: row.values.created
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

const LeadListPage = () => {
  const theme = useTheme();

  const [mode, setMode] = useState('TABLE')

  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState();
  const [deletingLead, setDeletingLead] = useState({
    _id: null,
    created: ''
  });

  const handleAdd = () => {
    setAdd(!add);
    if (lead && !add) setLead(null);
  };

  const handleView = () => {
    setView(!view);
    if (lead && !view) setLead(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      // {
      //   title: 'Row Selection',
      //   Header: SelectionHeader,
      //   accessor: 'selection',
      //   Cell: SelectionCell,
      //   disableSortBy: true
      // },
      {
        Header: '#',
        accessor: '_id',
        className: 'cell-center',
        Cell: IndexCell,
      },
      {
        Header: 'First Name',
        accessor: 'contactInformation.firstName',
        // Cell: CustomCell
      },
      
      {
        Header: 'Last Name',
        accessor: 'contactInformation.lastName',
        // Cell: CustomCell
      },
      // {
      //   Header: 'Name',
      //   accessor: 'name',
      //   // Cell: CustomCell
      // },
      {
        Header: 'Email',
        accessor: 'contactInformation.email',
        // Cell: ProjectType
      },
      // {
      //   Header: 'Source',
      //   //manual edit
      //   accessor: 'source',
      //   Cell: ({ value }) => {
          
      //     return `Manual Entry`;
      //   }
      // },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: ({ value }) => {
          if (value === null) {
            return ''; // Or you can return any other representation of a blank cell
          }
          const date = new Date(value);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      },

     
      {
        Header: 'Address',
        accessor: 'contactInformation.address',
        // Cell: StatusCell
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => ActionCell(row, setLead, setDeletingLead, handleAdd, handleView, handleClose, theme)
      }
    ],
    // 
    [theme]
  );


  return (
    <>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            {/* <IconButton size="large" color={mode === "TABLE" ? "primary" : "secondary"} onClick={() => setMode("TABLE")}>
                <UnorderedListOutlined />
            </IconButton>
            <IconButton size="large" color={mode === "CARD" ? "primary" : "secondary"} onClick={() => setMode("CARD")}>
                <AppstoreOutlined />
            </IconButton> */}
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
                <AlertLeadDelete title={deletingLead?.created} leadId={deletingLead._id} open={open} handleClose={handleClose} />
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
                    <AddLead lead={lead} onCancel={handleAdd} />
                </Dialog>

                {/* view lead dialog */}
                <Dialog
                    maxWidth="sm"
                    TransitionComponent={PopupTransition}
                    keepMounted
                    fullWidth
                    onClose={handleView}
                    open={view}
                    sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <ViewLead lead={lead} onCancel={handleView} />
                </Dialog>
            </MainCard>
    ) : (
        <LeadCardPage />
    )}

    </>
  );
};

export default LeadListPage;
