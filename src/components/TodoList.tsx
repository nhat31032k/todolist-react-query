import { useQuery } from 'react-query';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import useDebouncedSearch from '../hooks/useDebounce';
import { useAddTaskMutation, useDeleteTaskMutation, useToggleTaskCompletionMutation, useUpdateTaskMutation } from '../utils/function';
import { Form, Input, Button, List } from 'antd';
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
    const [form] = Form.useForm();
    const addTask = useAddTaskMutation();
    const UpdateTask = useUpdateTaskMutation();
    const deleteTask = useDeleteTaskMutation();
    const toggleTask = useToggleTaskCompletionMutation()
    const [editTask, setEditTask] = useState<Task | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);
    const filteredTasks = tasks ? tasks.filter((task) =>
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateTask = async () => {
        const values = await form.validateFields();
        const title = values.taskTitle;
        addTask.mutate({ id: uuidv4(), title, completed: false });
        form.resetFields();
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <Input
                placeholder="Search tasks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form
                form={form}
            >
                <Form.Item name="taskTitle" rules={[{ required: true, message: 'Task is required' }]}>
                    <Input placeholder="Add a task" />
                </Form.Item>
                <Button onClick={handleCreateTask}>Submit</Button>
            </Form>
            <div className="button-wrap">
                <List
                    dataSource={filteredTasks}
                    renderItem={(task) => (
                        <List.Item>
                            {editTask && editTask.id === task.id ? (
                                <div style={{
                                    display: "flex",
                                    gap: "0.3rem"
                                }}>
                                    <Input
                                        value={editTask.title}
                                        onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                    />
                                    <Button
                                        onClick={() => {
                                            UpdateTask.mutate(editTask);
                                            setEditTask(null);
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask.mutate(task)}
                                    />
                                    <span
                                        style={{
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            marginRight: '8px',
                                        }}
                                    >
                                        {task.title}
                                    </span>
                                    <Button
                                        onClick={() => {
                                            setEditTask(task);
                                        }}
                                    >
                                        Update
                                    </Button>
                                    <Button onClick={() => deleteTask.mutate(task.id)}>Delete</Button>
                                </div>
                            )}
                        </List.Item>
                    )}
                />
            </div>
            {/* {filteredTasks.map((task) => (
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
                ))} */}

        </div>
    );
}
