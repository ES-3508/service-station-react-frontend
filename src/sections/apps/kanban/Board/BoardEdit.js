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
import {useAsyncDebounce} from "react-table";
import {useState} from "react";

// ==============================|| KANBAN BOARD - COLUMN EDIT ||============================== //

const BoardEdit = ({ board }) => {
    const { id } = useParams()
    const theme = useTheme();
    const dispatch = useDispatch();

    const [fieldValue, setFieldValue] = useState(board.boardName);

    const onChange = useAsyncDebounce((value) => {
        if (value && value.length > 0) {
            dispatch(
                updateBoard(id, board._id, {
                    boardName: value,
                })
            );
        }

    }, 200);

    const handleColumnRename = (event) => {
        setFieldValue(event.target.value)
        onChange(event.target.value);
    };

    return (
        <OutlinedInput
            fullWidth
            value={fieldValue}
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
