import PropTypes from 'prop-types';

// material-ui
import {
    Autocomplete, Avatar,
    Box,
    Button, Chip,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem, OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField, Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// third-party
import * as yup from 'yup';
import { useFormik } from 'formik';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'store/reducers/snackbar';
import {dispatch, useDispatch, useSelector} from 'store';
import { editItem } from 'store/reducers/kanban';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import LinearWithLabel from "../../../../components/@extended/progress/LinearWithLabel";
import AttachmentsPreview from "./AttachmentsPreview";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import {getUsers} from "../../../../store/reducers/users";
import {useTheme} from "@mui/material/styles";
import {updateProject, uploadProjectAttachment} from "../../../../store/reducers/projects";
import {updateTask, uploadTaskAttachments} from "../../../../store/reducers/tasks";
import IconButton from "../../../../components/@extended/IconButton";
import {FileAddOutlined} from "@ant-design/icons";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};
// const avatarImage = require.context('assets/images/users', true);
const validationSchema = yup.object({
    title: yup.string().required('Task title is required'),
    startDate: Yup.date().optional(),
    endDate: Yup
        .date()
        .when('startDate', (date, schema) => date && schema.min(date, "End date can't be before start date"))
        .nullable()
        .optional(),
    reminder: Yup
        .date()
        .min(new Date(), "Reminders can only set to future dates")
        .nullable()
        .optional(),
});

function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
}

// ==============================|| KANBAN BOARD - ITEM EDIT ||============================== //

