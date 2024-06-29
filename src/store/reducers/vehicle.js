import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    vehicle: {},
    vehicles: {
        vehicles: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedVehivle: {},
    uploadedImageUrl: null,
}

const vehicles = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET leadS
        getVehiclesSuccess(state, action) {
            state.vehicles = action.payload;
        },

        deleteVehicleSuccess(state, action) {
            state.deletedVehivle = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },

        setUploadedImageSuccess(state, action) {
            state.uploadedImageUrl = action.payload;
        }
    }
});

export default vehicles.reducer;

export function setActionVehicles() {
    dispatch(vehicles.actions.setAction());
}

export function getVehicles(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/vehicle?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(vehicles.actions.getVehiclesSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(vehicles.actions.hasError(error));
        }
    };
}

export function createVehicle(values) {
    return async () => {
        try {
            const response = await axios.post('/api/v1/vehicle', {
                ...values,
                manufactureYear: Number(values.manufactureYear),
                // TODO: set uploaded image,
                // imageUrl: "https://uploads-ssl.webflow.com/63f46d18f2e566716e8d3a69/63f88caea3a61965fef45229_oguz-yagiz-kara-MZf0mI14RI0-unsplash%20(1)-p-500.jpg"
            });

            if (response.status === 200) {

                setActionVehicles();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Vehicle crated successfully.',
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
                    message: 'Vehicle could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(vehicles.actions.hasError(err));
        }
    }
}

export function updateVehivle(leadId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/vehicle/${leadId}/update`, {
                ...values,
                age: Number(values.age),
            });

            if (response.status === 200) {

                setActionVehicles();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Vehicle updated successfully.',
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
                    message: 'Vehicle could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(vehicles.actions.hasError(err));
        }
    }
}


export function deleteVehicle(leadId) {
    return async () => {
        try {
            const response = await axios.post(`/api/v1/vehicle/${leadId}/delete`);

            if (response.status === 200) {

                dispatch(vehicles.actions.deleteVehicleSuccess(response.data));

                setActionVehicles();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Vehicle deleted successfully.',
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
                    message: 'Vehicle deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(vehicles.actions.hasError(error));
        }
    };
}
