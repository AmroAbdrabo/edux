'use client';

import type { Course } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { loadTranslations } from '@/lib/i18n-client'; // Updated import path

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

  const scheduleRegex = /^(.*?)\s+(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))$/;
  const match = course.schedule.match(scheduleRegex);

  if (!match) {
    console.warn(`Could not parse schedule string: ${course.schedule} for course ${course.code}`);
    return events;
  }

  const daysPart = match[1];
  const startTimeStr = match[2];
  const endTimeStr = match[3];

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
    THURSDAY: 'Thu', THU: 'Thu', TH: 'Thu', R: 'Thu',
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
  locale: string;
}

export default function CourseScheduleCalendar({ courses, locale }: CourseScheduleCalendarProps) {
  const processedEvents = useMemo(
    () =>
      courses.flatMap((course, index) =>
        parseScheduleString(course, colorPalette, index)
      ),
    [courses]
  );

  const timeSlots = Array.from(
    { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
    (_, i) => CALENDAR_START_HOUR + i
  );

  const [translations, setTranslations] = useState<any>({});
  useEffect(() => {
    const fetchTranslations = async () => {
      const t = await loadTranslations(locale);
      setTranslations(t);
    };
    fetchTranslations();
  }, [locale]);

  // Pull out weekday translations (with English fallbacks)
  const weekdaysShort: Record<DayKey, string> = {
    Mon: translations.weekdaysShort?.Mon || 'Mon',
    Tue: translations.weekdaysShort?.Tue || 'Tue',
    Wed: translations.weekdaysShort?.Wed || 'Wed',
    Thu: translations.weekdaysShort?.Thu || 'Thu',
    Fri: translations.weekdaysShort?.Fri || 'Fri',
  };
  const weekdaysFull: Record<DayKey, string> = {
    Mon: translations.weekdaysFull?.Mon || 'Monday',
    Tue: translations.weekdaysFull?.Tue || 'Tuesday',
    Wed: translations.weekdaysFull?.Wed || 'Wednesday',
    Thu: translations.weekdaysFull?.Thu || 'Thursday',
    Fri: translations.weekdaysFull?.Fri || 'Friday',
  };

  const calendarGridStartMinute = CALENDAR_START_HOUR * 60;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-primary">
          <CalendarClock className="mr-2 h-6 w-6" />
          {translations.schedulePreview || 'Course Schedule'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            {translations.schedulePlaceholder}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px] relative">
              <div className="grid grid-cols-[60px_repeat(5,1fr)] border border-border rounded-md overflow-hidden">
                {/* --- Header Row --- */}
                <div className="p-2 border-r border-b border-border font-semibold text-sm text-muted-foreground sticky top-0 left-0 bg-card z-20">
                  {translations.timeLabel || 'Time'}
                </div>
                {DAY_KEYS_ORDERED.map((dayKey) => (
                  <div
                    key={dayKey}
                    className="p-2 border-r border-b border-border font-semibold text-sm text-center text-muted-foreground bg-card sticky top-0 z-10"
                    title={weekdaysFull[dayKey]}
                  >
                    {weekdaysShort[dayKey]}
                  </div>
                ))}

                {/* --- Time Slot Rows & Grid --- */}
                {timeSlots.map((hour, idx) => (
                  <div key={hour} className="contents">
                    <div
                      className="p-2 border-r border-b border-border text-xs text-muted-foreground sticky left-0 bg-card z-10 flex items-center justify-center"
                      style={{ height: `${HOUR_HEIGHT_PX}px`, gridRow: idx + 2 }}
                    >
                      {`${hour % 12 === 0 ? 12 : hour % 12}:00 ${
                        hour < 12 || hour === 24 ? 'AM' : 'PM'
                      }`}
                    </div>
                    {DAY_KEYS_ORDERED.map((day, dayIdx) => (
                      <div
                        key={`${day}-${hour}`}
                        className={`border-r border-b border-border ${
                          day === 'Fri' ? 'border-r-0' : ''
                        } ${idx === timeSlots.length - 1 ? 'border-b-0' : ''} bg-background/20`}
                        style={{
                          height: `${HOUR_HEIGHT_PX}px`,
                          gridRow: idx + 2,
                          gridColumn: dayIdx + 2,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* --- Events Layer --- */}
              <div
                className="absolute left-[60px] right-0 bottom-0"
                style={{ top: `calc(2rem + 1px)` }}
              >
                <div className="relative w-full h-full">
                  {processedEvents.map((event) => {
                    const topOffset =
                      (event.startTimeMinutes - calendarGridStartMinute) *
                      PIXELS_PER_MINUTE;
                    const visibleStart = Math.max(
                      calendarGridStartMinute,
                      event.startTimeMinutes
                    );
                    const visibleEnd = Math.min(
                      CALENDAR_END_HOUR * 60,
                      event.endTimeMinutes
                    );
                    const displayTop = Math.max(0, topOffset);
                    const displayHeight =
                      Math.max(0, visibleEnd - visibleStart) *
                      PIXELS_PER_MINUTE;
                    if (displayHeight <= 0) return null;
                    const dayIndex = DAY_KEYS_ORDERED.indexOf(event.dayOfWeek);
                    const colWidth = 100 / DAY_KEYS_ORDERED.length;
                    const leftPct = dayIndex * colWidth;
                    const formatTime = (mins: number) => {
                      const h = Math.floor(mins / 60);
                      const m = String(mins % 60).padStart(2, '0');
                      const h12 = h % 12 === 0 ? 12 : h % 12;
                      const per = h < 12 || h === 24 ? 'AM' : 'PM';
                      return `${h12}:${m} ${per}`;
                    };
                    const timeStr = `${formatTime(
                      event.startTimeMinutes
                    )} - ${formatTime(event.endTimeMinutes)}`;

                    return (
                      <div
                        key={event.id}
                        className={`absolute rounded-md p-1.5 shadow-md overflow-hidden ${event.bgColorClass} ${event.textColorClass} ${event.borderColorClass} border z-10`}
                        style={{
                          top: `${displayTop}px`,
                          height: `${displayHeight}px`,
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${colWidth}% - 4px)`,
                        }}
                        title={`${weekdaysFull[event.dayOfWeek]}, ${timeStr}\n${event.courseCode}: ${event.courseName}`}
                      >
                        <p className="text-xs font-semibold truncate">
                          {event.courseCode}
                        </p>
                        <p className="text-[10px] leading-tight truncate">
                          {event.courseName}
                        </p>
                        {displayHeight > 30 && (
                          <p className="text-[9px] leading-tight truncate mt-0.5">
                            {timeStr}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}