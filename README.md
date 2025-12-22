# Startup OS (Updated)

A modern, collaborative task management platform designed for startups. Built with Next.js 14 and MongoDB, offering a streamlined experience for managing projects, tasks, and teams.

## 🚀 Features

### Core Task Management
- **Kanban Board**: Drag-and-drop interface for managing task status (Todo, In Progress, Review, Done).
- **Backlog Management**: Dedicated view for backlog items with "Move to Backlog" reasoning.
- **Rich Task Details**: Support for Story Points, Tags (parsed from description), and Priority levels.
- **Soft Delete**: Tasks are moved to a Trash bin and can be restored or permanently deleted.

### Collaboration & Teams
- **Multi-Organization**: Users can create and switch between multiple organizations.
- **Team Invitations**: Invite members via unique, secure links.
- **Mentions & Notifications**: Mention users with `@username` in descriptions to trigger notifications.
- **Action Logs**: Comprehensive audit trail of all activities (Task creation, updates, moves, deletions).
- **Activity Feed**: View history of actions within the organization.

### Technical Highlights
- **Authentication**: Custom session-based auth using secure HTTP-only cookies.
- **Database**: MongoDB with Mongoose for flexible data modeling.
- **UI/UX**: "Dark Luxury" aesthetic using Tailwind CSS and shadcn/ui components.
- **Performance**: Server Actions for mutation and Optimistic UI updates.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB
- **ORM**: Mongoose
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd updated_startup_os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
    Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/startup_os
   JWT_SECRET=your-super-secret-key-change-this
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   npx next dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🧪 Verification & Testing

The application includes features for verifying system integrity:
- **Action Logs**: Check `/dashboard/logs` to see backend events firing.
- **Trash**: Check `/dashboard/trash` to verify soft-delete mechanics.
- **Notifications**: Check `/dashboard/notifications` for mention alerts.
