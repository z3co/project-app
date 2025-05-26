"use client";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
interface DatePickerProps extends React.HTMLAttributes<HTMLElement> {
	id?: string;
}

export function DatePicker({ id, ...props }: DatePickerProps) {
	const [date, setDate] = React.useState<Date>();
	if (date) {
		console.log(date.toJSON());
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					id={id}
					{...props}
					className={cn(
						"w-[240px] justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
					<input
						id="endDate"
						name="endDate"
						className="hidden"
						value={date ? date.toJSON() : ""}
						readOnly
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
