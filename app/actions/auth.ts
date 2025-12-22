'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import connectToDatabase from '@/app/lib/db';
import { User, Organization, Project, OrgMembership } from '@/app/models';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session.value, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function signup(prevState: any, formData: FormData) {
    await connectToDatabase();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'Missing required fields' };
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'User already exists' };
        }

        const password_hash = await bcrypt.hash(password, 10);

        // 1. Create User
        const user = await User.create({
            name,
            email,
            password_hash,
        });

        // 2. Create Default Organization
        const orgName = `${name}'s Org`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const org = await Organization.create({
            name: orgName,
            slug,
            members: [user._id],
        });

        // Create OrgMembership
        const orgUsername = name.replace(/\s+/g, '').toLowerCase(); // Default to trimmed name
        await (OrgMembership as any).create({
            org_id: org._id,
            user_id: user._id,
            org_username: orgUsername,
            role: 'owner'
        });

        // 3. Create Default Project
        await Project.create({
            name: 'Platform Launch',
            key: 'PLAT',
            org_id: org._id,
        });

        // 4. Create Session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        const session = await new SignJWT({ userId: user._id.toString(), orgId: org._id.toString() })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(key);

        const cookieStore = await cookies();
        cookieStore.set('session', session, { expires, httpOnly: true });

    } catch (error) {
        console.error('Signup error:', error);
        return { error: 'Failed to create account' };
    }

    redirect('/dashboard');
}

export async function login(prevState: any, formData: FormData) {
    await connectToDatabase();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { error: 'Invalid credentials' };
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return { error: 'Invalid credentials' };
        }

        // Find user's primary org (just pick the first one for now)
        const org = await Organization.findOne({ members: user._id });
        if (!org) {
            // Edge case: user has no org? Should verify this logic.
            // For now, if no org, maybe create one or just fail? 
            // We'll assume they have one created at signup.
            return { error: 'No organization found for user' };
        }

        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await new SignJWT({ userId: user._id.toString(), orgId: org._id.toString() })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(key);

        const cookieStore = await cookies();
        cookieStore.set('session', session, { expires, httpOnly: true });

    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Failed to login' };
    }

    redirect('/dashboard');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}
