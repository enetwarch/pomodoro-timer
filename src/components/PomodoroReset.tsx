import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

export default function PomodoroReset() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <RotateCcw />
          <span className="sr-only">Reset</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[300px]">
        <DialogHeader className="text-left">
          <DialogTitle>Reset</DialogTitle>
          <DialogDescription>
            How would you like to reset your Pomodoro? Soft reset will only
            reset your current timer. Hard reset will do the same while also
            resetting your session and state.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Soft</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Hard</Button>
            </DialogTrigger>
            <DialogContent className="w-[300px]">
              <DialogHeader className="text-left">
                <DialogTitle>Confirmation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to hard reset your timer? This will
                  place your pomodoro state to <u>Work Session 1</u>.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="neverShowAgain" />
                  <Label htmlFor="neverShowAgain">Never show this again</Label>
                </div>
              </div>
              <DialogFooter className="flex-row justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
