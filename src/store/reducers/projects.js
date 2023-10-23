import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    project: {},
    projects: {
        projects: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedProject: {},
}

const projects = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET PROJECTS
        getProjectsSuccess(state, action) {
            state.projects = action.payload;
        },

        deleteProjectSuccess(state, action) {
            state.deletedProject = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },
    }
});

export default projects.reducer;

export function setActionProject() {
    dispatch(projects.actions.setAction());
}

export function getProjects(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/project?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(projects.actions.getProjectsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(projects.actions.hasError(error));
        }
    };
}

export function createProject(values) {
    return async () => {
        try {
            const response = await axios.post('/api/v1/project', values);

            if (response.status === 200) {

                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Project crated successfully.',
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
                    message: 'Project could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(projects.actions.hasError(err));
        }
    }
}

export function updateProject(projectId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/project/${projectId}/update`, values);

            if (response.status === 200) {

                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Project updated successfully.',
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
                    message: 'Project could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(projects.actions.hasError(err));
        }
    }
}

export function deleteProject(projectId) {
    return async () => {
        try {
            const response = await axios.delete(`/api/v1/project/${projectId}/delete`);

            if (response.status === 200) {

                dispatch(projects.actions.deleteProjectSuccess(response.data));

                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Project deleted successfully.',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }

        } catch (error) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Project deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(projects.actions.hasError(error));
        }
    };
}

export const uploadProjectAttachment = createAsyncThunk('', async (image) => {
    try {

        dispatch(
            openSnackbar({
                open: true,
                message: 'Uploading image...',
                variant: 'alert',
                alert: {
                    color: 'info'
                },
                close: false
            })
        );

        let formData = new FormData();
        formData.append("file", image);

        const response = await axios.post(`/api/v1/media/file-upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Image uploaded successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );

            return response.data.data.file_url;
        }

    } catch (err) {
        dispatch(
            openSnackbar({
                open: true,
                message: 'Project attachment upload failed',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                close: false
            })
        );
        dispatch(customers.actions.hasError(err));
    }
});