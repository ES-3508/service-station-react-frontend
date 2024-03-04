import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    lead: {},
    leads: {
        leads: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedLead: {},
    uploadedImageUrl: null,
}

const leads = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET leadS
        getLeadsSuccess(state, action) {
            state.leads = action.payload;
        },

        deleteLeadSuccess(state, action) {
            state.deletedLead = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },

        setUploadedImageSuccess(state, action) {
            state.uploadedImageUrl = action.payload;
        }
    }
});

export default leads.reducer;

export function setActionLead() {
    dispatch(leads.actions.setAction());
}

export function getLeads(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/lead?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(leads.actions.getLeadsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(leads.actions.hasError(error));
        }
    };
}

export function createLead(values) {
    return async () => {
        try {
            const response = await axios.post('/api/v1/lead', {
                ...values,
                phone: Number(values.phone),
                age: Number(values.age),
                // TODO: set uploaded image,
                // imageUrl: "https://uploads-ssl.webflow.com/63f46d18f2e566716e8d3a69/63f88caea3a61965fef45229_oguz-yagiz-kara-MZf0mI14RI0-unsplash%20(1)-p-500.jpg"
            });

            if (response.status === 200) {

                setActionLead();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Lead crated successfully.',
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
                    message: 'Lead could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(leads.actions.hasError(error));
        }
    }
}

export function updateLead(leadId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/lead/${leadId}/update`, {
                ...values,
                age: Number(values.age),
            });

            if (response.status === 200) {

                setActionLead();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Lead updated successfully.',
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
                    message: 'Lead could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(leads.actions.hasError(err));
        }
    }
}

export function createLeadNote(leadId, values) {
    return async () => {
        try {
            const response = await axios.post(`/api/v1/lead/${leadId}/notes`, {
                ...values,
            });

            if (response.status === 200) {

                setActionLead();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Lead note added successfully.',
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
                    message: 'Lead note could not add.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(leads.actions.hasError(err));
        }
    }
}

export function deleteLead(leadId) {
    return async () => {
        try {
            const response = await axios.delete(`/api/v1/lead/${leadId}/delete`);

            if (response.status === 200) {

                dispatch(leads.actions.deleteLeadSuccess(response.data));

                setActionLead();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Lead deleted successfully.',
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
                    message: 'Lead deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(leads.actions.hasError(error));
        }
    };
}

export const uploadUserDocuments = createAsyncThunk('', async (leadId, documents) => {
    // const { documents } = params;
    console.log("documents", documents);
    
    const formData = new FormData();
  
    documents.forEach((document, index) => {
        formData.append(`files[${index}]`, document);
      // formData.append(`file${index}`, document);
    //   formData.append(`files`, document);
    });
    
    console.log("FormData:", formData);
  
    const response = await axios.post(`/api/v1/media/multiple-document-upload/${leadId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  
    if (response.status === 200) {
        dispatch(
            openSnackbar({
                open: true,
                message: 'Files uploaded successfully',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
      return response.data.data;
    }
  
    throw new Error('Failed to upload user document');
  });

export const uploadLeadImage = createAsyncThunk('upload/leadImage', async ({ leadId, file }, { dispatch }) => {
    try {

        console.log("leadId", leadId);
        console.log("file", file);
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

        const response = await axios.post(`/api/v1/media/file-upload/${leadId}`, formData, {
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

            dispatch(leads.actions.setUploadedImageSuccess(response.data.data.file_url));

            return response.data.data.file_url;
        }

    } catch (err) {
        dispatch(
            openSnackbar({
                open: true,
                message: 'Lead could not update.',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                close: false
            })
        );
        dispatch(leads.actions.hasError(error));
    }
});
