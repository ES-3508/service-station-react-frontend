import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
    Checkbox
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertUserDelete from './AlertUserDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, CheckOutlined, DeleteFilled } from '@ant-design/icons';
import { createUserRole, updateUserRole } from 'store/reducers/role';
import { UserRoles } from 'config';
import { useSelector } from 'store';
import PermissionCheckBox from './PermissionCheckBox';

// ==============================|| ROLE ADD / EDIT / DELETE ||============================== //

const AddRole = ({ role, onCancel }) => {

    const [openAlert, setOpenAlert] = useState(false);
    const [permissionSelection, setPermisisonSelection] = useState([]);

    const { permissions: {
        permissions,
        total,
    }, action } = useSelector((state) => state.roles);

    const { roles: {
        roles,
    }} = useSelector((state) => state.roles);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        onCancel();
    };

    const theme = useTheme();

    const RoleSchema = Yup.object().shape({
        name: Yup.string().max(255).required('Name is required'),
    });

    const defaultValues = useMemo(() => ({
        name: role ? role.name : '',
    }), [role])

    useEffect(() => {
        if (permissions.length > 0) {
            let permissionArray = [];

            permissions.map(item => {
                let data = {};

                if (role) {
                    const roleObj = roles.find(obj => obj._id === role._id);
                    const permissionObj = roleObj.rolePermissions.find(obj => obj.permission._id === item._id);

                    data = {
                        id: item._id,
                        permissionId: permissionObj._id,
                        create: permissionObj.create,
                        read: permissionObj.read,
                        delete: permissionObj.delete,
                        update: permissionObj.update,
                    }
                } else {
                    data = {
                        id: item._id,
                        create: false,
                        read: false,
                        delete: false,
                        update: false,
                    }
                }

                permissionArray.push(data)
            })
            
            setPermisisonSelection(permissionArray)
        }
    }, [permissions, role])

    const handelPermissionToggle = (id, type, value) => {
        const objIndex = permissionSelection.findIndex(obj => obj.id === id);

        if (objIndex === -1) {
            return;
        }

        let updatedObj = {};

        switch (type) {
            case 'create':
                updatedObj = { ...permissionSelection[objIndex], create: value};
                break;
            case 'read':
                updatedObj = { ...permissionSelection[objIndex], read: value};
                break;
            case 'update':
                updatedObj = { ...permissionSelection[objIndex], update: value};
                break;
            case 'delete':
                updatedObj = { ...permissionSelection[objIndex], delete: value};
                break;
            default:
                break;
        }

        const updatedPermissions = [
            ...permissionSelection.slice(0, objIndex),
            updatedObj,
            ...permissionSelection.slice(objIndex + 1),
        ];

        setPermisisonSelection(updatedPermissions)
    }

    const checkIfToggle = (id, type) => {
        const obj = permissionSelection.find(obj => obj.id === id);

        if (obj) {
            switch (type) {
                case 'create':
                    return obj.create;
                case 'read':
                    return obj.read;
                case 'update':
                    return obj.update;
                case 'delete':
                    return obj.delete;
                default:
                    return false;
            }
        }

        return false
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: defaultValues,
        validationSchema: RoleSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                if (role) {
                    dispatch(updateUserRole(role._id, {
                        ...values,
                        permissions: permissionSelection,
                    }));
                    resetForm();
                } else {
                    dispatch(createUserRole({
                        ...values,
                        permissions: permissionSelection,
                    }))
                    resetForm();
                }

                setSubmitting(false);
                onCancel();
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, resetForm } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{role ? 'Edit Role' : 'New Role'}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12}>
                                    <Grid container spacing={3}>
                                        {/* name */}
                                        <Grid item xs={12}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="user-name">Name</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="user-name"
                                                    placeholder="Enter User Name"
                                                    {...getFieldProps('name')}
                                                    error={Boolean(touched.name && errors.name)}
                                                    helperText={touched.name && errors.name}
                                                />
                                            </Stack>
                                        </Grid>
                                        {/* end of name */}

                                    </Grid>
                                </Grid>
                            </Grid>
                            <br />
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
                            {permissions.map(permission => (
                                <Grid container spacing={3} key={permission._id}>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={0.5}>
                                            <Typography>{permission.name}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={0.5}>
                                            <Typography>
                                                {/* <Typography> */}
                                                    <PermissionCheckBox
                                                        onChangeHandler={handelPermissionToggle}
                                                        theme={theme}
                                                        id={permission._id}
                                                        type={'create'}
                                                        toggled={checkIfToggle(permission._id, 'create')}
                                                    />
                                                {/* </Typography> */}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={0.5}>
                                            <Typography>
                                                {/* <Typography> */}
                                                    <PermissionCheckBox
                                                        onChangeHandler={handelPermissionToggle}
                                                        theme={theme}
                                                        id={permission._id}
                                                        type={'read'}
                                                        toggled={checkIfToggle(permission._id, 'read')}
                                                    />
                                                {/* </Typography> */}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={0.5}>
                                            <Typography>
                                                {/* <Typography> */}
                                                    <PermissionCheckBox
                                                        onChangeHandler={handelPermissionToggle}
                                                        theme={theme}
                                                        id={permission._id}
                                                        type={'update'}
                                                        toggled={checkIfToggle(permission._id, 'update')}
                                                    />
                                                {/* </Typography> */}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={0.5}>
                                            <Typography>
                                                {/* <Typography> */}
                                                    <PermissionCheckBox
                                                        onChangeHandler={handelPermissionToggle}
                                                        theme={theme}
                                                        id={permission._id}
                                                        type={'delete'}
                                                        toggled={checkIfToggle(permission._id, 'delete')}
                                                    />
                                                {/* </Typography> */}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            ))}
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                </Grid>
                                <Grid item>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Button color="error" onClick={onCancel}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                                            {role ? 'Edit' : 'Add'}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider>
        </>
    );
};

AddRole.propTypes = {
    role: PropTypes.any,
    onCancel: PropTypes.func
};

export default AddRole;
