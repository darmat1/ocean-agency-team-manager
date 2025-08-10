'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from '@/components/Team/TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

export const TaskColumn = ({ status, title, tasks }: TaskColumnProps) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`rounded-lg p-4 h-full min-h-[200px] bg-gray-100 border border-gray-100 transition-all duration-100 ${
            snapshot.isDraggingOver ? 'border-dashed border-gray-400 opacity-65' : ''
          }`}
        >
          <h3 className="font-bold mb-4">{title}</h3>
          
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}

          {provided.placeholder}
          
          {tasks.length === 0 && !snapshot.isDraggingOver && (
            <div className="text-center text-gray-500 pt-10">Drop tasks here</div>
          )}
        </div>
      )}
    </Droppable>
  );
};