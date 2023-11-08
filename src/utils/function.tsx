import {  useMutation, useQueryClient } from 'react-query';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3001/api/tasks';
type Task = {
    id: string;
    title: string;
    completed: boolean;
};
export const useAddTaskMutation = () => {
    const queryClient = useQueryClient();
  return useMutation(
    (newTask: Task) => axios.post(API_BASE_URL, newTask),
    {
      onSettled: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );
};

export const useDeleteTaskMutation = () => {
    const queryClient = useQueryClient();
  return useMutation(
    (taskId: string) => axios.delete(`${API_BASE_URL}/${taskId}`),
    {
      onSettled: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );
};

export const useUpdateTaskMutation = () => {
    const queryClient = useQueryClient();
  return useMutation(
    (updatedTask: Task) => axios.put(`${API_BASE_URL}/${updatedTask.id}`, updatedTask),
    {
      onSettled: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );
};

export const useToggleTaskCompletionMutation = () =>{
    const queryClient = useQueryClient();
    return useMutation(
        (task: Task) => axios.put(`${API_BASE_URL}/${task.id}`, { ...task, completed: !task.completed }),
        {
            onSettled: () => {
                queryClient.invalidateQueries('tasks');
            },
        }
    );
    
}