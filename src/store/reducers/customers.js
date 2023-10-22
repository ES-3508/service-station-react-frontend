import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    customer: {},
    customers: {
        customers: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedCustomer: {},
}

const customers = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getCustomersSuccess(state, action) {
            state.customers = action.payload;
        },

        deleteCustomerSuccess(state, action) {
            state.deletedCustomer = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        }
    }
});

export default customers.reducer;

export function setActionCustomer() {
    dispatch(customers.actions.setAction());
}

export function getCustomers(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/customer?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(customers.actions.getCustomersSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(customers.actions.hasError(error));
        }
    };
}

export function createCustomer(values) {
    return async () => {
        try {
            const response = await axios.post('/api/v1/customer', {
                ...values,
                phone: Number(values.phone),
                age: Number(values.age),
                // TODO: set uploaded image,
                imageUrl: "https://uploads-ssl.webflow.com/63f46d18f2e566716e8d3a69/63f88caea3a61965fef45229_oguz-yagiz-kara-MZf0mI14RI0-unsplash%20(1)-p-500.jpg"
            });

            if (response.status === 200) {

                setActionCustomer();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Customer crated successfully.',
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
                    message: 'Customer could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(customers.actions.hasError(error));
        }
    }
}

export function updateCustomer(customerId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/customer/${customerId}/update`, {
                ...values,
                phone: Number(values.phone),
                age: Number(values.age),
                // TODO: set uploaded image,
                imageUrl: "https://uploads-ssl.webflow.com/63f46d18f2e566716e8d3a69/63f88caea3a61965fef45229_oguz-yagiz-kara-MZf0mI14RI0-unsplash%20(1)-p-500.jpg"
            });

            if (response.status === 200) {

                setActionCustomer();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Customer updated successfully.',
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
                    message: 'Customer could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(customers.actions.hasError(error));
        }
    }
}

export function deleteCustomer(customerId) {
    return async () => {
        try {
            const response = await axios.delete(`/api/v1/customer/${customerId}/delete`);

            if (response.status === 200) {

                dispatch(customers.actions.deleteCustomerSuccess(response.data));

                setActionCustomer();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Customer deleted successfully.',
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
                    message: 'Customer deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(customers.actions.hasError(error));
        }
    };
}