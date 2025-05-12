'use client';

import { mockTranscript, mockEnrollment, mockStudentProfile } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TranscriptEnrollmentTab() {
  const { toast } = useToast();

  const handleDownload = (documentType: string) => {
    // Mock download functionality
    toast({
      title: `${documentType} Download Started`,
      description: `Your ${documentType.toLowerCase()} is being prepared for download.`,
    });
    console.log(`Downloading ${documentType}...`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Transcript Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary">
            <FileText className="mr-2 h-6 w-6" /> Academic Transcript
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-muted-foreground">Student: {mockStudentProfile.name} (ID: {mockStudentProfile.studentId})</p>
          <ScrollArea className="h-[300px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTranscript.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.courseCode}</TableCell>
                    <TableCell>{item.courseName}</TableCell>
                    <TableCell>{item.semesterTaken}</TableCell>
                    <TableCell>{item.grade}</TableCell>
                    <TableCell className="text-right">{item.creditsEarned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleDownload('Transcript')} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="mr-2 h-4 w-4" /> Download Transcript (PDF)
          </Button>
        </CardFooter>
      </Card>

      {/* Enrollment Confirmation Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary">
            <CheckSquare className="mr-2 h-6 w-6" /> Current Enrollment (Fall 2024)
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mb-2 text-muted-foreground">This confirms your enrollment for the current semester.</p>
          <ScrollArea className="h-[250px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEnrollment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.courseCode}</TableCell>
                    <TableCell>{item.courseName}</TableCell>
                    <TableCell>{item.instructor}</TableCell>
                    <TableCell>{item.schedule}</TableCell>
                    <TableCell className="text-right">{item.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleDownload('Enrollment Confirmation')} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="mr-2 h-4 w-4" /> Download Enrollment Confirmation (PDF)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
