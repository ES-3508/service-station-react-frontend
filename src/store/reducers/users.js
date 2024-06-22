import { dispatch } from "store";
import axios from "utils/axios";

const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    user: null,
    users: {
        users: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedUser: {},
}

const users = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getUsersSuccess(state, action) {
            state.users = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },
    }
});

export default users.reducer;

export function setActionTask() {
    dispatch(users.actions.setAction());
}

export function getUsers(pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/user?page=${pageIndex + 1}&limit=${pageSize}`;

            // if (query) {
            //     requestUrl = `${requestUrl}&query=${query}`
            // }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(users.actions.getUsersSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(users.actions.hasError(error));
        }
    };
}