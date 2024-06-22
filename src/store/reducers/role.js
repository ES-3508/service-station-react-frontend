import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    role: {},
    permissions: {
        permissions: [],
        page: null,
        total: null,
        limit: null,
    },
    roles: {
        roles: [],
        page: null,
        total: null,
        limit: null,
    },
}

const roles = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET ROLES
        getRolesSuccess(state, action) {
            state.roles = action.payload;
        },

        getPermissionsSuccess(state, action) {
            state.permissions = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },
    }
});

export default roles.reducer;

export function setActionRole() {
    dispatch(roles.actions.setAction());
}

export function getRoles(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/user/role?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(roles.actions.getRolesSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(roles.actions.hasError(error));
        }
    };
}

export function getPermissions(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/user/permission?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(roles.actions.getPermissionsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(roles.actions.hasError(error));
        }
    };
}

export function createUserRole(values) {
    return async () => {
        try {
            const response = await axios.post('/api/v1/user/role', {
                ...values,
            });

            if (response.status === 200) {

                setActionRole();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'User Role crated successfully.',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }


        } catch (err) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'User Role could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(roles.actions.hasError(err));
        }
    }
}

export function updateUserRole(roleId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/user/role/${roleId}/update`, {
                ...values,
            });

            if (response.status === 200) {

                setActionRole();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'User Role updated successfully.',
                        variant: 'alert',
                        alert: {
                            color: 'success',
                        },
                        close: false,
                    })
                );
            }


        } catch (err) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'User Role could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error',
                    },
                    close: false,
                })
            );
            dispatch(roles.actions.hasError(err));
        }
    }
}