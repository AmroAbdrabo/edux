import type { Course } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, BookOpen, Tag, Info, Clock, CreditCardIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CourseCardProps {
  course: Course;
  onAddCourse: (course: Course) => void;
  isRegistered: boolean;
}

export default function CourseCard({ course, onAddCourse, isRegistered }: CourseCardProps) {
  return (
    <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">{course.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{course.code} - {course.department}</CardDescription>
          </div>
          <Badge variant={course.type === 'major' ? 'default' : course.type === 'minor' ? 'secondary' : 'outline'} className="capitalize">
            {course.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm flex items-center"><BookOpen className="mr-2 h-4 w-4 text-accent" /> {course.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <p className="flex items-center"><CreditCardIcon className="mr-2 h-4 w-4 text-accent" /> Credits: {course.credits}</p>
          <p className="flex items-center"><Users className="mr-2 h-4 w-4 text-accent" /> Instructor: {course.instructor}</p>
          <p className="flex items-center"><Tag className="mr-2 h-4 w-4 text-accent" /> Semester: {course.semester}</p>
          <p className="flex items-center"><Clock className="mr-2 h-4 w-4 text-accent" /> Schedule: {course.schedule}</p>
          <p className="flex items-center text-destructive-foreground bg-destructive/80 p-1 rounded-sm"><Info className="mr-2 h-4 w-4" /> Registration Deadline: {format(new Date(course.deadline), 'PPP')}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddCourse(course)} disabled={isRegistered} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <CalendarDays className="mr-2 h-4 w-4" /> {isRegistered ? 'Already in Cart' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
