import PropTypes from 'prop-types';

import {useEffect, useState} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Tooltip } from '@mui/material';

// third-party
import { Droppable, Draggable } from '@hello-pangea/dnd';

// project imports
import EditColumn from './EditColumn';
import Items from './Items';
import AddItem from './AddItem';
import AlertColumnDelete from './AlertColumnDelete';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import {dispatch, useDispatch, useSelector} from 'store';
import { deleteColumn } from 'store/reducers/kanban';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { DeleteOutlined } from '@ant-design/icons';
import BoardEdit from "./BoardEdit";
import AlertBoardDelete from "./AlertBoardDelete";
import {getProjectById} from "../../../../store/reducers/projects";
import {getBoards} from "../../../../store/reducers/boards";
import {useParams} from "react-router-dom";
import Tasks, {getTasks} from "../../../../store/reducers/tasks";
import TaskItem from "./TaskItem";

// column drag wrapper
const getDragWrapper = (isDragging, draggableStyle, theme, radius) => {
    // const bgcolor = theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.primary.lighter;
    return {
        minWidth: 250,
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: radius,
        userSelect: 'none',
        margin: `0 ${16}px 0 0`,
        height: '100%',
        ...draggableStyle
    };
};

// column drop wrapper
const getDropWrapper = (isDraggingOver, theme, radius) => {
    const bgcolor = theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.secondary.lighter;
    const bgcolorDrop = theme.palette.mode === ThemeMode.DARK ? theme.palette.text.disabled : theme.palette.secondary.light + 65;

    return {
        background: isDraggingOver ? bgcolorDrop : bgcolor,
        padding: '8px 16px 14px',
        width: 'auto',
        borderRadius: radius
    };
};

// ==============================|| KANBAN BOARD - COLUMN ||============================== //

const BoardTask = ({ board, index }) => {
    const theme = useTheme();
    // const dispatch = useDispatch();

    // const { items, columns, columnsOrder } = useSelector((state) => state.kanban);


    const { tasks: {
        tasks,
        total,
    }, action } = useSelector((state) => state.tasks);

    const handleBoardDelete = () => {
        setOpen(true);
    };

    const [open, setOpen] = useState(false);
    // const handleClose = (status) => {
    //     setOpen(false);
    //     if (status) {
    //         dispatch(deleteColumn(column.id, columnsOrder, columns));
    //         dispatch(
    //             openSnackbar({
    //                 open: true,
    //                 message: 'Column deleted successfully',
    //                 anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //                 variant: 'alert',
    //                 alert: {
    //                     color: 'success'
    //                 },
    //                 close: false
    //             })
    //         );
    //     }
    // };

    // useEffect(() => {
    //     dispatch(getTasks(id, board._id,0, 100, null));
    // }, [id, action])

    return (
        <Draggable draggableId={board._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getDragWrapper(snapshot.isDragging, provided.draggableProps.style, theme, `4px`)}
                >
                    <Droppable droppableId={board._id} type="item">
                        {(providedDrop, snapshotDrop) => (
                            <div
                                ref={providedDrop.innerRef}
                                {...providedDrop.droppableProps}
                                style={getDropWrapper(snapshotDrop.isDraggingOver, theme, `4px`)}
                            >
                                <Grid container alignItems="center" spacing={3}>
                                    <Grid item xs zeroMinWidth>
                                        <BoardEdit board={board} />
                                    </Grid>
                                    <Grid item sx={{ mb: 1.5 }}>
                                        <Tooltip title="Delete Board">
                                            <IconButton onClick={handleBoardDelete} aria-controls="menu-simple-card" aria-haspopup="true" color="error">
                                                <DeleteOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <AlertBoardDelete title={board.boardName} boardId={board._id} open={open} handleClose={() => {}} />
                                    </Grid>
                                </Grid>
                                {tasks.filter((task) => task.board === board._id).map((task, index) => (
                                    <TaskItem key={task._id} item={task} index={index}  />
                                ))}
                                {providedDrop.placeholder}
                                <AddItem columnId={board._id} />
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};

BoardTask.propTypes = {
    board: PropTypes.object,
    index: PropTypes.number
};

export default BoardTask;
