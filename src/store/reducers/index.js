// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project import
import chat from './chat';
import customers from './customers';
import boards from './boards';
import projects from './projects';
import users from './user';
import roles from './role';
import calendar from './calendar';
import menu from './menu';
import snackbar from './snackbar';
import productReducer from './product';
import cartReducer from './cart';
import kanban from './kanban';
import invoice from './invoice';
import tasks from './tasks';
import leads from './leads'
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  chat,
  customers,
  projects,
    boards,
    users,
    tasks,
  calendar,
  menu,
  snackbar,
  cart: persistReducer(
    {
      key: 'cart',
      storage,
      keyPrefix: 'mantis-js-'
    },
    cartReducer
  ),
  product: productReducer,
  kanban,
  invoice,
  roles,
  leads
  
});

export default reducers;
