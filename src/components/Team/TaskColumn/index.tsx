'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from '@/components/Team/TaskCard';
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface TaskColumnProps {
    status: TaskStatus;
    title: string;
    tasks: Task[];
    newTaskTitle?: string;
    onNewTaskTitleChange?: (title: string) => void;
    onAddTask?: () => void;
}

export const TaskColumn = ({ status, title, tasks, newTaskTitle, onNewTaskTitleChange, onAddTask }: TaskColumnProps) => {
    return (
        <Droppable droppableId={status}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg p-4 h-full min-h-[200px] bg-gray-100 border border-gray-100 transition-all duration-100 ${snapshot.isDraggingOver ? 'border-dashed border-gray-400 opacity-65' : ''
                        }`}
                >
                    <h3 className="font-bold mb-4">{title}</h3>
                    {status === 'To Do' && onAddTask && (
                        <div className="flex gap-2 mb-4">
                            <Input
                                placeholder="Add a new task"
                                value={newTaskTitle}
                                onChange={(e) => onNewTaskTitleChange?.(e.target.value)}
                                onPressEnter={onAddTask}
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={onAddTask}
                                disabled={!newTaskTitle?.trim()}
                            />
                        </div>
                    )}
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