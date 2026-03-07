"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-8 font-normal text-[0.8rem] dark:text-gray-400",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-blue-100 dark:[&:has([aria-selected])]:bg-blue-900/30 [&:has([aria-selected].day-outside)]:bg-blue-100/50",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white dark:bg-blue-500",
        day_today: "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
        day_outside:
          "day-outside text-gray-500 opacity-50 aria-selected:bg-blue-100/50 aria-selected:text-gray-500 dark:text-gray-400",
        day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
        day_range_middle:
          "aria-selected:bg-blue-100 aria-selected:text-blue-900 dark:aria-selected:bg-blue-900/30 dark:aria-selected:text-blue-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
