import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";
import {createAsyncThunk} from "@reduxjs/toolkit";

const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    task: null,
    tasks: {
        tasks: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedTask: {},
}

const tasks = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getTasksSuccess(state, action) {
            state.tasks = action.payload;
        },

        deleteTaskSuccess(state, action) {
            state.deletedTask = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },

        setSelectedTaskAction(state, action) {
            state.task = action.payload;
        }
    }
});

export default tasks.reducer;

export function setActionTask() {
    dispatch(tasks.actions.setAction());
}

export function setSelectedTask(task) {
    return async () => {
        dispatch(tasks.actions.setSelectedTaskAction(task))
    }
}

export function getAllTasks(projectId, pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/project/${projectId}/task/all?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(tasks.actions.getTasksSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(tasks.actions.hasError(error));
        }
    };
}

export function getTasks(projectId, boardId, pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/project/${projectId}/board/${boardId}/task?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(tasks.actions.getTasksSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(tasks.actions.hasError(error));
        }
    };
}

export function getTaskById(projectId, boardId, taskId) {
    return async () => {
        try {

            let requestUrl = `/api/v1/project/${projectId}/board/${boardId}/task/${taskId}`;

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(tasks.actions.setSelectedTaskAction(response.data.data));
            }

        } catch (error) {
            dispatch(tasks.actions.hasError(error));
        }
    };
}

export function createTask(projectId, boardId, values) {
    return async () => {
        try {
            const response = await axios.post(`/api/v1/project/${projectId}/board/${boardId}/task`, values);

            if (response.status === 200) {

                setActionTask();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Task created successfully.',
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
                    message: 'Task could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(tasks.actions.hasError(err));
        }
    }
}

export function updateTask(projectId, boardId, taskId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/project/${projectId}/board/${boardId}/task/${taskId}/update`, values);

            if (response.status === 200) {

                setActionTask();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Task saved successfully.',
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
                    message: 'Task could not save.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(tasks.actions.hasError(err));
        }
    }
}

export const uploadTaskAttachments = createAsyncThunk('', async (images) => {
    try {

        dispatch(
            openSnackbar({
                open: true,
                message: 'Uploading documents...',
                variant: 'alert',
                alert: {
                    color: 'info'
                },
                close: false
            })
        );

        let uploadedImages = [];

        await Promise.all(images.map(async (image) => {
            let formData = new FormData();
            formData.append("file", image);

            const response = await axios.post(`/api/v1/media/document-upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {

                uploadedImages.push(response.data.data.file_url);

            }
        }))

        dispatch(
            openSnackbar({
                open: true,
                message: 'Documents uploaded successfully',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );

        return uploadedImages;

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



export function deleteTask(projectId, boardId, taskId) {
    return async () => {
        try {
            const response = await axios.delete(`/api/v1/project/${projectId}/board/${boardId}/task/${taskId}/delete`);

            if (response.status === 200) {

                dispatch(tasks.actions.deleteTaskSuccess(response.data));

                setActionTask();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Task deleted successfully.',
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
                    message: 'Task deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(tasks.actions.hasError(error));
        }
    };
}