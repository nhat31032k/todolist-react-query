import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import useDebouncedSearch from '../hooks/useDebounce';
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
    const queryClient = useQueryClient();

    const addTaskMutation = useMutation(
        (newTask: Task) => axios.post(API_BASE_URL, newTask),
        {
            onSettled: () => {
                queryClient.invalidateQueries('tasks');
            },
        }
    );
    const updateTaskMutation = useMutation(
        (updatedTask: Task) => axios.put(`${API_BASE_URL}/${updatedTask.id}`, updatedTask),
        {
            onSettled: () => {
                queryClient.invalidateQueries('tasks');
            },
        }
    );
    const deleteTaskMutation = useMutation(
        (taskId: string) => axios.delete(`${API_BASE_URL}/${taskId}`),
        {
            onSettled: () => {
                queryClient.invalidateQueries('tasks');
            },
        }
    );
    const [editTask, setEditTask] = useState<Task | null>(null);
    const toggleTaskCompletionMutation = useMutation(
        (task: Task) => axios.put(`${API_BASE_URL}/${task.id}`, { ...task, completed: !task.completed }),
        {
            onSettled: () => {
                queryClient.invalidateQueries('tasks');
            },
        }
    );
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
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
                                        updateTaskMutation.mutate(editTask);
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
                                    onChange={() => toggleTaskCompletionMutation.mutate(task)}
                                />
                                {task.title}
                                <button
                                    onClick={() => {
                                        setEditTask(task);
                                    }}
                                >
                                    Update
                                </button>
                                <button onClick={() => deleteTaskMutation.mutate(task.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Search tasks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <form
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={(e: any) => {
                    e.preventDefault();
                    const title = e.target.taskTitle.value;
                    addTaskMutation.mutate({ id: uuidv4(), title, completed: false });
                    e.target.taskTitle.value = '';
                }}
            >
                <input type="text" name="taskTitle" placeholder="Add a task" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
