"use client";

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

import { usePomodoro } from "@/hooks/pomodoro/pomodoro-provider";
import { type Settings, useSettings } from "@/hooks/pomodoro/settings-provider";
import { useToggled } from "@/hooks/pomodoro/toggled-provider";

import { getSettingsKey } from "@/lib/utils/pomodoro";

// External dependencies
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type hardResetFormSchemaObject = z.ZodObject<{
  neverShowHardResetPromptAgain: z.ZodOptional<z.ZodBoolean>;
}>;

const hardResetFormSchema: hardResetFormSchemaObject = z.object({
  neverShowHardResetPromptAgain: z.boolean().optional(),
});

function ResetButton(): React.ReactNode {
  // Custom hooks
  const { settings } = useSettings();
  const { state, setState, setSession, setTimer } = usePomodoro();
  const { setToggled } = useToggled();

  // Used to solve double dialog nesting issue from shadcn.
  const [isHardResetConfirmationOpen, setIsHardResetConfirmationOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof hardResetFormSchema>>({
    resolver: zodResolver(hardResetFormSchema),
    defaultValues: {
      neverShowHardResetPromptAgain: false,
    },
  });

  const handleSoftResetButtonClick = (): void => {
    setToggled(false);
    const key: keyof Settings = getSettingsKey(state);

    setTimer({
      minutes: settings[key],
      seconds: 0,
    });
  };

  const hardReset = (): void => {
    setToggled(false);

    setState("Work");
    setSession(1);
    setTimer({
      minutes: settings.workMinutes,
      seconds: 0,
    });
  };

  const handleHardResetButtonClick = (): void => {
    const neverShowHardResetPromptAgain = localStorage.getItem("neverShowHardResetPromptAgain");
    const shouldSkipPrompt = neverShowHardResetPromptAgain ? JSON.parse(neverShowHardResetPromptAgain) : false;

    if (shouldSkipPrompt) {
      hardReset();
    } else {
      setIsHardResetConfirmationOpen(true);
    }
  };

  const onHardResetFormSubmit = (values: z.infer<typeof hardResetFormSchema>): void => {
    const checkboxValue = values.neverShowHardResetPromptAgain;
    localStorage.setItem("neverShowHardResetPromptAgain", JSON.stringify(checkboxValue));

    hardReset();
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
              <Button onClick={handleSoftResetButtonClick}>Soft</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleHardResetButtonClick}>
                Hard
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHardResetConfirmationOpen} onOpenChange={setIsHardResetConfirmationOpen}>
        <DialogContent className="w-[300px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onHardResetFormSubmit)} className="flex flex-col gap-4">
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

export { ResetButton };
