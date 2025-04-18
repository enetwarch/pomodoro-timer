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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/pomodoro/settings-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings as SettingsIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { type Control, type FieldPath, useForm } from "react-hook-form";
import { z } from "zod";

const formSchemaIntegerLimits = (min: number, max: number): z.ZodNumber => {
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

type formSchemaObject = z.ZodObject<{
  workMinutes: z.ZodNumber;
  shortBreakMinutes: z.ZodNumber;
  longBreakMinutes: z.ZodNumber;
  longBreakInterval: z.ZodNumber;
}>;

const formSchema: formSchemaObject = z.object({
  workMinutes: formSchemaIntegerLimits(1, 60),
  shortBreakMinutes: formSchemaIntegerLimits(1, 60),
  longBreakMinutes: formSchemaIntegerLimits(1, 60),
  longBreakInterval: formSchemaIntegerLimits(1, 10),
});

function SettingsButton(): React.ReactNode {
  const { settings, setSettings } = useSettings();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMinutes: settings.workMinutes,
      shortBreakMinutes: settings.shortBreakMinutes,
      longBreakMinutes: settings.longBreakMinutes,
      longBreakInterval: settings.longBreakInterval,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>): void => {
    setSettings(values);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[300px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <DialogHeader className="text-left">
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Customize your pomodoro workflow.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col justify-center gap-4 py-4">
              <SettingsFormField control={form.control} name="workMinutes" label="Work Minutes" />
              <SettingsFormField control={form.control} name="shortBreakMinutes" label="Short Break Minutes" />
              <SettingsFormField control={form.control} name="longBreakMinutes" label="Long Break Minutes" />
              <SettingsFormField control={form.control} name="longBreakInterval" label="Long Break Interval" />
            </div>
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

type SettingsFormFieldProps = {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
};

function SettingsFormField({ label, ...props }: SettingsFormFieldProps) {
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

export { SettingsButton };
