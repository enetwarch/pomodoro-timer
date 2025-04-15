import ModeToggle from "@/components/ModeToggle";
import PomodoroSettings from "@/components/PomodoroSettings";
import ThemeProvider from "@/components/ThemeProvider";

export default function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle />
        <PomodoroSettings />
      </ThemeProvider>
    </div>
  );
}
