import type { Course, CreditSummary, ContactInfoProps, CourseType } from '@/lib/types';

export default function ContactInformation({ email, phone, office, hours }: ContactInfoProps) { 
    return (
        <div className="bg-card p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">Contact Us</h2>
        <p className="text-sm text-muted-foreground">
        Email: <a href={`mailto:${email}`} className="underline">{email}</a>
        </p>
        <p className="text-sm text-muted-foreground">Phone: {phone}</p>
        <p className="text-sm text-muted-foreground">Office: {office}</p>
        <p className="text-sm text-muted-foreground">Office Hours: {hours}</p>
        </div>
    );
};