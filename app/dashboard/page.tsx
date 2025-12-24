import { redirect } from 'next/navigation';
import { getUserOrganizations } from '@/app/actions/org';

export default async function DashboardRedirectPage() {
    const orgs = await getUserOrganizations();

    if (orgs && orgs.length > 0) {
        // Redirect to the first/active organization
        // We could check for 'isActive' from session if available, 
        // but getUserOrganizations returns a list.
        // Let's defer to the first one or the "active" one if marked.
        const activeOrg = orgs.find((o: any) => o.isActive) || orgs[0];
        redirect(`/${activeOrg.id}`);
    } else {
        // No orgs, maybe redirect to onboarding or create org?
        // Or stay here and show empty state?
        // Let's assume we redirect to a create page or onboard.
        // For now, let's redirect to /onboarding if it exists, or just show a text.
        // Actually, if no orgs, sidebar might be empty.
        // Let's redirect to /onboarding (assuming we will make one) or handle it.
        // Creating an Org is usually done via modal.
        // Let's redirect to `/create-organization` or just return a simple page.
        // Return null for now or a message.
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>No organizations found.</p>
                {/* We could render OrgSwitcherDialog here if we made it standalone */}
                <a href="/?create=true" className="text-primary underline">Go Home to Create</a>
            </div>
        );
    }
}
