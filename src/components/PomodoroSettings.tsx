import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export default function PomodoroSettings() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[250px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your pomodoro workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor="workMinutes">
              Work <br />
              Minutes
            </Label>
            <Input id="workMinutes" value="50" className="w-[5rem]" />
          </div>
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor="shortBreakMinutes">
              Short Break <br />
              Minutes
            </Label>
            <Input id="shortBreakMinutes" value="10" className="w-[5rem]" />
          </div>
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor="longBreakMinutes">
              Long Break <br />
              Minutes
            </Label>
            <Input id="longBreakMinutes" value="60" className="w-[5rem]" />
          </div>
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor="longBreakInterval">
              Long Break <br />
              Interval
            </Label>
            <Input id="longBreakInterval" value="4" className="w-[5rem]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
