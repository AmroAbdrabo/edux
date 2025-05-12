import Header from '@/components/student-hub/Header';
import CourseSearchTab from '@/components/student-hub/CourseSearchTab';
import TranscriptEnrollmentTab from '@/components/student-hub/TranscriptEnrollmentTab';
import ProfileManagementTab from '@/components/student-hub/ProfileManagementTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ListChecks, UserCog } from 'lucide-react';

export default function StudentHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-0 sm:px-4 py-6">
        <Tabs defaultValue="course-search" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 mb-6 rounded-lg shadow-md bg-card">
            <TabsTrigger value="course-search" className="py-2.5 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md">
              <Search className="mr-2 h-5 w-5" /> Course Search & Registration
            </TabsTrigger>
            <TabsTrigger value="transcript-enrollment" className="py-2.5 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md">
              <ListChecks className="mr-2 h-5 w-5" /> Transcript & Enrollment
            </TabsTrigger>
            <TabsTrigger value="profile-management" className="py-2.5 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md">
              <UserCog className="mr-2 h-5 w-5" /> Profile Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="course-search">
            <CourseSearchTab />
          </TabsContent>
          <TabsContent value="transcript-enrollment">
            <TranscriptEnrollmentTab />
          </TabsContent>
          <TabsContent value="profile-management">
            <ProfileManagementTab />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center py-4 border-t text-muted-foreground text-sm">
        © {new Date().getFullYear()} Student Hub. All rights reserved.
      </footer>
    </div>
  );
}
