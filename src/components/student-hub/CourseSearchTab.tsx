'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Course, CreditSummary, CourseType } from '@/lib/types';
import { mockCourses } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import CourseCard from './CourseCard';
import RegistrationCart from './RegistrationCart';
import CourseScheduleCalendar from './CourseScheduleCalendar'; // Added import
import { Search, Filter, XCircle, CalendarClock } from 'lucide-react'; // Added CalendarClock

const departments = [...new Set(mockCourses.map(course => course.department))].filter(Boolean);
const semesters = [...new Set(mockCourses.map(course => course.semester))].filter(Boolean);

const ALL_OPTIONS_VALUE = "__ALL__"; 

export default function CourseSearchTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    instructor: '',
    courseCode: '',
  });
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => {
      const keywordMatch = searchTerm.toLowerCase() === '' || 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const departmentMatch = filters.department === '' || course.department === filters.department;
      const semesterMatch = filters.semester === '' || course.semester === filters.semester;
      const instructorMatch = filters.instructor === '' || course.instructor.toLowerCase().includes(filters.instructor.toLowerCase());
      const courseCodeMatch = filters.courseCode === '' || course.code.toLowerCase().includes(filters.courseCode.toLowerCase());

      return keywordMatch && departmentMatch && semesterMatch && instructorMatch && courseCodeMatch;
    });
  }, [searchTerm, filters]);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value === ALL_OPTIONS_VALUE ? '' : value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ department: '', semester: '', instructor: '', courseCode: ''});
  };

  const creditSummary = useMemo((): CreditSummary => {
    return selectedCourses.reduce((acc, course) => {
      acc.total += course.credits;
      acc[course.type] += course.credits;
      return acc;
    }, { total: 0, major: 0, minor: 0, elective: 0 });
  }, [selectedCourses]);

  const addCourseToCart = useCallback((course: Course) => {
    if (!selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(prev => [...prev, course]);
    }
  }, [selectedCourses]);

  const removeCourseFromCart = useCallback((courseId: string) => {
    setSelectedCourses(prev => prev.filter(course => course.id !== courseId));
  }, []);

  const handleRegister = useCallback(() => {
    console.log("Registering courses:", selectedCourses);
  }, [selectedCourses]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Search and Filters */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center"><Search className="mr-2" /> Course Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Search by keyword (name, description)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-base"
            />
            <Input
              placeholder="Filter by Course Code (e.g., CS101)"
              value={filters.courseCode}
              onChange={(e) => handleFilterChange('courseCode', e.target.value)}
              className="text-base"
            />
            <Input
              placeholder="Filter by Instructor Name"
              value={filters.instructor}
              onChange={(e) => handleFilterChange('instructor', e.target.value)}
              className="text-base"
            />
            <Select 
              value={filters.department || ALL_OPTIONS_VALUE} 
              onValueChange={(value) => handleFilterChange('department', value)}
            >
              <SelectTrigger className="text-base"><SelectValue placeholder="Filter by Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTIONS_VALUE}>All Departments</SelectItem>
                {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select 
              value={filters.semester || ALL_OPTIONS_VALUE} 
              onValueChange={(value) => handleFilterChange('semester', value)}
            >
              <SelectTrigger className="text-base"><SelectValue placeholder="Filter by Semester" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTIONS_VALUE}>All Semesters</SelectItem>
                {semesters.map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="outline" className="md:col-span-1 flex items-center justify-center text-base">
              <XCircle className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-card p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center"><Filter className="mr-2" /> Available Courses ({filteredCourses.length})</h2>
          <ScrollArea className="h-[600px] pr-3">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onAddCourse={addCourseToCart} 
                  isRegistered={!!selectedCourses.find(c => c.id === course.id)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">No courses match your criteria. Try adjusting your search or filters.</p>
            )}
          </ScrollArea>
        </div>
        
        {/* Course Schedule Calendar */}
        <CourseScheduleCalendar courses={selectedCourses} />
      </div>

      {/* Registration Cart */}
      <div className="lg:col-span-1">
        <RegistrationCart 
          selectedCourses={selectedCourses} 
          onRemoveCourse={removeCourseFromCart}
          creditSummary={creditSummary}
          onRegister={handleRegister}
        />
      </div>
    </div>
  );
}