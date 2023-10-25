import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemText, ListItem } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';

// utils
import getDropzoneData from 'utils/getDropzoneData';

// assets
import { CloseCircleFilled, FileFilled } from '@ant-design/icons';

// ==============================|| MULTI UPLOAD - PREVIEW ||============================== //

export default function AttachmentsPreview({ attachments = [], onRemove }) {
    const theme = useTheme();
    const hasFile = attachments.length > 0;
    const layoutType = "STANDARD";

    return (
        <List
            disablePadding
            sx={{ ...(hasFile && layoutType !== 'STANDARD' && { my: 3 }), ...(layoutType === 'STANDARD' && { width: 'calc(100% - 84px)' }) }}
        >
            {attachments.map((attachment, index) => {
                return (
                    <ListItem
                        key={index}
                        sx={{
                            p: 0,
                            m: 0.5,
                            width: layoutType === 'STANDARD' ? 64 : 80,
                            height: layoutType === 'STANDARD' ? 64 : 80,
                            borderRadius: 1.25,
                            position: 'relative',
                            display: 'inline-flex',
                            verticalAlign: 'text-top',
                            border: `solid 1px ${theme.palette.divider}`,
                            overflow: 'hidden'
                        }}
                    >
                        <img alt="preview" src={attachment} style={{ width: '100%' }} />

                        {onRemove && (
                            <IconButton
                                size="small"
                                color="error"
                                shape="rounded"
                                onClick={() => onRemove(attachment)}
                                sx={{
                                    fontSize: '0.875rem',
                                    bgcolor: 'background.paper',
                                    p: 0,
                                    width: 'auto',
                                    height: 'auto',
                                    top: 2,
                                    right: 2,
                                    position: 'absolute'
                                }}
                            >
                                <CloseCircleFilled />
                            </IconButton>
                        )}
                    </ListItem>
                );
            })}
        </List>
    );
}

AttachmentsPreview.propTypes = {
    showList: PropTypes.bool,
    attachments: PropTypes.array,
    onRemove: PropTypes.func,
    type: PropTypes.string
};
