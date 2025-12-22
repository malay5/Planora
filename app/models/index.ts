import mongoose, { Schema, Document, Model } from 'mongoose';

// --- User Schema ---
export interface IUser extends Document {
    name: string;
    email: string;
    password_hash: string;
    role: string;
    avatar_url?: string;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: 'member' },
    avatar_url: { type: String },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// --- Organization Schema ---
export interface IOrganization extends Document {
    name: string;
    slug: string;
    members: mongoose.Types.ObjectId[];
}

const OrganizationSchema = new Schema<IOrganization>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Organization: Model<IOrganization> = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);

// --- Project Schema ---
export interface IProject extends Document {
    name: string;
    key: string;
    org_id: mongoose.Types.ObjectId;
    description?: string;
    task_count: number;
}

const ProjectSchema = new Schema<IProject>({
    name: { type: String, required: true },
    key: { type: String, required: true },
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    description: { type: String },
    task_count: { type: Number, default: 0 },
}, { timestamps: true });

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

// --- Task Schema ---
export interface ITask extends Document {
    title: string;
    description?: string;
    type: 'Epic' | 'Story' | 'Task' | 'Bug';
    status: string;
    priority: 'High' | 'Medium' | 'Low';
    assignee?: mongoose.Types.ObjectId;
    project_id: mongoose.Types.ObjectId;
    parent_id?: mongoose.Types.ObjectId;
    order: number;
    tags?: string[];
    sprint_id?: string;
    taskId: string;
    backlog_reason?: string;
    input_description?: string; // Raw input for re-parsing
    story_points?: number;
    deleted_at?: Date; // For soft delete
    mentions?: string[]; // Array of org_usernames
}

const TaskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String },
    input_description: { type: String },
    type: { type: String, enum: ['Epic', 'Story', 'Task', 'Bug'], default: 'Task' },
    status: { type: String, required: true, default: 'Todo' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    order: { type: Number, default: 0 },
    sprint_id: { type: String }, // Placeholder
    tags: { type: [String], default: [] },
    mentions: { type: [String], default: [] }, // Stores org_usernames
    backlog_reason: { type: String },
    taskId: { type: String }, // Readable ID e.g. "PLAT-123"
    story_points: { type: Number },
    deleted_at: { type: Date },
}, { timestamps: true });

export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

// --- Invitation Schema ---
export interface IInvitation extends Document {
    token: string;
    organization_id: mongoose.Types.ObjectId;
    inviter_id: mongoose.Types.ObjectId;
    email?: string; // Optional: if inviting a specific email
    status: 'pending' | 'accepted' | 'expired';
}

const InvitationSchema = new Schema<IInvitation>({
    token: { type: String, required: true, unique: true },
    organization_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    inviter_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
}, { timestamps: true });

export const Invitation: Model<IInvitation> = mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);

// --- Comment Schema ---
export interface IComment extends Document {
    task_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    content: string;
    mentions?: string[]; // Array of userIds or names
}

const CommentSchema = new Schema<IComment>({
    task_id: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    mentions: { type: [String], default: [] },
}, { timestamps: true });

export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

// --- OrgMembership Schema (Phase 5) ---
export interface IOrgMembership extends Document {
    org_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    org_username: string; // Unique within the org
    role: string;
    joined_at: Date;
}

const OrgMembershipSchema = new Schema<IOrgMembership>({
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    org_username: { type: String, required: true },
    role: { type: String, default: 'member' },
    joined_at: { type: Date, default: Date.now },
});

// Compound unique index to ensure usernames are unique per org
OrgMembershipSchema.index({ org_id: 1, org_username: 1 }, { unique: true });
// Compound unique index to ensure user is only in org once
OrgMembershipSchema.index({ org_id: 1, user_id: 1 }, { unique: true });

export const OrgMembership: Model<IOrgMembership> = mongoose.models.OrgMembership || mongoose.model<IOrgMembership>('OrgMembership', OrgMembershipSchema);

// --- ActionLog Schema (Phase 5) ---
export interface IActionLog extends Document {
    org_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    action: string;
    target_id?: mongoose.Types.ObjectId; // task_id, etc.
    target_type?: string;
    details?: string;
    timestamp: Date;
}

const ActionLogSchema = new Schema<IActionLog>({
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    target_id: { type: Schema.Types.ObjectId },
    target_type: { type: String },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
});

export const ActionLog: Model<IActionLog> = mongoose.models.ActionLog || mongoose.model<IActionLog>('ActionLog', ActionLogSchema);

// --- Notification Schema (Phase 5) ---
export interface INotification extends Document {
    user_id: mongoose.Types.ObjectId;
    org_id: mongoose.Types.ObjectId;
    type: string; // 'mention', 'assignment', 'system'
    content: string;
    link?: string;
    read: boolean;
    timestamp: Date;
}

const NotificationSchema = new Schema<INotification>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

export const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
