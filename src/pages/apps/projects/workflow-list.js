import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// import { useTheme } from '@mui/material/styles';

// material-ui
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Stack,
  Slider,
  Tooltip,
  IconButton,
  Box,
  useTheme
} from '@mui/material';

// third-party
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTable, useFilters } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport } from 'components/third-party/ReactTable';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import makeData from 'data/react-table';
import { DefaultColumnFilter } from 'utils/react-table';

// assets
import { AppstoreOutlined, CheckOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useSelector } from 'store';
import { getProjects, updateProject } from 'store/reducers/projects';
import { useDispatch } from 'store';

const CellEdit = ({ value: initialValue, row: { index }, column: { id, dataType }, updateData, row }) => {
  const [value, setValue] = useState(initialValue);
  const [showSelect, setShowSelect] = useState(false);

  const onChange = (e) => {
    setValue(e.target?.value);
  };

  const onBlur = () => {
    updateData(index, id, value, row);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let element;
  let userInfoSchema;
  switch (id) {
    case 'email':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().email('Enter valid email ').required('Email is a required field')
      });
      break;
    case 'age':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.number()
          .typeError('Age must be number')
          .required('Age is required')
          .min(18, 'You must be at least 18 years')
          .max(100, 'You must be at most 60 years')
      });
      break;
    case 'visits':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.number().typeError('Visits must be number').required('Required')
      });
      break;
    default:
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is Required')
      });
      break;
  }

  switch (dataType) {
    case 'text':
      element = (
        <>
          <Formik
            initialValues={{
              userInfo: value
            }}
            enableReinitialize
            validationSchema={userInfoSchema}
            onSubmit={() => {}}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <TextField
                  value={values.userInfo}
                  id={`${index}-${id}`}
                  name="userInfo"
                  onChange={(e) => {
                    handleChange(e);
                    onChange(e);
                  }}
                  onBlur={handleBlur}
                  error={touched.userInfo && Boolean(errors.userInfo)}
                  helperText={touched.userInfo && errors.userInfo && errors.userInfo}
                  sx={{
                    '& .MuiOutlinedInput-input': { py: 0.75, px: 1, width: { xs: 80 } },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                />
              </Form>
            )}
          </Formik>
        </>
      );
      break;
    case 'select':
      element = (
        <>
          <Select
            labelId="editable-select-status-label"
            sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 }, svg: { display: 'none' } }}
            id="editable-select-status"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          >
            <MenuItem value="" selected={true}>
              <Chip color="error" label="Status" size="large" variant="dark" />
            </MenuItem>
            <MenuItem value="Started">
              <Chip color="error" label="Started" size="large" variant="dark" />
            </MenuItem>
            <MenuItem value="Paused">
              <Chip color="warning" label="Paused" size="large" variant="dark" />
            </MenuItem>
            <MenuItem value="Done">
              <Chip color="success" label="Done" size="large" variant="dark" />
            </MenuItem>
          </Select>
        </>
      );
      break;
    case 'progress':
      element = (
        <>
          {!showSelect ? (
            <Box onClick={() => setShowSelect(true)}>
              <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
            </Box>
          ) : (
            <>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, minWidth: 120 }}>
                <Slider
                  value={value}
                  min={0}
                  max={100}
                  step={1}
                  onBlur={onBlur}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  valueLabelDisplay="auto"
                  aria-labelledby="non-linear-slider"
                />
                <Tooltip title={'Submit'}>
                  <IconButton onClick={() => setShowSelect(false)}>
                    <CheckOutlined />
                  </IconButton>
                </Tooltip>
              </Stack>
            </>
          )}
        </>
      );
      break;
    default:
      element = <span></span>;
      break;
  }
  return element;
};

// ==============================|| REACT TABLE ||============================== //

ReactTable.propTypes = {
  columns: PropTypes.array,
  updateData: PropTypes.func,
  skipPageReset: PropTypes.bool
};

