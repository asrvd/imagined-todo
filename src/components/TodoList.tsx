/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { format, addDays, isSameDay, isAfter } from "date-fns";
import { useTodoStore } from "@/store/todo.store";
import { AddTodo } from "./AddTodo";
import { EditTodo } from "./EditTodo";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToggleTodo } from "@/store/todo.store";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Mousewheel } from "swiper/modules";
import "swiper/css";

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

  const TOTAL_DAYS = 1000;
  const ITEM_WIDTH = 50;

  const getDateFromIndex = (index: number): Date => {
    const today = new Date();
    return addDays(today, index - Math.floor(TOTAL_DAYS / 2));
  };

  const DateButton = ({ index }: { index: number }) => {
    const date = getDateFromIndex(index);
    const today = new Date();

    return (
      <div className="w-full">
        <button
          onClick={() => handleDateChange(date)}
          disabled={isAfter(date, today)}
          className={`px-2 py-6 rounded-2xl hover:text-white transition-colors duration-300 ease-out cursor-pointer min-w-16 ${
            isAfter(date, today) &&
            "opacity-50 pointer-events-none cursor-not-allowed"
          } ${
            isSameDay(date, selectedDate)
              ? "bg-zinc-900 text-white"
              : "hover:bg-zinc-100/90"
          }`}
        >
          <span
            className={`font-bold text-sm ${
              isSameDay(date, selectedDate) ? "text-white" : "text-zinc-500"
            }`}
          >
            {format(date, "E")[0]}
          </span>
          <br />
          <span
            className={`text-base font-bold ${
              isSameDay(date, selectedDate) ? "text-white" : "text-zinc-900"
            }`}
          >
            {format(date, "dd")}
          </span>
        </button>
      </div>
    );
  };

  const renderDateSlider = () => {
    const todayIndex = Math.floor(TOTAL_DAYS / 2);

    return (
      <div className="mb-4 bg-white border border-zinc-200/70 shadow-lg rounded-b-[1.5rem] py-4">
        <Swiper
          modules={[Navigation, A11y, Mousewheel]}
          spaceBetween={16}
          slidesPerView="auto"
          centeredSlides={true}
          initialSlide={todayIndex}
          mousewheel={{
            sensitivity: 2,
          }}
        >
          {Array.from({ length: TOTAL_DAYS }).map((_, index) => (
            <SwiperSlide key={index} style={{ width: ITEM_WIDTH }}>
              <DateButton index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  return (
    <div className="space-y-4 lg:w-1/2 w-full">
      {renderDateSlider()}
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
            <li
              key={todo.id}
              className="flex items-center gap-4 justify-between p-4 border border-zinc-200/70 rounded-2xl bg-white"
            >
              <Checkbox
                checked={todo.completed}
                className="flex-shrink-0 self-start rounded-full w-5 h-5"
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <div className="flex-1">
                <h3
                  className={clsx(
                    "font-semibold text-xl leading-none",
                    todo.completed ? "text-zinc-500 line-through" : ""
                  )}
                >
                  {todo.title}
                </h3>
                {todo.notes && (
                  <p className="text-sm text-zinc-700 leading-none mt-1">
                    {todo.notes}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {todo.label && (
                    <span
                      className={clsx(
                        "text-xs px-2 py-1 rounded-xl",
                        todo.label === "personal"
                          ? "bg-blue-500/5 text-blue-600 border border-blue-500/10"
                          : "bg-green-500/5 text-green-600 border border-green-500/10"
                      )}
                    >
                      {todo.label}
                    </span>
                  )}
                  {todo.priority && (
                    <span
                      className={clsx(
                        "text-xs px-2 py-1 rounded-xl",
                        todo.priority === "low"
                          ? "bg-green-500/5 text-green-600 border border-green-500/10"
                          : todo.priority === "medium"
                          ? "bg-yellow-500/5 text-yellow-600 border border-yellow-500/10"
                          : "bg-red-500/5 text-red-600 border border-red-500/10"
                      )}
                    >
                      {todo.priority}
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className="text-xs px-2 py-1 rounded-xl bg-purple-500/5 text-purple-600 border border-purple-500/10">
                      {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <EditTodo todo={todo} />
                <Button
                  variant="outline"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-300 ease-in-out rounded-lg"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
