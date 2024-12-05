/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { useTodoStore } from "@/store/todo.store";
import { AddTodo } from "./AddTodo";
import { useToggleTodo } from "@/store/todo.store";
import { TodoItem } from "./TodoItem";
import { DateSlider } from "./DateSlider";

export const TodoList = () => {
  const { todos, initialized, initializeTodos, deleteTodo } = useTodoStore();
  const toggleTodo = useToggleTodo();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!initialized) {
      initializeTodos();
    }
  }, [initialized, initializeTodos]);

  if (!initialized) {
    return null; // waiting till dom is ready and localstorage is available
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const filteredTodos = todos.filter((todo) =>
    isSameDay(new Date(todo.createdAt), selectedDate)
  );

  return (
    <div className="space-y-4 lg:w-1/2 w-full">
      <DateSlider
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
      />
      <div className="flex justify-between items-center px-4 lg:px-0">
        <h2 className="text-2xl font-bold">
          {!isSameDay(selectedDate, new Date())
            ? format(selectedDate, "MMM, EEE, dd")
            : "Today"}
        </h2>
        <AddTodo disabled={!isSameDay(selectedDate, new Date())} />
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 px-4 lg:px-0">
          <img
            src={
              isSameDay(selectedDate, new Date())
                ? "https://illustrations.popsy.co/white/remote-work.svg"
                : "https://illustrations.popsy.co/white/meditation-boy.svg"
            }
            alt="No todos for this date"
            className="w-[500px] mx-auto"
          />
          {!isSameDay(selectedDate, new Date())
            ? "No todos found for this date."
            : "Nothing added yet. Click the + button to add your first todo."}
        </div>
      ) : (
        <ul className="space-y-2 px-4 lg:px-0">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
