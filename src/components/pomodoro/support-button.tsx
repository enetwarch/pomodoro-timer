"use client";

import { Button } from "@/components/ui/button";
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
import { Heart } from "lucide-react";

function SupportButton(): React.ReactNode {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Heart />
          <span className="sr-only">Support</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[300px]">
        <DialogHeader className="text-left">
          <DialogTitle>Support</DialogTitle>
          <DialogDescription>
            Would you mind taking a minute to visit the GitHub repository of this site to give it a star?
          </DialogDescription>
        </DialogHeader>
        <div />
        <DialogFooter className="flex-row justify-end flex-wrap">
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button asChild>
              <a target="_blank" href="https://github.com/enetwarch/pomodoro-timer" rel="noreferrer">
                Sure
              </a>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { SupportButton };
