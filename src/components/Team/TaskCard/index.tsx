'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-3 mb-3 rounded shadow ${
            snapshot.isDragging ? 'opacity-75 shadow-lg cursor-grabbing' : 'cursor-move'
          }`}
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
};