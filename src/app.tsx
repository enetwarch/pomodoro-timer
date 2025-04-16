import { ResetButton } from "@/components/reset-button";
import { SettingsButton } from "@/components/settings-button";
import { SupportButton } from "@/components/support-button";
import { ThemeButton } from "@/components/theme-button";
import { TimerButton } from "@/components/timer-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsProvider } from "@/hooks/settings-provider";
import { ThemeProvider } from "@/hooks/theme-provider";

export default function App(): React.ReactNode {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <ThemeProvider>
        <SettingsProvider>
          <Card>
            <CardHeader className="flex flex-row gap-2">
              <Badge variant="destructive">Work</Badge>
              <Badge variant="secondary">Session 1</Badge>
            </CardHeader>
            <CardContent className="justify-center items-center">
              <CardTitle className="font-extrabold text-7xl text-center mx-4">50:00</CardTitle>
            </CardContent>
            <CardFooter className="justify-center border-t gap-2">
              <SupportButton />
              <ResetButton />
              <TimerButton />
              <SettingsButton />
              <ThemeButton />
            </CardFooter>
          </Card>
        </SettingsProvider>
      </ThemeProvider>
    </div>
  );
}
