'use client';

import type { Course } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';
import { useMemo } from 'react';

type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

interface ParsedEvent {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  dayOfWeek: DayKey;
  startTimeMinutes: number; // Minutes since midnight
  endTimeMinutes: number;   // Minutes since midnight
  bgColorClass: string;
  textColorClass: string;
  borderColorClass: string;
}

const DAY_KEYS_ORDERED: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const CALENDAR_START_HOUR = 8; // 8 AM
const CALENDAR_END_HOUR = 18; // 6 PM
const HOUR_HEIGHT_PX = 60; // Height of one hour slot in pixels
const PIXELS_PER_MINUTE = HOUR_HEIGHT_PX / 60;

const timeToMinutes = (timeStr: string): number | null => {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0; // Midnight case

  return hours * 60 + minutes;
};

const parseScheduleString = (course: Course, colorPalette: Array<{bg: string, text: string, border: string}>, courseIndex: number): ParsedEvent[] => {
  const events: ParsedEvent[] = [];
  if (!course.schedule) return events;

  // Regex to capture days, start time, and end time
  // Example: "Mon, Wed, Fri 11:00 AM - 11:50 AM"
  // Example: "Tue, Thu 1:00 PM - 2:50 PM"
  const scheduleRegex = /^(.*?)\s+(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))$/;
  const match = course.schedule.match(scheduleRegex);

  if (!match) {
    console.warn(`Could not parse schedule string: ${course.schedule} for course ${course.code}`);
    return events;
  }

  const daysPart = match[1]; // "Mon, Wed, Fri" or "Tue, Thu"
  const startTimeStr = match[2]; // "11:00 AM"
  const endTimeStr = match[3]; // "11:50 AM"

  const startTimeMinutes = timeToMinutes(startTimeStr);
  const endTimeMinutes = timeToMinutes(endTimeStr);

  if (startTimeMinutes === null || endTimeMinutes === null || endTimeMinutes <= startTimeMinutes) {
    console.warn(`Invalid time range for ${course.code}: ${startTimeStr} - ${endTimeStr}`);
    return events;
  }
  
  const dayAbbreviations: { [key: string]: DayKey } = {
    MONDAY: 'Mon', MON: 'Mon',
    TUESDAY: 'Tue', TUE: 'Tue', TU: 'Tue',
    WEDNESDAY: 'Wed', WED: 'Wed', W: 'Wed',
    THURSDAY: 'Thu', THU: 'Thu', TH: 'Thu', R: 'Thu', // R for Thursday is common in some systems
    FRIDAY: 'Fri', FRI: 'Fri', F: 'Fri',
  };

  const scheduledDays = daysPart.split(',').map(d => d.trim().toUpperCase());
  const color = colorPalette[courseIndex % colorPalette.length];

  scheduledDays.forEach(dayStr => {
    const dayKey = dayAbbreviations[dayStr];
    if (dayKey && DAY_KEYS_ORDERED.includes(dayKey)) {
      events.push({
        id: `${course.id}-${dayKey}-${startTimeMinutes}`,
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        dayOfWeek: dayKey,
        startTimeMinutes,
        endTimeMinutes,
        bgColorClass: color.bg,
        textColorClass: color.text,
        borderColorClass: color.border,
      });
    } else {
        console.warn(`Unknown day string: ${dayStr} in schedule for ${course.code}`);
    }
  });

  return events;
};

const colorPalette = [
  { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300' },
  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' },
  { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-300' },
  { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
];

interface CourseScheduleCalendarProps {
  courses: Course[];
}

export default function CourseScheduleCalendar({ courses }: CourseScheduleCalendarProps) {
  const processedEvents = useMemo(() => {
    return courses.flatMap((course, index) => parseScheduleString(course, colorPalette, index));
  }, [courses]);

  const timeSlots = Array.from(
    { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
    (_, i) => CALENDAR_START_HOUR + i
  );

  const calendarGridStartMinute = CALENDAR_START_HOUR * 60;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-primary">
          <CalendarClock className="mr-2 h-6 w-6" /> Weekly Schedule Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            Your weekly schedule will appear here once you add courses to your cart.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]"> {/* Ensure minimum width for readability */}
              <div className="grid grid-cols-[60px_repeat(5,1fr)] border border-border rounded-md">
                {/* Header Row: Time Slot Names + Day Names */}
                <div className="p-2 border-r border-b border-border font-semibold text-sm text-muted-foreground sticky left-0 bg-card z-10">Time</div>
                {DAY_KEYS_ORDERED.map(day => (
                  <div key={day} className="p-2 border-r border-b border-border font-semibold text-sm text-center text-muted-foreground bg-card">
                    {day}
                  </div>
                ))}

                {/* Time Slot Rows */}
                {timeSlots.map(hour => (
                  <div key={hour} className="contents"> {/* Use 'contents' to make children part of the parent grid */}
                    <div className="p-2 border-r border-b border-border text-xs text-muted-foreground sticky left-0 bg-card z-10 flex items-center justify-center" style={{ height: `${HOUR_HEIGHT_PX}px` }}>
                      {`${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}`}
                    </div>
                    {DAY_KEYS_ORDERED.map(dayKey => (
                      <div key={`${dayKey}-${hour}`} className="relative border-r border-b border-border">
                        {/* Placeholder for grid lines, actual events are absolutely positioned */}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Event Rendering Layer - Positioned over the grid slots */}
                {/* This needs to be outside the timeSlots.map to render events spanning multiple slots correctly relative to day columns */}
                {DAY_KEYS_ORDERED.map((dayKey, dayIndex) => (
                    <div key={`event-col-${dayKey}`} className="relative" style={{ gridColumnStart: dayIndex + 2, gridRowStart: 2, gridRowEnd: timeSlots.length + 2 }}>
                        {processedEvents
                          .filter(event => event.dayOfWeek === dayKey)
                          .map(event => {
                            const topOffset = (event.startTimeMinutes - calendarGridStartMinute) * PIXELS_PER_MINUTE;
                            const eventHeight = (event.endTimeMinutes - event.startTimeMinutes) * PIXELS_PER_MINUTE;

                            // Ensure event is within calendar viewable time
                            if (event.endTimeMinutes <= calendarGridStartMinute || event.startTimeMinutes >= (CALENDAR_END_HOUR * 60)) {
                                return null;
                            }
                            
                            const displayTop = Math.max(0, topOffset);
                            const displayHeight = Math.max(0, Math.min(eventHeight, (CALENDAR_END_HOUR * 60 - Math.max(calendarGridStartMinute, event.startTimeMinutes)) * PIXELS_PER_MINUTE ));


                            if (displayHeight <=0) return null;

                            return (
                              <div
                                key={event.id}
                                className={`absolute w-[96%] left-[2%] rounded-md p-1.5 shadow-md overflow-hidden ${event.bgColorClass} ${event.textColorClass} ${event.borderColorClass} border`}
                                style={{
                                  top: `${displayTop}px`,
                                  height: `${displayHeight}px`,
                                }}
                                title={`${event.courseCode}: ${event.courseName}\n${(event.startTimeMinutes/60)%12 || 12}:${String(event.startTimeMinutes%60).padStart(2,'0')} - ${(event.endTimeMinutes/60)%12 || 12}:${String(event.endTimeMinutes%60).padStart(2,'0')}`}
                              >
                                <p className="text-xs font-semibold truncate">{event.courseCode}</p>
                                <p className="text-[10px] leading-tight truncate">{event.courseName}</p>
                              </div>
                            );
                          })}
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}