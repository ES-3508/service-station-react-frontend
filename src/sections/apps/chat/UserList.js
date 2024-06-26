import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';

// third-party
import { Chance } from 'chance';

// project imports
import UserAvatar from './UserAvatar';
import Dot from 'components/@extended/Dot';
import { useDispatch, useSelector } from 'store';
import { getUsers } from 'store/reducers/chat';

// assets
import { CheckOutlined } from '@ant-design/icons';

const chance = new Chance();

function UserList({ setUser, search }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const { users } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    if (search) {
      const results = users.filter((row) => {
        let matches = true;

        const properties = ['name'];
        let containsQuery = false;

        properties.forEach((property) => {
          if (row[property].toString().toLowerCase().includes(search.toString().toLowerCase())) {
            containsQuery = true;
          }
        });

        if (!containsQuery) {
          matches = false;
        }
        return matches;
      });

      setData(results);
    } else {
      setData(users);
    }
  }, [search]);

  return (
    <List component="nav">
      {data.map((user) => (
        <Fragment key={user.id}>
          <ListItemButton
            sx={{ pl: 1 }}
            onClick={() => {
              setUser(user);
            }}
          >
            <ListItemAvatar>
              <UserAvatar user={user} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography
                    variant="h5"
                    color="inherit"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography component="span" color="textSecondary" variant="caption">
                    {user.lastMessage}
                  </Typography>
                </Stack>
              }
              secondary={
                <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user.status}
                  </Typography>
                  {user.unReadChatCount ? (
                    <Dot color="primary" />
                  ) : (
                    // chance.bool() - use for last send msg was read or unread
                    <CheckOutlined style={{ color: chance.bool() ? theme.palette.grey[400] : theme.palette.primary.main }} />
                  )}
                </Stack>
              }
            />
          </ListItemButton>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}

UserList.propTypes = {
  setUser: PropTypes.func,
  search: PropTypes.string
};

export default UserList;
