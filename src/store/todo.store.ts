"use client";

import { create } from "zustand";
import { Todo } from "@/types/todo.types";

interface TodoStore {
  todos: Todo[];
  initialized: boolean;
  initializeTodos: () => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
}

const isClient = typeof window !== "undefined"; // needed to make sure localstorage is available

const getStoredTodos = (): Todo[] => {
  if (!isClient) return [];

  try {
    const item = localStorage.getItem("todos");
    return item
      ? (JSON.parse(item) as Todo[]).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : [];
  } catch (error) {
    console.warn("Error reading todos from localStorage:", error);
    return [];
  }
};

const setStoredTodos = (todos: Todo[]) => {
  if (!isClient) return;

  try {
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Error writing todos to localStorage:", error);
  }
};

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  initialized: false,
  initializeTodos: () => {
    if (!isClient) return;
    set({ todos: getStoredTodos(), initialized: true });
  },
  addTodo: (todo: Todo) => {
    set((state) => {
      const updatedTodos = [todo, ...state.todos];
      setStoredTodos(updatedTodos);
      return { todos: updatedTodos };
    });
  },
  updateTodo: (todo: Todo) => {
    set((state) => {
      const updatedTodos = state.todos.map((t) =>
        t.id === todo.id ? todo : t
      );
      setStoredTodos(updatedTodos);
      return { todos: updatedTodos };
    });
  },
  deleteTodo: (id: string) => {
    set((state) => {
      const updatedTodos = state.todos.filter((t) => t.id !== id);
      setStoredTodos(updatedTodos);
      return { todos: updatedTodos };
    });
  },
  toggleTodo: (id: string) => {
    set((state) => {
      const updatedTodos = state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      setStoredTodos(updatedTodos);
      return { todos: updatedTodos };
    });
  },
}));

export const useTodos = () => useTodoStore((state) => state.todos);
export const useAddTodo = () => useTodoStore((state) => state.addTodo);
export const useUpdateTodo = () => useTodoStore((state) => state.updateTodo);
export const useDeleteTodo = () => useTodoStore((state) => state.deleteTodo);
export const useToggleTodo = () => useTodoStore((state) => state.toggleTodo);