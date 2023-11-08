import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { message } from 'antd';

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
      onSuccess: () => {
        message.success("add task success");
        setTimeout(() => {
          queryClient.invalidateQueries('tasks');
        }, 100);
      },
      onError: () => {
        message.error("add task failed")
      },
    }
  );
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (taskId: string) => axios.delete(`${API_BASE_URL}/${taskId}`),
    {
      onSuccess: () => {
        message.success("Delete success")
        setTimeout(() => {
          queryClient.invalidateQueries('tasks');
        }, 100);
      },
      onError: () => {
        message.error("add task failed")
      },
    }
  );
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (updatedTask: Task) => axios.put(`${API_BASE_URL}/${updatedTask.id}`, updatedTask),
    {
      onSuccess: () => {
        message.success("Update success")
        setTimeout(() => {
          queryClient.invalidateQueries('tasks');
        }, 100);
      },
      onError: () => {
        message.error("add task failed")
      },
    }
  );
};

export const useToggleTaskCompletionMutation = () => {
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