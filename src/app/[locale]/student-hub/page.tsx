import type { Metadata } from 'next';
import Header from '@/components/student-hub/Header';
import CourseSearchTab from '@/components/student-hub/CourseSearchTab';
import TranscriptEnrollmentTab from '@/components/student-hub/TranscriptEnrollmentTab';
import ProfileManagementTab from '@/components/student-hub/ProfileManagementTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ListChecks, UserCog } from 'lucide-react';
import { getTranslator } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslator(params.locale);
  return {
    title: `${t('dashboardTitle', {}, {defaultValue: 'Dashboard'})} - ${t('studentHub')}`,
    description: t('dashboardDescription', {}, {defaultValue: 'Manage your courses, transcript, and profile.'}),
  };
}

export default async function StudentHubDashboardPage({ params }: { params: { locale: string } }) {
  const t = await getTranslator(params.locale);

  // For a more thorough localization, you would pass `t` or `params.locale` 
  // to child components like Header, CourseSearchTab, etc., if they contain text.
  // For this example, we are localizing texts directly on this page.

  return (
    <div className="min-h-screen flex flex-col bg-background relative"> {/* Added relative for LanguageSwitcher positioning */}
      {/* Pass locale or t to Header if it needs localization */}
      <Header /> 
      <main className="flex-grow container mx-auto px-0 sm:px-4 py-6">
        <Tabs defaultValue="course-search" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 mb-6 rounded-lg shadow-md bg-card">
            <TabsTrigger value="course-search" className="py-2.5 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md">
              <Search className="mr-2 h-5 w-5" /> {t('courseSearchRegistration', {}, {defaultValue: 'Course Search & Registration'})}
            </TabsTrigger>
            <TabsTrigger value="transcript-enrollment" className="py-2.5 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md">
              <ListChecks className="mr-2 h-5 w-5" /> {t('transcriptEnrollment', {}, {defaultValue: 'Transcript & Enrollment'})}
            </TabsTrigger>
            <TabsTrigger value="profile-management" className="py-2.5 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md">
              <UserCog className="mr-2 h-5 w-5" /> {t('profileManagement', {}, {defaultValue: 'Profile Management'})}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="course-search">
            {/* Pass locale or t to CourseSearchTab if it needs to be localized */}
            <CourseSearchTab /> 
          </TabsContent>
          <TabsContent value="transcript-enrollment">
            {/* Pass locale or t to TranscriptEnrollmentTab if it needs to be localized */}
            <TranscriptEnrollmentTab />
          </TabsContent>
          <TabsContent value="profile-management">
            {/* Pass locale or t to ProfileManagementTab if it needs to be localized */}
            <ProfileManagementTab />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center py-4 border-t text-muted-foreground text-sm">
        {t('copyright', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
