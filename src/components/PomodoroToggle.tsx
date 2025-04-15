import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

export default function PomodoroToggle() {
  const [toggled, setToggled] = useState(false);

  const handlePress = () => {
    setToggled(!toggled);
  };

  return (
    <Button variant="outline" size="icon" asChild>
      <Toggle variant="outline" pressed={toggled} onPressedChange={handlePress}>
        {toggled ? <Pause /> : <Play />}
        <span className="sr-only">Toggle Timer</span>
      </Toggle>
    </Button>
  );
}
