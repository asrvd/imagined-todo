import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { EditTodo } from "./EditTodo";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { Todo } from "@/types/todo.types";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export const TodoItem = ({ todo, toggleTodo, deleteTodo }: TodoItemProps) => {
  return (
    <li
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
        <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-2 mt-2 max-w-max">
          {todo.label && (
            <span
              className={clsx(
                "text-xs px-2 py-1 rounded-xl text-center",
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
                "text-xs px-2 py-1 rounded-xl text-center",
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
            <span className="text-xs px-2 py-1 rounded-xl bg-purple-500/5 text-purple-600 border border-purple-500/10 text-center">
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
  );
}; 