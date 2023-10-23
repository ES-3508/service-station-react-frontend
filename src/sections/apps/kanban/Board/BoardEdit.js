import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { OutlinedInput } from '@mui/material';

// project imports
import { ThemeMode } from 'config';
import { useDispatch, useSelector } from 'store';
import { editColumn } from 'store/reducers/kanban';
import {updateBoard} from "../../../../store/reducers/boards";
import {useParams} from "react-router-dom";

// ==============================|| KANBAN BOARD - COLUMN EDIT ||============================== //

const BoardEdit = ({ board }) => {
    const { id } = useParams()
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleColumnRename = (event) => {
        dispatch(
            updateBoard(id, board._id, {
                boardName: event.target.value,
                order: board.order,
            })
        );
    };

    return (
        <OutlinedInput
            fullWidth
            value={board.boardName}
            onChange={handleColumnRename}
            sx={{
                mb: 1.5,
                fontWeight: 500,
                '& input:focus': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[100] : theme.palette.grey[50]
                },
                '& input:hover': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[100] : theme.palette.grey[50]
                },
                '& input:hover + fieldset': {
                    display: 'block'
                },
                '&, & input': { bgcolor: 'transparent' },
                '& fieldset': { display: 'none' },
                '& input:focus + fieldset': { display: 'block' }
            }}
        />
    );
};

BoardEdit.propTypes = {
    board: PropTypes.object
};

export default BoardEdit;
