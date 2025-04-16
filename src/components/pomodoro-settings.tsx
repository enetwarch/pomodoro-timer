"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Control, type FieldPath, type FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";

const formSchemaIntegerLimits = (min: number, max: number) => {
  return z.coerce
    .number({
      required_error: "required",
      invalid_type_error: "must be a number.",
    })
    .int({
      message: "must not have decimals.",
    })
    .min(min, {
      message: `must have a minimum value of ${min}.`,
    })
    .max(max, {
      message: `must have a maximum value of ${max}.`,
    });
};

const formSchema = z.object({
  workMinutes: formSchemaIntegerLimits(1, 60),
  shortBreakMinutes: formSchemaIntegerLimits(1, 60),
  longBreakMinutes: formSchemaIntegerLimits(1, 60),
  longBreakInterval: formSchemaIntegerLimits(1, 10),
});

export default function PomodoroSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 30,
      longBreakInterval: 4,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[300px]">
        <Form {...form}>
          <DialogHeader className="text-left">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Customize your pomodoro workflow.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
            <SettingsFormField control={form.control} name="workMinutes" label="Work Minutes" />
            <SettingsFormField control={form.control} name="shortBreakMinutes" label="Short Break Minutes" />
            <SettingsFormField control={form.control} name="longBreakMinutes" label="Long Break Minutes" />
            <SettingsFormField control={form.control} name="longBreakInterval" label="Long Break Interval" />
            <DialogFooter className="flex-row justify-end flex-wrap">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type SettingsFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
};

function SettingsFormField<T extends FieldValues>({ label, ...props }: SettingsFormFieldProps<T>) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className="flex justify-between items-center gap-4">
          <div className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
          <FormControl>
            <Input className="max-w-[5rem]" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
