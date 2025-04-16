"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RotateCcw } from "lucide-react";

const formSchema = z.object({
  neverShowHardResetPromptAgain: z.boolean().default(false).optional(),
});

function PomodoroReset() {
  const [isHardResetConfirmationOpen, setIsHardResetConfirmationOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      neverShowHardResetPromptAgain: false,
    },
  });

  const handleSoftReset = () => {
    console.log("soft reset performed.");
  };

  const handleHardReset = () => {
    const neverShowHardResetPromptAgain = localStorage.getItem("neverShowHardResetPromptAgain");
    const shouldSkipPrompt = neverShowHardResetPromptAgain ? JSON.parse(neverShowHardResetPromptAgain) : false;

    if (shouldSkipPrompt) {
      console.log("hard reset performed.");
    } else {
      setIsHardResetConfirmationOpen(true);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const checkboxValue = values.neverShowHardResetPromptAgain;
    localStorage.setItem("neverShowHardResetPromptAgain", JSON.stringify(checkboxValue));

    console.log("hard reset performed.");
    setIsHardResetConfirmationOpen(false);
  };

  return (
    <>
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
              How would you like to reset your Pomodoro? Soft reset will only reset your current timer. Hard reset will
              do the same while also resetting your session and state.
            </DialogDescription>
          </DialogHeader>
          <div />
          <DialogFooter className="flex-row justify-end flex-wrap">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSoftReset}>Soft</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleHardReset}>
                Hard
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHardResetConfirmationOpen} onOpenChange={setIsHardResetConfirmationOpen}>
        <DialogContent className="w-[300px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <DialogHeader className="text-left">
                <DialogTitle>Confirmation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to hard reset your timer? This will place your pomodoro state to{" "}
                  <u>Work Session 1</u>.
                </DialogDescription>
              </DialogHeader>
              <div className="flex py-2">
                <FormField
                  control={form.control}
                  name="neverShowHardResetPromptAgain"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Never show this again</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex-row justify-end flex-wrap">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" type="submit">
                    Confirm
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PomodoroReset;
