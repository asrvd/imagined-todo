"use client";

import { useEffect, useState, useRef } from "react";
import { format, addDays, subDays, isSameDay, isAfter } from "date-fns";
import { useTodoStore } from "@/store/todo.store";
import { AddTodo } from "./AddTodo";
import { EditTodo } from "./EditTodo";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToggleTodo } from "@/store/todo.store";
import clsx from "clsx";

export const TodoList = () => {
  const { todos, initialized, initializeTodos, deleteTodo } = useTodoStore();
  const toggleTodo = useToggleTodo();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(addDays(new Date(), 7));
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized) {
      initializeTodos();
    }
  }, [initialized, initializeTodos]);

  useEffect(() => {
    const todayIndex = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const slider = sliderRef.current;
    if (slider) {
      const buttonWidth = slider.scrollWidth / (endDate.getTime() - startDate.getTime()) * (1000 * 60 * 60 * 24);
      slider.scrollLeft = todayIndex * buttonWidth - slider.clientWidth / 2 + buttonWidth / 2;
    }
  }, [startDate, endDate]);

  if (!initialized) {
    return null;
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlide = (direction: "left" | "right") => {
    if (direction === "left") {
      setStartDate((prevStartDate) => subDays(prevStartDate, 1));
    } else {
      setEndDate((prevEndDate) => addDays(prevEndDate, 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    sliderRef.current!.dataset.touchStartX = touchStartX.toString();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchStartX = parseFloat(
      sliderRef.current!.dataset.touchStartX || "0"
    );
    const touchEndX = e.touches[0].clientX;
    const touchDiff = touchStartX - touchEndX;

    if (touchDiff > 50) {
      handleSlide("right");
    } else if (touchDiff < -50) {
      handleSlide("left");
    }
  };

  const filteredTodos = todos.filter((todo) =>
    isSameDay(new Date(todo.createdAt), selectedDate)
  );

  const renderDateSlider = () => {
    const today = new Date();
    const dates = [];
    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      dates.push(date);
    }

    return (
      <div
        ref={sliderRef}
        className="flex justify-start items-center space-x-2 mb-4 overflow-x-scroll bg-white border border-zinc-200/70 shadow-lg rounded-b-[1.5rem] py-4 hide-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <button
          onClick={() => handleSlide("left")}
          className="p-2 rounded-lg text-zinc-900"
        >
          &lt;
        </button>
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDateChange(date)}
            disabled={date > today}
            className={`px-2 py-6 rounded-2xl hover:text-white transition-colors duration-300 ease-out cursor-pointer min-w-16 ${
              isAfter(date, today) && "opacity-50 pointer-events-none cursor-not-allowed"
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
        ))}
        <button
          onClick={() => handleSlide("right")}
          className="px-2 py-1 text-zinc-900 rounded-lg"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4 lg:w-1/2 w-full">
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
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
          No todos for this date. Click the &quot;Add Todo&quot; button to
          create one.
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
                <h3 className={clsx("font-semibold text-xl leading-none", todo.completed ? "text-zinc-500 line-through" : "")}>
                  {todo.title}
                </h3>
                {todo.notes && (
                  <p className="text-sm text-zinc-700 leading-none mt-1">
                    {todo.notes}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {todo.label && (
                    <span className={clsx("text-xs px-2 py-1 rounded-xl", todo.label === "personal" ? "bg-blue-500/5 text-blue-600 border border-blue-500/10" : "bg-green-500/5 text-green-600 border border-green-500/10")}>
                      {todo.label}
                    </span>
                  )}
                  {todo.priority && (
                    <span className={clsx("text-xs px-2 py-1 rounded-xl", todo.priority === "low" ? "bg-green-500/5 text-green-600 border border-green-500/10" : todo.priority === "medium" ? "bg-yellow-500/5 text-yellow-600 border border-yellow-500/10" : "bg-red-500/5 text-red-600 border border-red-500/10")}>
                      {todo.priority}
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
