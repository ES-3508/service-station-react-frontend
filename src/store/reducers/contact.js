import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    contact: {},
    contacts: {
        contacts: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedcontact: {},
    uploadedImageUrl: null,
}

const contacts = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET leadS
        getContactsSuccess(state, action) {
            state.contacts = action.payload;
        },

        deleteContactSuccess(state, action) {
            state.deletedcontact = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },

        setUploadedImageSuccess(state, action) {
            state.uploadedImageUrl = action.payload;
        }
    }
});

export default contacts.reducer;

export function setActionContacts() {
    dispatch(contacts.actions.setAction());
}

export function getContacts(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/contact?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);
            console.log("contacts response",response);

            if (response.status === 200) {
                dispatch(contacts.actions.getContactsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(contacts.actions.hasError(error));
        }
    };
}

export function createContact(values) {
    return async () => {
        try {
            const response = await axios.post('/api/v1/contact', {
                ...values,
                phone: Number(values.phone),
                age: Number(values.age),
                // TODO: set uploaded image,
                // imageUrl: "https://uploads-ssl.webflow.com/63f46d18f2e566716e8d3a69/63f88caea3a61965fef45229_oguz-yagiz-kara-MZf0mI14RI0-unsplash%20(1)-p-500.jpg"
            });

            if (response.status === 200) {

                setActionContacts();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Contact crated successfully.',
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
                    message: 'Contacts could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(contacts.actions.hasError(err));
        }
    }
}

export function updateContact(leadId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/contact/${leadId}/update`, {
                ...values,
                age: Number(values.age),
            });

            if (response.status === 200) {

                setActionContacts();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Contact updated successfully.',
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
                    message: 'Contact could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(contacts.actions.hasError(err));
        }
    }
}


export function deleteContact(leadId) {
    return async () => {
        try {
            const response = await axios.post(`/api/v1/contact/${leadId}/delete`);

            if (response.status === 200) {

                dispatch(contacts.actions.deleteContactSuccess(response.data));

                setActionContacts();

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
            dispatch(contacts.actions.hasError(error));
        }
    };
}

export function deleteNote(leadId, noteId) {
    return async () => {
        console.log("leadId", leadId);
        console.log("noteid", noteId);
        try {
            const response = await axios.delete(`/api/v1/lead/${leadId}/notes/${noteId}`);
            if (response.status === 200) {

                dispatch(leads.actions.deleteLeadSuccess(response.data));

                setActionLead();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Lead note deleted successfully.',
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
                    message: 'Lead note deleted failed.',
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

export function deleteFile(leadId, fileId) {
    return async () => {
        console.log("leadId", leadId);
        console.log("fileId", fileId);
        try {
            const response = await axios.delete(`/api/v1/lead/${leadId}/files/${fileId}`);
            if (response.status === 200) {

                dispatch(leads.actions.deleteLeadSuccess(response.data));

                setActionLead();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Lead file deleted successfully.',
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
                    message: 'Lead file deleted failed.',
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

export const uploadLeadImage = createAsyncThunk('upload/leadImage', async ({ leadId, file, schemaName }, { dispatch }) => {
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

        const response = await axios.post(`/api/v1/media/file-upload/${leadId}/${schemaName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            setActionLead();
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
