import PropTypes from 'prop-types';

import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {CardMedia, Checkbox, Chip, Grid, Link, Menu, MenuItem, Stack, Tooltip, Typography} from '@mui/material';

// third-party
import { Draggable } from '@hello-pangea/dnd';

// project imports
import { useDispatch, useSelector } from 'store';
import { selectItem, deleteItem } from 'store/reducers/kanban';

// assets
import {createSubTask, deleteTask, getTaskById, setSelectedTask, updateSubTask} from "../../../../store/reducers/tasks";
import {add} from "date-fns";
import IconButton from "../../../../components/@extended/IconButton";
import {DeleteOutlined} from "@ant-design/icons";
import AlertBoardDelete from "./AlertBoardDelete";
import AlertSubTaskDelete from "./AlertSubTaskDelete";

// item drag wrapper
const getDragWrapper = (isDragging, draggableStyle, theme, radius) => {
    const bgcolor = theme.palette.background.paper + 99;
    return {
        userSelect: 'none',
        margin: `0 0 ${8}px 0`,
        padding: 16,
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: isDragging ? bgcolor : theme.palette.background.paper,
        borderRadius: radius,
        ...draggableStyle
    };
};

// ==============================|| KANBAN BOARD - ITEMS ||============================== //

const SubTaskItem = ({ item, index }) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { subTasksOrder } = useSelector((state) => state.tasks);
    const { task: parentTask } = useSelector((state) => state.tasks);

    const handlerDetails = (id) => {
        dispatch(selectItem(id));
    };

    const detailsHandler = (task) => {
        dispatch(getTaskById(task.project, task.board, task._id));
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const [open, setOpen] = useState(false);
    const handleModalClose = (status) => {
        setOpen(false);
        if (status) {
            dispatch(deleteTask(item.project, item.board, item._id));
        }
    };

    // const [openStoryDrawer, setOpenStoryDrawer] = useState(false);
    // const handleStoryDrawerOpen = () => {
    //     setOpenStoryDrawer((prevState) => !prevState);
    // };
    //
    // const editStory = () => {
    //     setOpenStoryDrawer((prevState) => !prevState);
    // };

    function getPriorityColor(priority) {
        switch (priority) {
            case "High":
                return "primary";
            case "Medium":
                return "warning";
            case "Low":
                return "secondary";
            default:
                return "warning"
        }
    }

    const handleChangeState = (event) => {

        dispatch(updateSubTask(item.project, item.board, item.parentTask, item._id, {
            ...item,
            status: event.target.checked ? "Done" : "Todo",
        }, subTasksOrder, parentTask))
    }

    const handleSubTaskDelete = () => {
        setOpen(true);
    };

    return (
        <Draggable key={item._id} draggableId={item._id} index={index} isDragDisabled={item.isPending}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getDragWrapper(snapshot.isDragging, provided.draggableProps.style, theme, `4px`)}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ '& .Mui-checked + h6': { textDecoration: 'line-through' }, opacity: item.isPending ? 0.2 : 1 }}>
                        <Checkbox checked={item.status === "Done"} onChange={handleChangeState} name="checkedA" color="primary" />
                        <Typography
                            onClick={() => detailsHandler(item)}
                            variant="subtitle1"
                            sx={{
                                display: 'inline-block',
                                width: 'calc(100% - 34px)',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {item.title}
                        </Typography>

                        <Tooltip title="Delete Board">
                            <IconButton onClick={handleSubTaskDelete} aria-controls="menu-simple-card" aria-haspopup="true" color="error">
                                <DeleteOutlined />
                            </IconButton>
                        </Tooltip>
                        <AlertSubTaskDelete title={item.title} subTask={item} open={open} handleClose={handleClose} />

                        {/*<IconButton size="small" color="secondary" onClick={handleClick} aria-controls="menu-comment" aria-haspopup="true">*/}
                        {/*    <MoreOutlined />*/}
                        {/*</IconButton>*/}
                        {/*<Menu*/}
                        {/*    id="menu-comment"*/}
                        {/*    anchorEl={anchorEl}*/}
                        {/*    keepMounted*/}
                        {/*    open={Boolean(anchorEl)}*/}
                        {/*    onClose={handleClose}*/}
                        {/*    variant="selectedMenu"*/}
                        {/*    anchorOrigin={{*/}
                        {/*        vertical: 'bottom',*/}
                        {/*        horizontal: 'right'*/}
                        {/*    }}*/}
                        {/*    transformOrigin={{*/}
                        {/*        vertical: 'top',*/}
                        {/*        horizontal: 'right'*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <MenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            handleClose();*/}
                        {/*            detailsHandler(item);*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Edit*/}
                        {/*    </MenuItem>*/}
                        {/*    <MenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            handleClose();*/}
                        {/*            setOpen(true);*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Delete*/}
                        {/*    </MenuItem>*/}
                        {/*</Menu>*/}
                        {/*<AlertItemDelete title={item.title} open={open} handleClose={handleModalClose} />*/}
                    </Stack>
                    {/*<Stack direction="row" mt={1}>*/}
                    {/*    <Chip*/}
                    {/*        variant="combined"*/}
                    {/*        color={getPriorityColor(item.status)}*/}
                    {/*        label={item.status}*/}
                    {/*        size="small"*/}
                    {/*    />*/}
                    {/*</Stack>*/}
                    {/*<Stack direction="row" mt={1} justifyContent='space-between'>*/}
                    {/*    <Stack direction="row" alignItems={'center'} gap={0.25}>*/}
                    {/*        <ClockCircleOutlined style={iconSX} />*/}
                    {/*        <Typography variant='caption'>{format(parseISO(item.startDate), "M/d/yyyy")}</Typography>*/}
                    {/*    </Stack>*/}
                    {/*    <Typography variant='caption'>&#8594;</Typography>*/}
                    {/*    <Stack direction="row" alignItems={'center'} gap={0.25}>*/}
                    {/*        <ClockCircleOutlined style={iconSX} />*/}
                    {/*        <Typography variant='caption'>{format(parseISO(item.endDate), "M/d/yyyy")}</Typography>*/}
                    {/*    </Stack>*/}

                    {/*</Stack>*/}
                </div>
            )}
        </Draggable>
    );
};

SubTaskItem.propTypes = {
    index: PropTypes.number,
    item: PropTypes.object
};

export default SubTaskItem;
