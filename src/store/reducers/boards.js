import { dispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "./snackbar";

const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    action: false,
    error: null,
    board: {},
    boards: {
        boards: [],
        page: null,
        total: null,
        limit: null,
    },
    deletedBoard: {},
}

const boards = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getBoardsSuccess(state, action) {
            state.boards = action.payload;
        },

        deleteBoardSuccess(state, action) {
            state.deletedBoard = action.payload;
        },

        setAction(state) {
            state.action = !state.action;
        },
    }
});

export default boards.reducer;

export function setActionBoard() {
    dispatch(boards.actions.setAction());
}

export function getBoards(projectId, pageIndex = 0, pageSize = 10, query) {
    return async () => {
        try {

            let requestUrl = `/api/v1/project/${projectId}/board?page=${pageIndex + 1}&limit=${pageSize}`;

            if (query) {
                requestUrl = `${requestUrl}&query=${query}`
            }

            const response = await axios.get(requestUrl);

            if (response.status === 200) {
                dispatch(boards.actions.getBoardsSuccess(response.data.data));
            }

        } catch (error) {
            dispatch(boards.actions.hasError(error));
        }
    };
}

export function createCustomer(projectId, values) {
    return async () => {
        try {
            const response = await axios.post(`/api/v1/project/${projectId}/board`, values);

            if (response.status === 200) {

                setActionBoard();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Board crated successfully.',
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
                    message: 'Board could not create.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(boards.actions.hasError(err));
        }
    }
}

export function updateBoard(projectId, boardId, values) {
    return async () => {
        try {
            const response = await axios.put(`/api/v1/project/${projectId}/board/${boardId}/update`, values);

            if (response.status === 200) {

                setActionBoard();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Board updated successfully.',
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
                    message: 'Board could not update.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(boards.actions.hasError(err));
        }
    }
}

export function deleteBoard(projectId, boardId) {
    return async () => {
        try {
            const response = await axios.delete(`/api/v1/project/${projectId}/board/${boardId}/delete`);

            if (response.status === 200) {

                dispatch(boards.actions.deleteBoardSuccess(response.data));

                setActionBoard();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Board deleted successfully.',
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
                    message: 'Board deleted failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            dispatch(boards.actions.hasError(error));
        }
    };
}