import PropTypes from 'prop-types';

import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {CardMedia, Chip, Link, Menu, MenuItem, Stack, Tooltip, Typography} from '@mui/material';

// third-party
import { Draggable } from '@hello-pangea/dnd';

// project imports
import EditStory from '../Backlogs/EditStory';
import AlertItemDelete from './AlertItemDelete';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch, useSelector } from 'store';
import { selectItem, deleteItem } from 'store/reducers/kanban';
import IconButton from 'components/@extended/IconButton';

// assets
import {ClockCircleOutlined, ClusterOutlined, FallOutlined, MoreOutlined, RiseOutlined} from '@ant-design/icons';
import {deleteTask, getTaskById, setSelectedTask} from "../../../../store/reducers/tasks";
import {format, parseISO} from "date-fns";
import {ThemeMode} from "../../../../config";
import LinearWithLabel from "../../../../components/@extended/progress/LinearWithLabel";

// const backImage = require.context('assets/images/profile', true);

const iconSX = {
    fontSize: '0.675rem'
};

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

const TaskItem = ({ item, index }) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    // const backProfile = item.image && backImage(`./${item.image}`);

    const kanban = useSelector((state) => state.kanban);
    const { userStory, items, columns } = kanban;

    const itemStory = userStory.filter((story) => story?.itemIds?.filter((itemId) => itemId === item.id)[0])[0];
    // const itemStory = userStory.filter((story) => story?.itemIds?.filter((itemId) => itemId === item.id)[0])[0];

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
        setAnchorEl(null);
    };

    const [open, setOpen] = useState(false);
    const handleModalClose = (status) => {
        setOpen(false);
        if (status) {
            dispatch(deleteTask(item.project, item.board, item._id));
        }
    };

    const [openStoryDrawer, setOpenStoryDrawer] = useState(false);
    const handleStoryDrawerOpen = () => {
        setOpenStoryDrawer((prevState) => !prevState);
    };

    const editStory = () => {
        setOpenStoryDrawer((prevState) => !prevState);
    };

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

    return (
        <Draggable key={item._id} draggableId={item._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getDragWrapper(snapshot.isDragging, provided.draggableProps.style, theme, `4px`)}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: itemStory ? -0.75 : 0 }}>
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

                        <IconButton size="small" color="secondary" onClick={handleClick} aria-controls="menu-comment" aria-haspopup="true">
                            <MoreOutlined />
                        </IconButton>
                        <Menu
                            id="menu-comment"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            variant="selectedMenu"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    detailsHandler(item);
                                }}
                            >
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    setOpen(true);
                                }}
                            >
                                Delete
                            </MenuItem>
                        </Menu>
                        <AlertItemDelete title={item.title} open={open} handleClose={handleModalClose} />
                    </Stack>
                    <Stack direction="row" mt={1}>
                        <Chip
                            variant="combined"
                            color={getPriorityColor(item.priority)}
                            label={item.priority}
                            size="small"
                        />
                    </Stack>
                    <Stack direction="row" mt={1} justifyContent='space-between'>
                        <Stack direction="row" alignItems={'center'} gap={0.25}>
                            <ClockCircleOutlined style={iconSX} />
                            {/* <Typography variant='caption'>{format(parseISO(item.startDate), "M/d/yyyy")}</Typography> */}
                        </Stack>
                        <Typography variant='caption'>&#8594;</Typography>
                        <Stack direction="row" alignItems={'center'} gap={0.25}>
                            <ClockCircleOutlined style={iconSX} />
                            {/* <Typography variant='caption'>{format(parseISO(item.endDate), "M/d/yyyy")}</Typography> */}
                        </Stack>

                    </Stack>
                    {/*{itemStory && (*/}
                    {/*    <>*/}
                    {/*        <Stack direction="row" spacing={0.5} alignItems="center">*/}
                    {/*            <Tooltip title="User Story">*/}
                    {/*                <ClusterOutlined style={{ color: theme.palette.primary.dark, fontSize: '0.75rem' }} />*/}
                    {/*            </Tooltip>*/}
                    {/*            <Tooltip title={itemStory.title}>*/}
                    {/*                <Link variant="caption" color="primary.dark" underline="hover" onClick={editStory} sx={{ cursor: 'pointer', pt: 0.5 }}>*/}
                    {/*                    User Story #{itemStory.id}*/}
                    {/*                </Link>*/}
                    {/*            </Tooltip>*/}
                    {/*        </Stack>*/}
                    {/*        <EditStory story={itemStory} open={openStoryDrawer} handleDrawerOpen={handleStoryDrawerOpen} />*/}
                    {/*    </>*/}
                    {/*)}*/}
                    {/*{backProfile && (*/}
                    {/*    <CardMedia component="img" image={backProfile} sx={{ width: '100%', borderRadius: 1, mt: 1.5 }} title="Slider5 image" />*/}
                    {/*)}*/}
                    {item.subTaskOrders?.length > 0 && (
                        <LinearWithLabel showValue={false} mt={1} value={item.progress} color="primary" />
                    )}

                </div>
            )}
        </Draggable>
    );
};

TaskItem.propTypes = {
    index: PropTypes.number,
    item: PropTypes.object
};

export default TaskItem;
