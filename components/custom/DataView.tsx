"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FcCalendar } from "react-icons/fc";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function DataView() {
  const [data, setData] = useState<any>([]);
  const [dateBasedData, setDateBasedData] = useState<any>([]);
  const [date, setDate] = useState<Date>();
  const [totalDaySpent, setTotalDaySpent] = useState(0);
  const [totalMonthSpent, setTotalMonthSpent] = useState(0);
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
    // set data according to picked date
    let arr: any = [];
    for (let i = 0; i <= data.length - 1; i++) {
      if (data[i].date == date?.toLocaleDateString()) {
        arr.push(data[i]);
      }
    }
    setDateBasedData(arr);

    // calculate the total spent of picked date
    let daySpent = 0;
    for (let i = 0; i <= arr.length - 1; i++) {
      daySpent += arr[i].price;
    }
    setTotalDaySpent(daySpent);

    // calculate the total spent of picked month
    let monthSpent = 0;
    for (let i = 0; i <= data.length - 1; i++) {
      let currentMonth = date?.toLocaleDateString()[0];
      let temp = data[i].date[0];

      if (temp == currentMonth) {
        monthSpent += data[i].price;
      }
    }
    setTotalMonthSpent(monthSpent);
  }, [date]);

  console.log(date?.toLocaleDateString()[0]);

  return (
    <>
      <Card className="m-4 py-4">
        <CardContent>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal ",
                    !date && "text-muted-foreground"
                  )}
                >
                  <FcCalendar className="mr-2 h-4 w-4" />
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
          <div className="mt-6">
            <h1 className="font-bold">
              Total monthly spent : $ {totalMonthSpent}
            </h1>
            <h2>Total spent of the day : $ {totalDaySpent}</h2>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex  flex-wrap justify-around">
            {dateBasedData.map((item: any) => (
              <>
                <div className="m-1 border border-gray-300 rounded-lg shadow p-2 w-[120px]">
                  <h1 className="font-bold">{item.name}</h1>
                  <div>$ {item.price}</div>
                  {item.desc && <p className="text-gray-500">{item.desc}</p>}
                </div>
              </>
            ))}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
