import { useState } from 'react';

// material-ui
import { Button, Grid, TextField, Stack, useTheme, Tooltip, Box } from '@mui/material';

// third-party
import { Chance } from 'chance';

// project imports
import MainCard from 'components/MainCard';
import SubCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';
import { useDispatch, useSelector } from 'store';
import { addColumn } from 'store/reducers/kanban';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CloseOutlined } from '@ant-design/icons';
import {createBoard} from "../../../../store/reducers/boards";
import {useParams} from "react-router-dom";

const chance = new Chance();

// ==============================|| KANBAN BOARD - ADD COLUMN ||============================== //

const AddBoard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { id } = useParams()

    const [title, setTitle] = useState('');
    const [isTitle, setIsTitle] = useState(false);

    const [isAddBoard, setIsAddBoard] = useState(false);
    const { columns, columnsOrder } = useSelector((state) => state.kanban);
    const handleAddBoardChange = () => {
        setIsAddBoard((prev) => !prev);
    };

    const addNewBoard = () => {
        if (title.length > 0) {

            dispatch(createBoard(id, {
                boardName: title,
            }))

            // const newBoard = {
            //     id: `${chance.integer({ min: 1000, max: 9999 })}`,
            //     title,
            //     itemIds: []
            // };
            //
            // dispatch(addColumn(newBoard, columns, columnsOrder));
            // dispatch(
            //     openSnackbar({
            //         open: true,
            //         message: 'Board Added successfully',
            //         anchorOrigin: { vertical: 'top', horizontal: 'right' },
            //         variant: 'alert',
            //         alert: {
            //             color: 'success'
            //         },
            //         close: false
            //     })
            // );
            setIsAddBoard((prev) => !prev);
            setTitle('');
        } else {
            setIsTitle(true);
        }
    };

    const handleAddBoard = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            addNewBoard();
        }
    };

    const handleBoardTitle = (event) => {
        const newTitle = event.target.value;
        setTitle(newTitle);
        if (newTitle.length <= 0) {
            setIsTitle(true);
        } else {
            setIsTitle(false);
        }
    };

    return (
        <MainCard
            sx={{
                minWidth: 250,
                backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.secondary.lighter,
                height: '100%',
                borderColor: theme.palette.divider
            }}
            contentSX={{ p: 1.5, '&:last-of-type': { pb: 1.5 } }}
        >
            <Grid container alignItems="center" spacing={1}>
                {isAddBoard && (
                    <Grid item xs={12}>
                        <SubCard content={false}>
                            <Box sx={{ p: 2, pb: 1.5, transition: 'background-color 0.25s ease-out' }}>
                                <Grid container alignItems="center" spacing={0.5}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            placeholder="Add Board"
                                            value={title}
                                            onChange={handleBoardTitle}
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
                                            onKeyUp={handleAddBoard}
                                            helperText={isTitle ? 'Board title is required.' : ''}
                                            error={isTitle}
                                        />
                                    </Grid>
                                    <Grid item xs zeroMinWidth />
                                    <Grid item>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Tooltip title="Cancel">
                                                <IconButton size="small" color="error" onClick={handleAddBoardChange}>
                                                    <CloseOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Button variant="contained" color="primary" onClick={addNewBoard} size="small">
                                                Add
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        </SubCard>
                    </Grid>
                )}
                {!isAddBoard && (
                    <Grid item xs={12}>
                        <Button variant="dashed" color="secondary" fullWidth onClick={handleAddBoardChange}>
                            Add Board
                        </Button>
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

export default AddBoard;
