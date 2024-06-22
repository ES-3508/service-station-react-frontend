import { dispatch } from "store";
import axios from "utils/axios";
import axiosClient from "axios";
import { openSnackbar } from "./snackbar";
import {setActionBoard} from "./boards";

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
    analytics: {
        rejected: null,
        verified: null,
        pending: null
    }
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

        getProjectSuccess(state, action) {
            state.project = action.payload;
        },

        getProjectAnalyticsSuccess(state, action) {
            state.analytics = action.payload;
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

export function getProjectAnalytics() {
    return async () => {
        try {

            let requestUrl = `/api/v1/project/analytics`;

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(projects.actions.getProjectAnalyticsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(projects.actions.hasError(error));
        }
    };
}

export function getProjectById(projectId) {
    return async () => {
        try {

            let requestUrl = `/api/v1/project/${projectId}`;

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(projects.actions.getProjectSuccess(response.data.data));
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
            console.log("update project value>>>>>", values);
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

export function updateProjectStatus(projectId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/project/${projectId}/update-status`, values);

            if (response.status === 200) {

                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Project status updated successfully.',
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
                    message: 'Project status could not update.',
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

export function updateProjectBoardOrder(projectId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/project/${projectId}/update/board`, values);

            if (response.status === 200) {

                dispatch(setActionBoard());
                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Board updated successfully',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }


        } catch (err) {
            // dispatch(
            //     openSnackbar({
            //         open: true,
            //         message: 'Board could not update.',
            //         variant: 'alert',
            //         alert: {
            //             color: 'error'
            //         },
            //         close: false
            //     })
            // );
            // dispatch(projects.actions.hasError(err));
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

export const uploadProjectAttachment = createAsyncThunk('upload/leadImage', async ({ leadId, file, schemaName }, { dispatch }) => {
    try {

        dispatch(
            openSnackbar({
                open: true,
                message: 'Uploading file...',
                variant: 'alert',
                alert: {
                    color: 'info'
                },
                close: false
            })
        );

        let formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`/api/v1/media/file-upload/${leadId}/${schemaName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {

            setActionProject();
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Project attachment uploaded successfully',
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
        dispatch(projects.actions.hasError(err));
    }
});

export function getProjectAttachment(url) {
    return async () => {
        try {
            const response = await axiosClient.get(url, {
                headers: {
                    responseType: 'blob',
                }
            });

            if (response.status === 200) {

                const file = new Blob([response.data], { type: 'image/jpeg' });

                return file;
            }

        } catch (error) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Attachment fetch failed',
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

export function createProjectNote(leadId, values) {
    return async () => {
        try {
            const response = await axios.post(`/api/v1/project/${leadId}/notes`, {
                ...values,
            });

            if (response.status === 200) {

                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Project note added successfully.',
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
                    message: 'Project note could not add.',
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

export function deleteProjectNote(leadId, noteId) {
    return async () => {
        console.log("leadId", leadId);
        console.log("noteid", noteId);
        try {
            const response = await axios.delete(`/api/v1/project/${leadId}/notes/${noteId}`);
            if (response.status === 200) {

                dispatch(projects.actions.deleteProjectSuccess(response.data));

                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Project note deleted successfully.',
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
                    message: 'Project note deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(projects.actions.hasError(error));
        }
    }
}

export function deleteProjectFile(leadId, fileId) {
    return async () => {
        console.log("leadId", leadId);
        console.log("fileId", fileId);
        try {
            const response = await axios.delete(`/api/v1/project/${leadId}/files/${fileId}`);
            if (response.status === 200) {

                dispatch(projects.actions.deleteProjectSuccess(response.data));

                setActionProject();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Project file deleted successfully.',
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
                    message: 'Project file deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(projects.actions.hasError(error));
        }
    }
}