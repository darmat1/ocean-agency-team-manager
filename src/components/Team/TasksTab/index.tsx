'use client';

import { useState, useEffect, FC } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TeamMember, Task, TaskStatus } from '@/lib/types';
import { TaskColumn } from '@/components/Team/TaskColumn';
import { useTeam } from '@/hooks/useTeam';
import { useOverlay } from '@/hooks/useOverlay';

interface TasksTabProps {
    member: TeamMember;
}

const columns: { [key in TaskStatus]: { id: TaskStatus; title: string } } = {
    'To Do': { id: 'To Do', title: 'To Do' },
    'In Progress': { id: 'In Progress', title: 'In Progress' },
    'Done': { id: 'Done', title: 'Done' },
};

export const TasksTab: FC<TasksTabProps> = ({ member }) => {
    const { updateMemberTasks } = useTeam();
    const [tasksByStatus, setTasksByStatus] = useState<Record<TaskStatus, Task[]>>({
        'To Do': [], 'In Progress': [], 'Done': [],
    });
    const { addNotification } = useOverlay();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        const groupedTasks = member.tasks.reduce((acc, task) => {
            (acc[task.status] = acc[task.status] || []).push(task);
            return acc;
        }, {} as Record<TaskStatus, Task[]>);
        setTasksByStatus({
            'To Do': groupedTasks['To Do'] || [],
            'In Progress': groupedTasks['In Progress'] || [],
            'Done': groupedTasks['Done'] || [],
        });
    }, [member.tasks]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;

        const sourceTasks = [...(tasksByStatus[sourceStatus] || [])];
        const destTasks = sourceStatus === destStatus ? sourceTasks : [...(tasksByStatus[destStatus] || [])];

        const [movedTask] = sourceTasks.splice(source.index, 1);
        const updatedMovedTask = { ...movedTask, status: destStatus };
        destTasks.splice(destination.index, 0, updatedMovedTask);

        const newTasksState = {
            ...tasksByStatus,
            [sourceStatus]: sourceTasks,
            [destStatus]: destTasks,
        };
        setTasksByStatus(newTasksState);

        const allUpdatedTasks = Object.values(newTasksState).flat();
        updateMemberTasks(member.id, allUpdatedTasks); 

        addNotification(`Task "${movedTask.title}" status changed to "${destStatus}"`, 'info');
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) {
            addNotification('Task title cannot be empty', 'error');
            return;
        }

        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: newTaskTitle.trim(),
            status: 'To Do',
        };

        const newTotalTasks = [...member.tasks, newTask];
        updateMemberTasks(member.id, newTotalTasks);

        // Optimistic UI
        setTasksByStatus(prev => ({
            ...prev,
            'To Do': [...prev['To Do'], newTask]
        }));

        addNotification('New task added successfully!', 'success');

        //очистка інпута
        setNewTaskTitle('');
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(columns).map(column => (
                    <TaskColumn
                        key={column.id}
                        status={column.id}
                        title={column.title}
                        tasks={tasksByStatus[column.id] || []}
                        {...(column.id === 'To Do' && {
                            newTaskTitle: newTaskTitle,
                            onNewTaskTitleChange: setNewTaskTitle,
                            onAddTask: handleAddTask,
                        })}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};