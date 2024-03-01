import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { DeleteFilled } from '@ant-design/icons';
import {dispatch, useSelector} from "../../../../store";
import {deleteBoard} from "../../../../store/reducers/boards";
import {useParams} from "react-router-dom";
import {deleteSubTask} from "../../../../store/reducers/tasks";

// ==============================|| KANBAN BOARD - COLUMN DELETE ||============================== //

export default function AlertSubTaskDelete({ title, subTask, open, handleClose }) {

    const { subTasksOrder } = useSelector((state) => state.tasks);
    const { task: parentTask } = useSelector((state) => state.tasks);

    const deleteBoardHandler = () => {
        handleClose(false)
        dispatch(deleteSubTask(subTask.project, subTask.board, subTask.parentTask, subTask._id, subTasksOrder, parentTask))
    }

    return (
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            keepMounted
            maxWidth="xs"
            TransitionComponent={PopupTransition}
            aria-labelledby="column-delete-title"
            aria-describedby="column-delete-description"
        >
            <DialogContent sx={{ mt: 2, my: 1 }}>
                <Stack alignItems="center" spacing={3.5}>
                    <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                        <DeleteFilled />
                    </Avatar>
                    <Stack spacing={2}>
                        <Typography variant="h4" align="center">
                            Are you sure you want to delete?
                        </Typography>
                        <Typography align="center">
                            By deleting
                            <Typography variant="subtitle1" component="span">
                                {' '}
                                &quot;{title}&quot;{' '}
                            </Typography>
                            column, all task inside that column will also be deleted.
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                        <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button fullWidth color="error" variant="contained" onClick={deleteBoardHandler} autoFocus>
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

AlertSubTaskDelete.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool,
    handleClose: PropTypes.func
};
