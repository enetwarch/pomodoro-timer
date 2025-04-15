import { Play, Pause } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PomodoroToggle() {
  const [toggled, setToggled] = useState(false);

  const handlePress = () => {
    setToggled(!toggled);
  }

  return (
    <Button variant="outline" size="icon" asChild>
      <Toggle variant="outline" pressed={toggled} onPressedChange={handlePress}>
        {toggled ? <Pause /> : <Play />}
      </Toggle>
    </Button>
  );
}