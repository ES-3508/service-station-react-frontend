// material-ui
import { Button, Grid, IconButton, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { MoreOutlined } from '@ant-design/icons';

import Avatar1 from 'assets/images/users/avatar-5.png';
import Avatar2 from 'assets/images/users/avatar-6.png';
import Avatar3 from 'assets/images/users/avatar-7.png';
import Avatar4 from 'assets/images/users/avatar-8.png';
import Avatar5 from 'assets/images/users/avatar-9.png';

// ==============================|| INVOICE - DASHBOARD USER LIST ||============================== //

const InvoiceUserList = () => {
  return (
    <MainCard
      title="Recent Services"
      secondary={
        <IconButton edge="end" aria-label="comments" color="secondary">
          <MoreOutlined style={{ fontSize: '1.15rem' }} />
        </IconButton>
      }
    >
      <Grid container spacing={2.5} alignItems="center">
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar alt="User 1" src={Avatar1} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography align="left" variant="subtitle1">
                අමරසිංහ පෙරේරා -{' '}
                <Typography color="secondary" component="span">
                  {' '}
                  KA - 1234
                </Typography>
              </Typography>
              <Typography align="left" color="primary">
                LKR 39,200
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="caption" color="secondary">
                5 min ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar alt="User 2" src={Avatar2} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography align="left" variant="subtitle1">
                කුමුදු කුමාර -{' '}
                <Typography color="secondary" component="span">
                  {' '}
                  KA - 5678
                </Typography>
              </Typography>
              <Typography align="left" color="primary">
                LKR 12,890
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="caption" color="secondary">
                1 day ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar alt="User 3" src={Avatar3} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography align="left" variant="subtitle1">
                ලක්ෂාන් ජයසේකර -{' '}
                <Typography color="secondary" component="span">
                  {' '}
                  KA - 9101
                </Typography>
              </Typography>
              <Typography align="left" color="primary">
                LKR 40,000
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="caption" color="secondary">
                3 weeks ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar alt="User 4" src={Avatar4} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography align="left" variant="subtitle1">
                සචිත්ර වීරසිංහ -{' '}
                <Typography color="secondary" component="span">
                  {' '}
                  KA - 1121
                </Typography>
              </Typography>
              <Typography align="left" color="primary">
                LKR 12,890
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="caption" color="secondary">
                3 weeks ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar alt="User 5" src={Avatar5} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography align="left" variant="subtitle1">
                අමල් සෙනෙවිරත්න -{' '}
                <Typography color="secondary" component="span">
                  {' '}
                  KA - 3141
                </Typography>
              </Typography>
              <Typography align="left" color="primary">
                LKR 24,000
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="caption" color="secondary">
                1 month ago
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="outlined" color="secondary">
            View All
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default InvoiceUserList;
