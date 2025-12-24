'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import connectToDatabase from '@/app/lib/db';
import { User, Organization, Project, OrgMembership, Task } from '@/app/models';
import { randomBytes } from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function loginAsDemo() {
    await connectToDatabase();

    // Generate unique demo identity
    const uniqueId = randomBytes(4).toString('hex');
    const timestamp = Date.now();
    const email = `demo-${timestamp}-${uniqueId}@startupos.com`;
    const password = `demo-${uniqueId}`; // Unique password, though not used for login

    const password_hash = await bcrypt.hash(password, 10);

    // 1. Create Unique Demo User
    const user = await User.create({
        name: 'Demo User',
        email,
        password_hash,
        role: 'member',
        avatar_url: 'https://github.com/shadcn.png',
        bio: 'Just exploring the platform.',
        title: 'Product Explorer'
    });

    // 2. Create Unique Demo Org
    const orgName = 'Acme Corp (Demo)';
    // Ensure slug is unique
    const slug = `acme-demo-${uniqueId}-${timestamp}`;

    const org = await Organization.create({
        name: orgName,
        slug,
        members: [user._id],
    });

    await OrgMembership.create({
        org_id: org._id,
        user_id: user._id,
        org_username: 'demouser',
        role: 'owner',
        tags: ['Explorer']
    });

    // 3. Create Demo Project
    const project = await Project.create({
        name: 'Product Launch',
        key: 'PRO',
        org_id: org._id,
        description: 'A sample project to demonstrate Startup OS capabilities.',
        task_count: 5 // We will seed 5 tasks
    });

    // 4. Seed Tasks
    // We use the imported Task model directly
    // Note: In a real app we might want to use the createTask action to trigger logs, 
    // but direct DB is faster and safer for sandbox seeding to avoid side effects.
    await Task.create([
        {
            title: 'Review Marketing Copy',
            description: 'Check the new landing page copy for consistency.',
            status: 'Todo',
            priority: 'High',
            type: 'Story',
            story_points: 3,
            project_id: project._id,
            order: 0,
            taskId: 'PRO-1',
            assignee: user._id
        },
        {
            title: 'Design System Update',
            description: 'Update the color palette to match the new brand guidelines.',
            status: 'In Progress',
            priority: 'Medium',
            type: 'Task',
            story_points: 5,
            project_id: project._id,
            order: 0,
            taskId: 'PRO-2',
            assignee: user._id
        },
        {
            title: 'Fix Navigation Bug on Mobile',
            description: 'Menu does not close when clicking a link.',
            status: 'Backlog',
            priority: 'High',
            type: 'Bug',
            story_points: 2,
            project_id: project._id,
            order: 0,
            taskId: 'PRO-3',
            tags: ['mobile', 'v2']
        },
        {
            title: 'Q4 Investor Deck',
            description: 'Prepare the slides for the board meeting.',
            status: 'Todo',
            priority: 'High',
            type: 'Epic',
            story_points: 13,
            project_id: project._id,
            order: 1,
            taskId: 'PRO-4'
        },
        {
            title: 'Update Dependecies',
            status: 'Done',
            priority: 'Low',
            type: 'Task',
            story_points: 1,
            project_id: project._id,
            order: 0,
            taskId: 'PRO-5'
        }
    ]);

    // 5. Create Session
    // Short expiry for demo sessions (e.g. 2 hours)
    const session = await new SignJWT({ userId: user._id.toString(), orgId: org._id.toString() })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(key);

    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires: new Date(Date.now() + 2 * 60 * 60 * 1000), httpOnly: true });

    redirect(`/${org._id.toString()}/dashboard`);
}
