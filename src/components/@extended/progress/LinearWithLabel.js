import PropTypes from 'prop-types';

// material-ui
import { Box, LinearProgress, Typography } from '@mui/material';

// ==============================|| PROGRESS - LINEAR WITH LABEL ||============================== //

export default function LinearWithLabel({ value, showValue = true, mt = 0, ...others }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} {...others} />
      </Box>
        {showValue && (
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
            </Box>
        )}
    </Box>
  );
}

LinearWithLabel.propTypes = {
  value: PropTypes.number
};
