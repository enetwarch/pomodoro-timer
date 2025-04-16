"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

export default function PomodoroReset() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      neverShowHardResetPromptAgain: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

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
            How would you like to reset your Pomodoro? Soft reset will only reset your current timer. Hard reset will do
            the same while also resetting your session and state.
          </DialogDescription>
        </DialogHeader>
        <div />
        <DialogFooter className="flex-row justify-end flex-wrap">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Soft</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Hard</Button>
            </DialogTrigger>
            <DialogContent className="w-[300px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader className="text-left">
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to hard reset your timer? This will place your pomodoro state to{" "}
                      <u>Work Session 1</u>.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex py-4">
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
                    <Button variant="destructive">Confirm</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
