import { Button, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Form, FormikProvider, useFormik } from 'formik';
import { useMemo } from 'react';
import DefaultEditor from 'react-simple-wysiwyg';
import { dispatch } from 'store';
import { createLeadNote } from 'store/reducers/leads';
import { createProjectNote } from 'store/reducers/projects';
import * as Yup from 'yup';

const AddNote = ({lead, onCancel}) => {
    console.log("project", lead);
  const NoteSchema = Yup.object().shape({});
  const defaultValues = useMemo(
    () => ({
      leadNote: ''
    }),
    [lead]
  );
  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: getInitialValues(lead),
    initialValues: defaultValues,
    validationSchema: NoteSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('values add note', values);
        dispatch(createProjectNote(lead._id, values)).then(
          onCancel(),
          resetForm(),
          setSubmitting(false)
        )
        // dispatch()
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, resetForm } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <DialogTitle sx={{ fontSize: 28, p: 2.5 }}>Add Note</DialogTitle>
              </Grid>
            </Grid>
            <Divider />
            <DialogContent sx={{ pt: 0.8 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <DefaultEditor
                    id="leadNote"
                    // value={lead.leadNote}
                    // onChange={(e) => {
                    //   updateNote(e.target.value); // Call updateNote to update note in currentLead
                    // }}
                    {...getFieldProps('leadNote')}
                    onChange={(event) => setFieldValue('leadNote', event.target.value)}
                    placeholder="Type description"
                  />
                </FormControl>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Add
                    </Button>
                    <Button color="error" 
                    onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
            </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};
export default AddNote;
