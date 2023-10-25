// material-ui
import { Box } from '@mui/material';

// third-party
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

// project imports
import Columns from './Columns';
import AddColumn from './AddColumn';
import ItemDetails from './ItemDetails';
import MainCard from 'components/MainCard';
import {dispatch, useDispatch, useSelector} from 'store';
import { updateColumnOrder, updateColumnItemOrder } from 'store/reducers/kanban';
import {useEffect} from "react";
import {getProjectById, getProjects, updateProjectBoardOrder} from "../../../../store/reducers/projects";
import {getBoards, updateBoardTasksOrder} from "../../../../store/reducers/boards";
import {useParams} from "react-router-dom";
import BoardTask from "./BoardTask";
import AddBoard from "./AddBoard";
import {getAllTasks, getTasks} from "../../../../store/reducers/tasks";
import {getUsers} from "../../../../store/reducers/user";

const getDragWrapper = () => ({
  p: 2.5,
  px: 0,
  bgcolor: 'transparent',
  display: 'flex',
  overflow: 'auto'
});

// ==============================|| KANBAN - BOARD ||============================== //

const Board = () => {
  const dispatch = useDispatch();

  const { id } = useParams()

  const { columns, columnsOrder } = useSelector((state) => state.kanban);

  const { boards: {
    boards,
    total,
  }, action } = useSelector((state) => state.boards);

  const { project } = useSelector((state) => state.projects);

  const { action: tasksAction } = useSelector((state) => state.tasks);

  // handle drag & drop
  const onDragEnd = (result) => {

    // let newColumn;
    const { source, destination, draggableId, type } = result;

    console.log(result)

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === "column") {
      dispatch(updateProjectBoardOrder(id, {
        sourceIndex: source.index,
        destinationIndex: destination.index
      }));
    } else if (type === "item") {
      dispatch(updateBoardTasksOrder(id, source.droppableId, {
        destinationIndex: destination.index,
        sourceIndex: source.index,
        destinationBoardId: destination.droppableId,
        sourceBoardId: source.droppableId
      }))
    }

    //
    // if (type === 'column') {
    //   const newColumnsOrder = Array.from(columnsOrder);
    //
    //   newColumnsOrder.splice(source.index, 1); // remove dragged column
    //   newColumnsOrder.splice(destination?.index, 0, draggableId); // set column new position
    //
    //   dispatch(updateColumnOrder(newColumnsOrder));
    //   return;
    // }

    // // find dragged item's column
    // const sourceColumn = columns.filter((item) => item.id === source.droppableId)[0];
    //
    // // find dropped item's column
    // const destinationColumn = columns.filter((item) => item.id === destination.droppableId)[0];
    //
    // // if - moving items in the same list
    // // else - moving items from one list to another
    // if (sourceColumn === destinationColumn) {
    //   const newItemIds = Array.from(sourceColumn.itemIds);
    //
    //   // remove the id of dragged item from its original position
    //   newItemIds.splice(source.index, 1);
    //
    //   // insert the id of dragged item to the new position
    //   newItemIds.splice(destination.index, 0, draggableId);
    //
    //   // updated column
    //   const newSourceColumn = {
    //     ...sourceColumn,
    //     itemIds: newItemIds
    //   };
    //
    //   newColumn = columns.map((column) => {
    //     if (column.id === newSourceColumn.id) {
    //       return newSourceColumn;
    //     }
    //     return column;
    //   });
    // } else {
    //   const newSourceItemIds = Array.from(sourceColumn.itemIds);
    //
    //   // remove the id of dragged item from its original column
    //   newSourceItemIds.splice(source.index, 1);
    //
    //   // updated dragged items's column
    //   const newSourceColumn = {
    //     ...sourceColumn,
    //     itemIds: newSourceItemIds
    //   };
    //
    //   const newDestinationItemIds = Array.from(destinationColumn.itemIds);
    //
    //   // insert the id of dragged item to the new position in dropped column
    //   newDestinationItemIds.splice(destination.index, 0, draggableId);
    //
    //   // updated dropped item's column
    //   const newDestinationColumn = {
    //     ...destinationColumn,
    //     itemIds: newDestinationItemIds
    //   };
    //
    //   newColumn = columns.map((column) => {
    //     if (column.id === newSourceColumn.id) {
    //       return newSourceColumn;
    //     }
    //     if (column.id === newDestinationColumn.id) {
    //       return newDestinationColumn;
    //     }
    //     return column;
    //   });
    // }
    //
    // dispatch(updateColumnItemOrder(newColumn));
  };

  useEffect(() => {
    dispatch(getProjectById(id));
    dispatch(getBoards(id, 0, 100, null));
    dispatch(getAllTasks(id, 0, 100, null))
    dispatch(getUsers(0, 100, null))
  }, [id, action, tasksAction])


  return (
    <Box sx={{ display: 'flex' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided, snapshot) => (
            <MainCard
              border={false}
              ref={provided.innerRef}
              sx={{ bgcolor: 'transparent' }}
              contentSX={getDragWrapper(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {[...boards].sort((a, b) => {
                return project.boardOrders.indexOf(a._id) - project.boardOrders.indexOf(b._id);
              }).map((board, index) => (
                  <BoardTask key={board._id} board={board} index={index} />
              ))}
              {provided.placeholder}
              <AddBoard />
            </MainCard>
          )}
        </Droppable>
      </DragDropContext>
      <ItemDetails />
    </Box>
  );
};
export default Board;
