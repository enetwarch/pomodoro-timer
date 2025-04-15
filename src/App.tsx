import PomodoroReset from "@/components/PomodoroReset";
import PomodoroSettings from "@/components/PomodoroSettings";
import PomodoroToggle from "@/components/PomodoroToggle";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <Card>
        <CardHeader className="flex flex-row gap-2">
          <Badge variant="destructive">Work</Badge>
          <Badge variant="secondary">Session 1</Badge>
        </CardHeader>
        <CardContent className="justify-center items-center">
          <CardTitle className="font-extrabold text-7xl text-center">
            50:00
          </CardTitle>
        </CardContent>
        <CardFooter className="justify-center border-t gap-2">
          <PomodoroReset />
          <PomodoroToggle />
          <PomodoroSettings />
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        </CardFooter>
      </Card>
    </div>
  );
}
