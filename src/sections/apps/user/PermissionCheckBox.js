import { CheckOutlined } from "@ant-design/icons";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

const PermissionCheckBox = ({ theme, onChangeHandler, id, type, toggled }) => {

    const [checked, setChecked] = useState(false);


    useEffect(() => {
        setChecked(toggled);
    }, [toggled])

    return <>
        <Checkbox
            checked={checked}
            color="success"
            onChange={(value) => {
                setChecked(value.target.checked)
                onChangeHandler(id, type, value.target.checked)
            }}
            checkedIcon={
                <Box
                    className="icon"
                    sx={{
                        width: 16,
                        height: 16,
                        border: '1px solid',
                        borderColor: 'inherit',
                        borderRadius: 0.25,
                        position: 'relative',
                        backgroundColor: theme.palette.success.main
                    }}
                >
                    <CheckOutlined className="filled" style={{ position: 'absolute', color: theme.palette.common.white }} />
                </Box>
            }
        />
    </>
}

export default PermissionCheckBox;