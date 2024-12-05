import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-start font-[family-name:var(--font-manrope)] bg-zinc-100">
      <TodoList />
    </div>
  );
}
