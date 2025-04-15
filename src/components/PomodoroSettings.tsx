import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PomodoroSettings() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Make changes to your pomodoro settings here. Click save when you're done or close the dialog to cancel.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="workMinutes">
              Work
            </Label>
            <Input id="workMinutes" value="50" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortBreakMinutes">
              Short Break
            </Label>
            <Input id="shortBreakMinutes" value="10" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longBreakMinutes">
              Long Break
            </Label>
            <Input id="longBreakMinutes" value="60" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
