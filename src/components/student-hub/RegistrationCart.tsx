'use client';

import type { Course, CreditSummary } from '@/lib/types';
import { MAX_CREDITS } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X, ShoppingCart, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadTranslations } from '@/lib/i18n-client'; // Updated import path
import { useState, useEffect } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RegistrationCartProps {
  selectedCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
  creditSummary: CreditSummary;
  onRegister: () => void;
  locale: string;
}

type Slot = { day: string; start: number; end: number };

export default function RegistrationCart({
  selectedCourses,
  onRemoveCourse,
  creditSummary,
  onRegister,
  locale
}: RegistrationCartProps) {
  const { toast } = useToast();

  // Parse "Mon, Wed 10:00 AM - 11:30 AM" into [{ day, start, end }, ...]
  const parseSchedule = (sched: string): Slot[] => {
    const m = sched.match(/^([\w\s,]+)\s+(\d{1,2}:\d{2}\s[AP]M)\s*-\s*(\d{1,2}:\d{2}\s[AP]M)$/);
    if (!m) return [];
    const days = m[1].split(',').map(d => d.trim());
    const toMins = (t: string) => {
      let [time, mer] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (mer === 'PM' && h < 12) h += 12;
      if (mer === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    const start = toMins(m[2]), end = toMins(m[3]);
    return days.map(day => ({ day, start, end }));
  };

  // Find all pairs of courses whose parsed slots overlap on the same day
  const detectScheduleConflicts = (courses: Course[]): [Course, Course][] => {
    const conflicts: [Course, Course][] = [];
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const a = courses[i], b = courses[j];
        const slotsA = parseSchedule(a.schedule);
        const slotsB = parseSchedule(b.schedule);
        let found = false;
        for (const sa of slotsA) {
          for (const sb of slotsB) {
            if (
              sa.day === sb.day &&
              sa.start < sb.end &&
              sb.start < sa.end
            ) {
              conflicts.push([a, b]);
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
    }
    return conflicts;
  };

  const conflicts = detectScheduleConflicts(selectedCourses);

  // existing credit-overload alerts
  const getAlerts = () => {
    const alerts: { type: 'warning' | 'error'; message: string }[] = [];
    if (creditSummary.total > MAX_CREDITS.total) {
      alerts.push({
        type: 'error',
        message: `Total credits (${creditSummary.total}) exceed maximum allowed (${MAX_CREDITS.total}).`,
      });
    }
    if (creditSummary.major > MAX_CREDITS.major) {
      alerts.push({
        type: 'warning',
        message: `Major credits (${creditSummary.major}) exceed recommended limit (${MAX_CREDITS.major}).`,
      });
    }
    if (creditSummary.minor > MAX_CREDITS.minor) {
      alerts.push({
        type: 'warning',
        message: `Minor credits (${creditSummary.minor}) exceed recommended limit (${MAX_CREDITS.minor}).`,
      });
    }
    if (creditSummary.elective > MAX_CREDITS.elective) {
      alerts.push({
        type: 'warning',
        message: `Free elective credits (${creditSummary.elective}) exceed recommended limit (${MAX_CREDITS.elective}).`,
      });
    }
    return alerts;
  };

  const alerts = getAlerts();

  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
      const fetchTranslations = async () => {
        const t = await loadTranslations(locale);
        setTranslations(t);
      };
      fetchTranslations();
    }, [locale]);
  

  const handleRegister = () => {
    onRegister();
    toast({
      title: "Registration Successful!",
      description: "You have successfully registered for the selected courses.",
      variant: "default",
      action: <CheckCircle className="text-green-500" />,
    });
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-primary">
          <ShoppingCart className="mr-2 h-6 w-6" /> {translations.regcart}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedCourses.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {translations.empcart}
          </p>
        ) : (
          <>
            <ScrollArea className="h-[200px] pr-4 mb-4">
              <ul className="space-y-2">
                {selectedCourses.map(course => (
                  <li
                    key={course.id}
                    className="flex justify-between items-center p-2 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        {course.name} ({course.code})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.credits} credits — {course.schedule}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCourse(course.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Separator className="my-4" />
            <div>
              <h4 className="font-semibold mb-2 text-lg">Credit Summary:</h4>
              <div className="space-y-1 text-sm">
                <p>
                  Major Specific:{' '}
                  <span className="font-bold">{creditSummary.major}</span> /{' '}
                  {MAX_CREDITS.major}
                </p>
                <p>
                  Minor Courses:{' '}
                  <span className="font-bold">{creditSummary.minor}</span> /{' '}
                  {MAX_CREDITS.minor}
                </p>
                <p>
                  Free Electives:{' '}
                  <span className="font-bold">{creditSummary.elective}</span> /{' '}
                  {MAX_CREDITS.elective}
                </p>
                <Separator className="my-2" />
                <p className="text-base font-bold">
                  Total Credits:{' '}
                  <span className="text-primary">{creditSummary.total}</span> /{' '}
                  {MAX_CREDITS.total}
                </p>
              </div>
            </div>
            {alerts.length > 0 && (
              <div className="mt-4 space-y-2">
                {alerts.map((alert, idx) => (
                  <Alert
                    key={idx}
                    variant={alert.type === 'error' ? 'destructive' : 'default'}
                    className={
                      alert.type === 'warning'
                        ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200'
                        : ''
                    }
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {alert.type === 'error' ? 'Error' : 'Warning'}
                    </AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={
                selectedCourses.length === 0 || alerts.some(a => a.type === 'error')
              }
            >
              Register Selected Courses
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to register for {selectedCourses.length} course
                {selectedCourses.length > 1 ? 's' : ''} totaling{' '}
                {creditSummary.total} credits. Do you want to proceed?
                {conflicts.length > 0 && (
                  <span className="mt-3 text-sm text-yellow-700">
                    <br/>⚠️ <strong>Schedule conflicts:</strong>{' '}
                    {conflicts
                      .map(([a, b]) => `${a.code} & ${b.code}`)
                      .join('; ')}
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRegister}
                className="bg-accent hover:bg-accent/80 text-accent-foreground"
              >
                Confirm & Register
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
