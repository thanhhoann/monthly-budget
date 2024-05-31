"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MonthlyDataView() {
  const [data, setData] = useState<any>([]);
  const [dateBasedData, setDateBasedData] = useState<any>([]);
  const [date, setDate] = useState<Date>();
  const [balanceUp, setBalanceUp] = useState(0);
  const [balanceDown, setBalanceDown] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getSpends() {
      const { data: spends } = await supabase.from("spends").select();
      console.log(spends);
      setData(spends);
    }

    getSpends();
  }, []);

  useEffect(() => {
    let arr: any = [];
    for (let i = 0; i <= data.length - 1; i++) {
      if (data[i].date == date?.toLocaleDateString()) {
        arr.push(data[i]);
      }
    }
    setDateBasedData(arr);

    let spent = 0;
    for (let i = 0; i <= arr.length - 1; i++) {
      spent += arr[i].price;
    }
    setBalanceDown(spent);
  }, [date]);

  return (
    <>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal mb-3",
                !date && "text-muted-foreground"
              )}
            >
              {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>- {balanceDown}</div>
      <div className="flex flex-row flex-wrap">
        {dateBasedData.map((item: any) => (
          <>
            <div className="w-[200px] m-4 bg-gray-200 border border-gray-300 rounded-lg shadow p-4">
              <div>Name: {item.name}</div>
              <div>Price: {item.price}</div>
              <div>Description: {item.desc}</div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
