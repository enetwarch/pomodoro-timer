import ModeToggle from "@/components/ModeToggle";
import PomodoroSettings from "@/components/PomodoroSettings";
import ThemeProvider from "@/components/ThemeProvider";

export default function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <ThemeProvider>
        <ModeToggle />
        <PomodoroSettings />
      </ThemeProvider>
    </div>
  );
}
