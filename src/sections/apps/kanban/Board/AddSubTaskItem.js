import PropTypes from 'prop-types';

import { useState } from 'react';

// material-ui
import { Button, Grid, TextField, Stack, Tooltip, Box } from '@mui/material';

// third-party
import { sub, add } from 'date-fns';
import { Chance } from 'chance';

// project imports
import { openSnackbar } from 'store/reducers/snackbar';
import SubCard from 'components/MainCard';
import { useDispatch, useSelector } from 'store';
import { addItem } from 'store/reducers/kanban';
import IconButton from 'components/@extended/IconButton';

// assets
import { CalculatorOutlined, CloseOutlined, TeamOutlined } from '@ant-design/icons';
import {createSubTask, createTask} from "../../../../store/reducers/tasks";
import {useParams} from "react-router-dom";

const chance = new Chance();

// ==============================|| KANBAN BOARD - ADD ITEM ||============================== //

const AddSubTaskItem = ({ task, subTasksOrders = [] }) => {

    const dispatch = useDispatch();

    const [addTaskBox, setAddTaskBox] = useState(false);

    const { task: parentTask } = useSelector((state) => state.tasks);

    const handleAddTaskChange = () => {
        setAddTaskBox((prev) => !prev);
    };

    const [title, setTitle] = useState('');
    const [isTitle, setIsTitle] = useState(false);

    const handleAddTask = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            addTask();
        }
    };

    const addTask = () => {
        if (title.length > 0) {

            dispatch(createSubTask(task.project, task.board, task._id, {
                title,
                status: "Todo",
                startDate: new Date(),
                endDate: add(new Date(), { days: 1, hours: 0, minutes: 0 }),
            }, subTasksOrders, parentTask))

            handleAddTaskChange();
            setTitle('');
        } else {
            setIsTitle(true);
        }
    };

    const handleTaskTitle = (event) => {
        const newTitle = event.target.value;
        setTitle(newTitle);
        if (newTitle.length <= 0) {
            setIsTitle(true);
        } else {
            setIsTitle(false);
        }
    };

    return (
        <Grid container alignItems="center" spacing={1} sx={{ marginTop: 1 }}>
            {addTaskBox && (
                <Grid item xs={12}>
                    <SubCard content={false}>
                        <Box sx={{ p: 2, pb: 1.5, transition: 'background-color 0.25s ease-out' }}>
                            <Grid container alignItems="center" spacing={0.5}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        placeholder="Add SubTask"
                                        value={title}
                                        onChange={handleTaskTitle}
                                        sx={{
                                            mb: 3,
                                            '& input': { bgcolor: 'transparent', p: 0, borderRadius: '0px' },
                                            '& fieldset': { display: 'none' },
                                            '& .MuiFormHelperText-root': {
                                                ml: 0
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: 'transparent',
                                                '&.Mui-focused': {
                                                    boxShadow: 'none'
                                                }
                                            }
                                        }}
                                        onKeyUp={handleAddTask}
                                        helperText={isTitle ? 'Task title is required.' : ''}
                                        error={isTitle}
                                    />
                                </Grid>
                                <Grid item>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Tooltip title="Cancel">
                                            <IconButton size="small" color="error" onClick={handleAddTaskChange}>
                                                <CloseOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Button variant="contained" color="primary" onClick={addTask} size="small">
                                            Add
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </SubCard>
                </Grid>
            )}
            {!addTaskBox && (
                <Grid item xs={12}>
                    <Button variant="dashed" color="secondary" fullWidth onClick={handleAddTaskChange}>
                        Add SubTask
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};
AddSubTaskItem.propTypes = {
    taskId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};
export default AddSubTaskItem;
