import { createSlice } from '@reduxjs/toolkit';

// project import
import axios from 'utils/axios';
import { dispatch } from 'store';

const initialState = {
  calendarView: 'dayGridMonth',
  error: false,
  events: [],
  isLoader: false,
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null,
  action:false
};

// ==============================|| CALENDAR - SLICE ||============================== //

const calendar = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // loader
    loading(state) {
      state.isLoader = true;
    },

    // error
    hasError(state, action) {
      state.isLoader = false;
      state.error = action.payload;
    },

    // event list
    setEvents(state, action) {
      state.isLoader = false;
      state.events = action.payload;
    },

    // update calendar view
    updateCalendarView(state, action) {
      state.calendarView = action.payload;
    },

    // select event
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },

    // create event
    createEvent(state, action) {
      state.isLoader = false;
      state.isModalOpen = false;
      state.action=!state.action;
      // state.events = action.payload;
    },

    // update event
    updateEvent(state, action) {
      state.isLoader = false;
      state.isModalOpen = false;
      state.events = action.payload;
      state.action=!state.action;
    },

    // delete event
    deleteEvent(state, action) {
      const { eventId } = action.payload;
      state.isModalOpen = false;
      const deleteEvent = state.events.filter((user) => user.id !== eventId);
      state.events = deleteEvent;
      state.action=!state.action;
    },

    // select date range
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isModalOpen = true;
      state.selectedRange = { start, end };
    },

    // modal toggle
    toggleModal(state) {
      state.isModalOpen = !state.isModalOpen;
      if (state.isModalOpen === false) {
        state.selectedEventId = null;
        state.selectedRange = null;
      }
    }
  }
});

export default calendar.reducer;

export const { selectEvent, toggleModal, updateCalendarView } = calendar.actions;

export function getEvents(pageIndex = 0, pageSize = 10, query,start,end) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      let requestUrl= 'api/v1/event'
      // if(start && end){
      //   requestUrl=requestUrl+`start=${start}&end=${end}`
      // }
      const response = await axios.get(requestUrl);
      dispatch(calendar.actions.setEvents(response.data.events));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function createEvent(newEvent) {
  return async () => {
    console.log(newEvent)
    dispatch(calendar.actions.loading());
    try {
      const response = await axios.post('/api/v1/event/', newEvent);
      dispatch(calendar.actions.createEvent(response.data));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function updateEvent(eventId, updateEvent) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      let  requestUrl=`/api/v1/event/${eventId}/update`
      const response = await axios.put(requestUrl, {
        
        updateEvent
      });
      dispatch(calendar.actions.updateEvent(response.data.events));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function deleteEvent(eventId) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const response = await axios.delete(`/api/v1/event/${eventId}/delete`);

      // await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(calendar.actions.deleteEvent({ eventId }));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function selectRange(start, end) {
  return async () => {
    dispatch(
      calendar.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
}
