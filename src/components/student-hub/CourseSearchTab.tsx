'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Course, CreditSummary, ContactInfoProps, CourseType } from '@/lib/types';
import { mockCourses } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import CourseCard from './CourseCard';
import RegistrationCart from './RegistrationCart';
import { loadTranslations } from '@/lib/i18n-client'; // Updated import path
import ContactInformation from './ContactInfo';
import CourseScheduleCalendar from './CourseScheduleCalendar'; // Added import
// Added Download icon to the import
import { Search, Filter, XCircle, CalendarClock, ChevronDown, ChevronUp, Download } from 'lucide-react';

const departments = [...new Set(mockCourses.map(course => course.department))].filter(Boolean);
const semesters = [...new Set(mockCourses.map(course => course.semester))].filter(Boolean);

const ALL_OPTIONS_VALUE = "__ALL__";

interface CourseSearchTabProps {
  locale: string;
}


export default function CourseSearchTab({ locale }: CourseSearchTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    instructor: '',
    courseCode: '',
  });
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isCourseListOpen, setIsCourseListOpen] = useState(false);
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
      const fetchTranslations = async () => {
        const t = await loadTranslations(locale);
        setTranslations(t);
      };
      fetchTranslations();
    }, [locale]);
  

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
    // In a real application, you would send selectedCourses to your backend API
    console.log("Registering courses:", selectedCourses);
    // alert(`Simulating registration for ${selectedCourses.length} courses.`);
    // Optionally clear cart after registration: setSelectedCourses([]);
  }, [selectedCourses]);

  const toggleCourseList = useCallback(() => {
    setIsCourseListOpen(prev => !prev);
  }, []);

  // --- Function to handle PDF Download ---
  // You might not need a separate function if using a simple <a> tag,
  // but it's here if you need more complex logic later (e.g., fetching PDF dynamically)
  const handleDownloadPdf = () => {
    // This function is technically not needed if using the <a> tag approach below,
    // but kept for potential future logic expansion.
    console.log('Initiating PDF download...');
    // The actual download is handled by the <a> tag's href and download attributes.
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
      <div className="lg:col-span-2 space-y-6">

        {/* Search and Filters */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center"><Search className="mr-2" /> {translations.courseSearch}</h2>
          {/* --- Grid layout for filter controls --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* --- Filter Inputs and Selects --- */}
            <Input
              placeholder={translations.filterKeywords}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-base"
            />
            <Input
              placeholder={translations.filterCode}
              value={filters.courseCode}
              onChange={(e) => handleFilterChange('courseCode', e.target.value)}
              className="text-base"
            />
            <Input
              placeholder={translations.filterInstructor}
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
                <SelectItem value={ALL_OPTIONS_VALUE}>{translations.allDepartments}</SelectItem>
                {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select
              value={filters.semester || ALL_OPTIONS_VALUE}
              onValueChange={(value) => handleFilterChange('semester', value)}
            >
              <SelectTrigger className="text-base"><SelectValue placeholder="Filter by Semester" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTIONS_VALUE}>{translations.allSemesters}</SelectItem>
                {semesters.map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}
              </SelectContent>
            </Select>
            {/* --- Clear Filters Button (spans 1 column on medium screens) --- */}
            <Button onClick={clearFilters} variant="outline" className="md:col-span-1 flex items-center justify-center text-base">
              <XCircle className="mr-2 h-4 w-4" /> {translations.clearFilter}
            </Button>

            {/* --- Wide Blue Download PDF Button (spans 2 columns on medium screens) --- */}
            {/* IMPORTANT: Replace '/path/to/your-course-catalog.pdf' with the actual URL or path to your PDF file */}
            <a
              href="/docs/micro_msc_sp.pdf" // <<-- UPDATE THIS PATH
              download="study_plan.pdf" // Optional: Suggests a filename to the browser
              className="md:col-span-2" // Make the link span 2 columns on medium+ screens
              onClick={handleDownloadPdf} // Optional: Use if you need JS logic before/during download
            >
              <Button
                variant="default" // Use the default variant (usually primary/blue in shadcn/ui)
                className="w-full flex items-center justify-center text-base" // Make button fill the link's width
              >
                <Download className="mr-2 h-4 w-4" />
                {translations.downloadStudyPlan}
              </Button>
            </a>
            {/* --- End Download Button --- */}
          </div>
        </div>

        {/* Course List - Collapsible */}
        <div className="bg-card p-6 rounded-lg shadow-md">
           <h2
            className="text-2xl font-semibold mb-4 text-primary flex items-center justify-between cursor-pointer"
            onClick={toggleCourseList}
           >
             <div className="flex items-center">
               <Filter className="mr-2" /> {translations.availableCourses} ({filteredCourses.length})
             </div>
             {isCourseListOpen ? <ChevronUp className="h-6 w-6 text-muted-foreground" /> : <ChevronDown className="h-6 w-6 text-muted-foreground" />}
           </h2>
           {isCourseListOpen && (
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
           )}
        </div>

        {/* Course Schedule Calendar */}
        <CourseScheduleCalendar courses={selectedCourses} locale={locale} />
      </div>

      {/* Right Sidebar: Registration Cart & Contact Info */}
      <div className="lg:col-span-1 space-y-6">
        <RegistrationCart
          selectedCourses={selectedCourses}
          onRemoveCourse={removeCourseFromCart}
          creditSummary={creditSummary}
          onRegister={handleRegister}
          locale={locale}
        />
         <ContactInformation
          email="hecmaster@unil.ch"
          phone="+41 21 123 45 67"
          office="NEF 205"
          hours="Monday, Tuesday: 9:00 AM - 13:00 PM"
        />
      </div>

    </div>
  );
}