import PomodoroSettings from "@/components/PomodoroSettings";
import PomodoroToggle from "@/components/PomodoroToggle";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";

export default function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <Card className="flex flex-row gap-2 px-2 py-2">
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
        <PomodoroToggle />
        <PomodoroSettings />
      </Card>
    </div>
  );
}
