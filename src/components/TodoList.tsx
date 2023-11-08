import { useQuery } from 'react-query';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import useDebouncedSearch from '../hooks/useDebounce';
import { useAddTaskMutation, useDeleteTaskMutation, useToggleTaskCompletionMutation, useUpdateTaskMutation } from '../utils/function';
// import ListItems from './ListItems';
const API_BASE_URL = 'http://localhost:3001/api/tasks';
type Task = {
    id: string;
    title: string;
    completed: boolean;
};
export const TaskList = () => {
    const { data: tasks, isLoading } = useQuery<Task[]>('tasks', async () => {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    });
    const addTask = useAddTaskMutation();
    const UpdateTask = useUpdateTaskMutation();
    const deleteTask = useDeleteTaskMutation();
    const toggleTask = useToggleTaskCompletionMutation()
    const [editTask, setEditTask] = useState<Task | null>(null);
   
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);
    const filteredTasks =tasks? tasks.filter((task) =>
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateTask = (e: any) =>{
        e.preventDefault();
        const title = e.target.taskTitle.value;
        addTask.mutate({ id: uuidv4(), title, completed: false });
        e.target.taskTitle.value = '';
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <input
                type="text"
                placeholder="Search tasks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <form
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={(e)=> handleCreateTask(e)}
            >
                <input type="text" name="taskTitle" placeholder="Add a task" />
                <button type="submit">Submit</button>
            </form>
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id}>
                        {editTask && editTask.id === task.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editTask.title}
                                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                />
                                <button
                                    onClick={() => {
                                        UpdateTask.mutate(editTask);
                                        setEditTask(null);
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask.mutate(task)}
                                />
                                {task.title}
                                <button
                                    onClick={() => {
                                        setEditTask(task);
                                    }}
                                >
                                    Update
                                </button>
                                <button onClick={() => deleteTask.mutate(task.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
