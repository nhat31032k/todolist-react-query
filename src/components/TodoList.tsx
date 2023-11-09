import { useQuery } from 'react-query';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import useDebouncedSearch from '../hooks/useDebounce';
import { useAddTaskMutation, useDeleteTaskMutation, useToggleTaskCompletionMutation, useUpdateTaskMutation } from '../utils/function';
import { Form, Input, Button, List } from 'antd';
import { FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
// import ListItems from './ListItems';
const API_BASE_URL = 'http://localhost:3001/api/tasks';
type Task = {
    trim(): unknown;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isEditTaskEmpty = !editTask || !editTask.title.trim();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTitle = e.target.value;
        setEditTask((prevEditTask) => ({ ...prevEditTask!, title: updatedTitle }));
    };
    const handleUpdateTask = (taskToUpdate: Task) => {
        UpdateTask.mutate(taskToUpdate);
        setEditTask(null);
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <div style={{
                marginBottom: "2rem"
            }}>
                <h1 style={{
                    textAlign: "center"
                }}>Search your task here</h1>
                <Input
                    style={{
                        width: "20rem",
                        height: "2rem",
                        display: "flex",
                        margin: "auto"
                    }}
                    placeholder="Search tasks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<FileSearchOutlined />}
                />
            </div>
            <Form
                form={form}
            >
                <div style={{
                    width: "20rem",
                    height: "2rem",
                    margin: "auto",
                    display: "block"
                }}>
                    <Form.Item name="taskTitle" rules={[{ required: true, message: 'Task is required' }]}>
                        <Input
                            placeholder="Add a task"
                            prefix={<UnorderedListOutlined />}
                        />
                    </Form.Item>
                    <Button onClick={handleCreateTask} type='primary'>Submit</Button>
                </div>

            </Form>
            <div className="button-wrap" style={{
                marginTop: "5rem"
            }}>
                <div>
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
                                            onChange={handleInputChange}
                                            required={true}
                                        />
                                        <Button
                                            onClick={() => handleUpdateTask(editTask)}
                                            disabled={isEditTaskEmpty}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                ) : (
                                    <div style={{
                                        display: "flex",
                                        gap: "0.4rem",
                                        alignItems: "center"
                                    }}>
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
            </div>
        </div>
    );
}