const EditTaskItem = ({ item, profiles, columns, handleDrawerOpen }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { users: { users } } = useSelector((state) => state.users);
    // const itemUserStory = userStory.filter((story) => story.itemIds.filter((itemId) => itemId === item.id)[0])[0];
    const itemColumn = columns.filter((column) => column.itemIds.filter((itemId) => itemId === item.id)[0])[0];

    function getPriority(priority) {
        switch (priority) {
            case "low":
                return "Low";
            case "medium":
                return "Medium";
            case "high":
                return "High";
            default:
                return "Low";
        }
    }

    const [attachments, setAttachments] = useState(item.attachments);
    const [assignees, setAssignees] = useState(item.assignTo ? item.assignTo : []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: item._id,
            title: item.title,
            // assign: item.assign,
            priority: item.priority.toLowerCase(),
            endDate: item.endDate ? new Date(item.endDate) : new Date(),
            startDate: item.startDate ? new Date(item.startDate) : new Date(),
            description: item.description ? item.description : '',
            // commentIds: item.commentIds,
            // storyId: itemUserStory ? itemUserStory.id : '',
            columnId: itemColumn ? itemColumn.id : '',
            files: null,
            progress: item.progress,
            taskLeader: item.taskLeader ? item.taskLeader : '',
            reminder: item.reminder ? new Date(item.reminder) : null,
            subTaskOrders: item.subTaskOrders,
        },
        validationSchema,
        onSubmit: (values) => {

            if (values.files) {
                dispatch(uploadTaskAttachments(values.files))
                    .then((fileUrls) => {
                        if (fileUrls) {

                            if (attachments.length > 0) {
                                dispatch(updateTask(item.project, item.board, item._id, {
                                    ...values,
                                    assignTo: assignees.map((assignee) => assignee._id),
                                    attachments: [...attachments, ...fileUrls.payload],
                                    priority: getPriority(values.priority)
                                }));
                            } else {
                                dispatch(updateTask(item.project, item.board, item._id, {
                                    ...values,
                                    assignTo: assignees.map((assignee) => assignee._id),
                                    attachments: fileUrls.payload,
                                    priority: getPriority(values.priority)
                                }));
                            }

                        }
                    })
            } else {
                dispatch(updateTask(item.project, item.board, item._id, {
                    ...values,
                    assignTo: assignees.map((assignee) => assignee._id),
                    attachments,
                    priority: getPriority(values.priority)
                }));
            }

            handleDrawerOpen();


            // console.log({
            //     ...values,
            //     assignees: assignees.map((assignee) => assignee._id),
            //     attachments,
            // });

            // const itemToEdit = {
            //     id: values.id,
            //     title: values.title,
            //     assign: values.assign,
            //     priority: values.priority.toLowerCase(),
            //     endDate: values.endDate ? new Date(values.endDate) : new Date(),
            //     startDate: values.startDate ? new Date(values.startDate) : new Date(),
            //     description: values.description,
            //     commentIds: values.commentIds,
            //     image: values.image,
            //     attachments: values.attachments
            // };
            // // dispatch(editItem(values.columnId, columns, itemToEdit, items, values.storyId, userStory));
            // dispatch(
            //     openSnackbar({
            //         open: true,
            //         message: 'Submit Success',
            //         variant: 'alert',
            //         alert: {
            //             color: 'success'
            //         },
            //         close: false
            //     })
            // );

        }
    });

    const handleChange = (event) => {
        const {
            target: { value }
        } = event;
        setAssignees(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2.5}>

                    {/*Progress*/}
                    {formik.values.subTaskOrders?.length > 0 && (
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <InputLabel>Progress</InputLabel>
                                <LinearWithLabel value={formik.values.progress} color="primary" />
                            </Stack>
                        </Grid>
                    )}

                    {/*End of Progress*/}

                    {/*Title*/}
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Title</InputLabel>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                placeholder="Title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Stack>
                    </Grid>
                    {/*End of Title*/}

                    {/*Task Leader*/}
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Task Leader</InputLabel>
                            <TextField
                                fullWidth
                                id="taskLeader"
                                name="taskLeader"
                                placeholder="Task Leader"
                                value={formik.values.taskLeader}
                                onChange={formik.handleChange}
                                error={formik.touched.taskLeader && Boolean(formik.errors.taskLeader)}
                                helperText={formik.touched.taskLeader && formik.errors.taskLeader}
                            />
                        </Stack>
                    </Grid>
                    {/*End of Task Leader*/}

                    {/*Assignees*/}
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Assign to</InputLabel>

                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={assignees}
                                onChange={handleChange}
                                input={<OutlinedInput id="select-multiple-chip" placeholder="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((user) => (
                                            <Chip key={user._id} label={user.name} variant="light" color="primary" size="small" />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {users && users.map((user) => (
                                    <MenuItem key={user._id} value={user} style={getStyles(user, assignees, theme)}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>

                            {/*<Autocomplete*/}
                            {/*    id="assign"*/}
                            {/*    fullWidth*/}
                            {/*    autoHighlight*/}
                            {/*    options={users}*/}
                            {/*    value={users.find((user) => user._id === formik.values.assign)}*/}
                            {/*    getOptionLabel={(option) => option.name}*/}
                            {/*    isOptionEqualToValue={(option) => option._id === formik.values.assign}*/}
                            {/*    renderOption={(props, option) => (*/}
                            {/*        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>*/}
                            {/*            <Avatar size={20} alt="avatar" src={null} mr={1}>*/}
                            {/*                {option.name.charAt(0)+" "+option.name.charAt(0)}*/}
                            {/*            </Avatar>*/}
                            {/*            {option.name}*/}
                            {/*        </Box>*/}
                            {/*    )}*/}
                            {/*    renderInput={(params) => (*/}
                            {/*        <TextField*/}
                            {/*            {...params}*/}
                            {/*            name="assign"*/}
                            {/*            placeholder="Choose an assignee"*/}
                            {/*            inputProps={{*/}
                            {/*                ...params.inputProps,*/}
                            {/*                autoComplete: 'new-password' // disable autocomplete and autofill*/}
                            {/*            }}*/}
                            {/*        />*/}
                            {/*    )}*/}
                            {/*    onChange={(event, value) => {*/}
                            {/*        formik.setFieldValue('assign', value?._id);*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </Stack>
                    </Grid>
                    {/*End of Assignees*/}

                    {/*Prioritize*/}
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Prioritize</InputLabel>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-label="color"
                                    value={formik.values.priority}
                                    onChange={formik.handleChange}
                                    name="priority"
                                    id="priority"
                                >
                                    <FormControlLabel value="low" control={<Radio color="primary" sx={{ color: 'primary.main' }} />} label="Low" />
                                    <FormControlLabel value="medium" control={<Radio color="warning" sx={{ color: 'warning.main' }} />} label="Medium" />
                                    <FormControlLabel value="high" control={<Radio color="error" sx={{ color: 'error.main' }} />} label="High" />
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                    </Grid>
                    {/*End of Prioritize*/}

                    {/*Start Date*/}
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Start date</InputLabel>
                            <DesktopDatePicker
                                value={formik.values.startDate}
                                format="dd/MM/yyyy"
                                onChange={(date) => {
                                    formik.setFieldValue('startDate', date);
                                }}
                            />
                        </Stack>
                    </Grid>
                    {/*End of Start Date*/}

                    {/*End Date*/}
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>End date</InputLabel>
                            <DesktopDatePicker
                                value={formik.values.endDate}
                                format="dd/MM/yyyy"
                                onChange={(date) => {
                                    formik.setFieldValue('endDate', date);
                                }}
                            />
                        </Stack>
                        {formik.touched.endDate && formik.errors.endDate && (
                            <Grid item xs={12}>
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {formik.errors.endDate}
                                </FormHelperText>
                            </Grid>
                        )}
                    </Grid>
                    {/*End of End Date*/}

                    {/*Reminder*/}
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Reminder</InputLabel>
                            <DesktopDatePicker
                                value={formik.values.reminder}
                                format="dd/MM/yyyy"
                                minDate={new Date()}
                                onChange={(date) => {
                                    formik.setFieldValue('reminder', date);
                                }}
                            />
                        </Stack>
                        {formik.touched.reminder && formik.errors.reminder && (
                            <Grid item xs={12}>
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {formik.errors.reminder}
                                </FormHelperText>
                            </Grid>
                        )}
                    </Grid>
                    {/*End of Reminder*/}

                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel>Description</InputLabel>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                multiline
                                rows={3}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </Stack>
                    </Grid>
                    {/*Story*/}
                    {/*<Grid item xs={12}>*/}
                    {/*    <Stack spacing={1}>*/}
                    {/*        <InputLabel>User Story</InputLabel>*/}
                    {/*        <FormControl fullWidth>*/}
                    {/*            <Select*/}
                    {/*                id="storyId"*/}
                    {/*                name="storyId"*/}
                    {/*                displayEmpty*/}
                    {/*                value={formik.values.storyId}*/}
                    {/*                onChange={formik.handleChange}*/}
                    {/*                inputProps={{ 'aria-label': 'Without label' }}*/}
                    {/*            >*/}
                    {/*                {userStory.map((story, index) => (*/}
                    {/*                    <MenuItem key={index} value={story.id}>*/}
                    {/*                        {story.id} - {story.title}*/}
                    {/*                    </MenuItem>*/}
                    {/*                ))}*/}
                    {/*            </Select>*/}
                    {/*        </FormControl>*/}
                    {/*    </Stack>*/}
                    {/*</Grid>*/}

{/*End Of Story*/}

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <InputLabel sx={{ mt: 0.5 }}>Attachments:</InputLabel>
                            </Grid>
                            <Grid item xs={12}>
                                {attachments.map((attachment) => (
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, width: '100%'}}>
                                        <IconButton key={attachment} sx={{ fontSize: 30 }}>
                                            <FileAddOutlined  />
                                        </IconButton>
                                        <Typography component="a" href={attachment} variant='caption'>{attachment}</Typography>
                                    </Box>
                                ))}
                            </Grid>
                            <Grid item xs={12}>
                                <UploadMultiFile
                                    type="STANDARD"
                                    showList={true}
                                    setFieldValue={formik.setFieldValue}
                                    files={formik.values.files}
                                    error={formik.touched.files && !!formik.errors.files}
                                />
                            </Grid>
                            {formik.touched.files && formik.errors.files && (
                                <Grid item xs={12}>
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {formik.errors.files}
                                    </FormHelperText>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <AnimateButton>
                            <Button fullWidth variant="contained" type="submit">
                                Save
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </form>
    );
};
EditTaskItem.propTypes = {
    item: PropTypes.object,
    profiles: PropTypes.array,
    columns: PropTypes.array,
    handleDrawerOpen: PropTypes.func
};
export default EditTaskItem;