function ReactTable({ columns, updateData, skipPageReset }) {
  const theme = useTheme();

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Cell: CellEdit
    }),
    []
  );

  const {
    projects: { projects, total },
    action
  } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data: projects,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateData
    },
    useFilters
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch, action]);

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell key={column.id} {...column.getHeaderProps()} style={{ width: column.id === 'projectName' ? '300px' : 'auto' }}>
              {column.render('Header')}
            </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow key={row.id} {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <TableCell
                  key={cell.column.id}
                  {...cell.getCellProps()}
                  style={{
                    padding: '12px', // Adjust padding as needed
                    borderRadius: '4px',
                    border: '10px solid #ffffff',
                    backgroundColor:
                      cell.value === 'Started'
                        ? theme.palette.error.main
                        : cell.value === 'Paused'
                        ? theme.palette.warning.main
                        : cell.value === 'Done'
                        ? theme.palette.success.main
                        : '#f5f5f5' // Default to gray-100fff' : '#000000' // White color for text if value matches, otherwise black
                  }}
                >
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ==============================|| REACT TABLE - EDITABLE CELL ||============================== //

const WorkflowListPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mode, setMode] = useState('TABLE');
  const [data, setData] = useState(() => makeData(10));
  const [skipPageReset, setSkipPageReset] = useState(false);

  const ProjectNameCell = ({ value }) => {
    return (
      <TableCell
        style={{
          width: '300px', // Set fixed width for the "Project Name" column
          overflow: 'hidden', // Prevent content from overflowing
          whiteSpace: 'nowrap', // Prevent text wrapping
          textOverflow: 'ellipsis',// Show ellipsis (...) for overflowing text
          fontWeight: 'bold', // Apply bold font weight
          backgroundColor: '#f5f5f5',// backgroundColor: 'white', // Set background color to white
          color: 'black' // Set text color to black
        }}
      >
        {value}
      </TableCell>
    );
  };

  const columns = useMemo(
    () => [
      {
      Header: 'Project Name',
      accessor: 'projectName',
      Cell: ({ cell: { value } }) => <ProjectNameCell value={value} /> // Use the custom cell component for the "Project Name" column
    },
      // {
      //   Header: 'Lead Name',
      //   accessor: 'projectName',
      //   dataType: 'text',
      //   id: 'projectLead'
      // },
      {
        Header: 'Survey',
        accessor: 'projectStatus.survey',
        dataType: 'select'
      },
      {
        Header: 'Frames Ordered',
        accessor: 'projectStatus.framesOrdered',
        dataType: 'select'
      },
      {
        Header: 'Glass Ordered',
        accessor: 'projectStatus.glassOrdered',
        dataType: 'select'
      },
      {
        Header: 'Order Complete',
        accessor: 'projectStatus.orderComplete',
        dataType: 'select'
      },
      {
        Header: 'In Production',
        accessor: 'projectStatus.inProduction',
        dataType: 'select'
      },
      {
        Header: 'Delivery',
        accessor: 'projectStatus.delivery',
        dataType: 'select'
      },
      {
        Header: 'Installation Date',
        accessor: 'projectStatus.installationDate',
        dataType: 'select'
      },
      {
        Header: 'Dispatch Invoice Paid',
        accessor: 'projectStatus.dispatchInvoicePaid',
        dataType: 'select'
      },
      {
        Header: 'Installers Remidail Works',
        accessor: 'projectStatus.installersRemidailWorks',
        dataType: 'select'
      },
      {
        Header: 'Complete',
        accessor: 'projectStatus.complete',
        dataType: 'select'
      }
    ],
    [theme]
  );

  const updateData = (rowIndex, columnId, value, row) => {
    console.log('Updating data:', rowIndex, columnId, value, row);
    const projectId = row.original._id;
    const existingValues = { ...row.original };
    if (columnId.startsWith('projectStatus.')) {
      const field = columnId.split('.')[1];
      existingValues.projectStatus = {
        ...existingValues.projectStatus,
        [field]: value
      };
    } else {
      existingValues[columnId] = value;
    }

    try {
      dispatch(updateProject(projectId, existingValues));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <IconButton size="large" color={mode === 'TABLE' ? 'primary' : 'secondary'} onClick={() => setMode('TABLE')}>
          <UnorderedListOutlined />
        </IconButton>
        <IconButton size="large" color={mode === 'CARD' ? 'primary' : 'secondary'} onClick={() => setMode('CARD')}>
          <AppstoreOutlined />
        </IconButton>
      </Box>

      {mode === 'TABLE' ? (
        <MainCard content={false}>
          <ScrollX>
            <ReactTable columns={columns} updateData={updateData} skipPageReset={skipPageReset} />
          </ScrollX>
        </MainCard>
      ) : (
        <ProjectCardPage />
      )}
    </>
  );
};

export default WorkflowListPage;
