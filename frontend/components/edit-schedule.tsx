"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/hooks/use-toast";

interface TimeSlot {
  hour: number;
  selected: boolean;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

interface DragState {
  isDragging: boolean;
  startDay: string | null;
  startHour: number | null;
  selecting: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function EditSchedule() {
  const { user, loading: authLoading, session } = useAuth();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<WeekSchedule>(
    DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          enabled: true,
          slots: HOURS.map((hour) => ({ hour, selected: false })),
        },
      }),
      {},
    ),
  );

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startDay: null,
    startHour: null,
    selecting: false,
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const VISIBLE_HOURS = 12;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("lending_active")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data?.lending_active) {
          const binarySchedule = data.lending_active;
          const newSchedule = DAYS.reduce((acc, day, dayIndex) => {
            const dayBinary = binarySchedule.slice(
              dayIndex * 24,
              (dayIndex + 1) * 24,
            );
            return {
              ...acc,
              [day]: {
                enabled: true,
                slots: HOURS.map((hour) => ({
                  hour,
                  selected: dayBinary[hour] === "1",
                })),
              },
            };
          }, {} as WeekSchedule);
          setSchedule(newSchedule);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.id]);

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? " PM" : " AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const handleMouseDown = (
    day: string,
    hour: number,
    currentSelected: boolean,
  ) => {
    setDragState({
      isDragging: true,
      startDay: day,
      startHour: hour,
      selecting: !currentSelected,
    });

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) =>
          slot.hour === hour ? { ...slot, selected: !currentSelected } : slot,
        ),
      },
    }));
  };

  const handleMouseEnter = (day: string, hour: number) => {
    if (!dragState.isDragging) return;

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) =>
          slot.hour === hour
            ? { ...slot, selected: dragState.selecting }
            : slot,
        ),
      },
    }));
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      startDay: null,
      startHour: null,
      selecting: false,
    });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        handleMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [dragState.isDragging]);

  const handleSaveSchedule = async () => {
    if (!session || !user) {
      return;
    }

    const binarySchedule = Object.entries(schedule).reduce(
      (acc, [day, { slots }]) => {
        const dayBinary = slots
          .map((slot) => (slot.selected ? "1" : "0"))
          .join("");
        return { ...acc, [day]: dayBinary };
      },
      {} as Record<string, string>,
    );

    const fullBinaryString = DAYS.map((day) => binarySchedule[day]).join("");

    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          const { data: insertData, error: insertError } = await supabase
            .from("users")
            .insert({
              id: user.id,
              email: user.email,
              display_name: user.email,
              lending_active: fullBinaryString,
              updated_at: new Date().toISOString(),
              transactions: [],
            })
            .select();

          if (insertError) {
            toast({
              variant: "destructive",
              title: "Error saving schedule",
              description: "Failed to create new schedule. Please try again.",
            });
            throw insertError;
          }

          toast({
            title: "Schedule created",
            description: "Your lending schedule has been created successfully.",
          });
          return;
        }
        throw fetchError;
      }

      const { data: updateData, error: updateError } = await supabase
        .from("users")
        .update({
          lending_active: fullBinaryString,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select();

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Error saving schedule",
          description: "Failed to update schedule. Please try again.",
        });
        throw updateError;
      }

      toast({
        title: "Schedule updated!",
        description: "Your lending schedule has been updated.",
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        variant: "destructive",
        title: "Error saving schedule",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  if (authLoading) {
    return (
      <Card className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Card>
    );
  }

  if (!session || !user) {
    return (
      <Card className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">
            Please sign in to manage your schedule
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-5 w-5" />
        <h2 className="text-2xl font-medium font-oddlini">Lending Schedule</h2>
      </div>

      <p className="text-base text-muted-foreground font-hanken mb-6">
        Click and drag to select multiple time slots when you're available.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="relative">
          <div
            className="flex gap-[1px] overflow-x-auto pb-4 select-none"
            ref={gridRef}
          >
            <div className="flex flex-col gap-[1px] pr-2 sticky left-0 bg-white z-10">
              <div className="h-8 font-medium font-hanken" />
              {HOURS.slice(0, isExpanded ? HOURS.length : VISIBLE_HOURS).map(
                (hour) => (
                  <div
                    key={hour}
                    className="h-8 flex items-center justify-end pr-2 text-sm text-muted-foreground font-hanken"
                  >
                    {formatHour(hour)}
                  </div>
                ),
              )}
            </div>

            {DAYS.map((day) => (
              <div key={day} className="flex flex-col gap-[1px] min-w-[100px]">
                <div className="h-8 font-medium font-hanken text-center border-b">
                  {formatDay(day)}
                </div>
                {schedule[day].slots
                  .slice(0, isExpanded ? HOURS.length : VISIBLE_HOURS)
                  .map((slot, hourIndex) => (
                    <button
                      key={hourIndex}
                      onMouseDown={() =>
                        handleMouseDown(day, slot.hour, slot.selected)
                      }
                      onMouseEnter={() => handleMouseEnter(day, slot.hour)}
                      className={cn(
                        "h-8 text-xs font-medium transition-colors relative",
                        "hover:bg-primary/90 hover:text-primary-foreground",
                        slot.selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                        "border-r border-background last:border-r-0",
                        hourIndex % 2 === 0
                          ? "bg-opacity-90"
                          : "bg-opacity-100",
                      )}
                    >
                      {slot.selected && (
                        <Check className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                      <span className="sr-only">{formatHour(slot.hour)}</span>
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}

          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {isExpanded && (
            <Button onClick={handleSaveSchedule} className="w-full mt-6">
              Save Schedule
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
