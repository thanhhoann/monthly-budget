"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcCalendar } from "react-icons/fc";

export default function FormCard() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState<Date>();
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");

  const supabase = createClientComponentClient();
  const router = useRouter();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const record = {
      name: name,
      price: price,
      date: date?.toLocaleDateString(),
      category: category,
      desc: desc,
    };
    insertData({ record });

    setName("");
    setPrice("");
    setDesc("");

    // router.refresh();
  };

  async function insertData({ record }: any) {
    await supabase.from("spends").insert(record);
  }

  return (
    <>
      <Card className="m-5 pt-4">
        <CardContent>
          <form>
            <Input
              className="mb-3"
              type="text"
              placeholder="What did you buy ?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="mb-3"
              type="number"
              placeholder="$"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal mb-3",
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

            <Select onValueChange={(e) => setCategory(e)}>
              <SelectTrigger className="w-[280px] mb-3">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eatings">Eatings</SelectItem>
                <SelectItem value="leisures">Leisures</SelectItem>
                <SelectItem value="misc">Misc</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              className="mb-3"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <Button type="submit" onClick={onSubmit}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
