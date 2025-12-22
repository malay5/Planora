const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// --- Connect ---
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-os')
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error('DB Connection Error:', err));

// --- Schemas (Simplified for Script) ---
const UserSchema = new Schema({ name: String, email: String, password_hash: String });
const OrgSchema = new Schema({ name: String, slug: String, members: [Schema.Types.ObjectId] });
const ProjectSchema = new Schema({ name: String, key: String, org_id: Schema.Types.ObjectId });
const TaskSchema = new Schema({
    title: String, type: String, status: String, priority: String, order: Number,
    project_id: Schema.Types.ObjectId, assignee: Schema.Types.ObjectId, description: String
});
const CommentSchema = new Schema({
    task_id: Schema.Types.ObjectId, user_id: Schema.Types.ObjectId, content: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Organization = mongoose.models.Organization || mongoose.model('Organization', OrgSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

async function runSimulation() {
    try {
        console.log('--- Starting Multi-Persona Simulation ---');

        // 1. Setup Personas
        const password_hash = await bcrypt.hash('password123', 10);

        const createPersona = async (name, email) => {
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ name, email, password_hash });
                console.log(`Created Persona: ${name}`);
            } else {
                console.log(`Persona exists: ${name}`);
            }
            return user;
        };

        const sm = await createPersona('Sarah (Scrum Master)', 'sarah@sim.com');
        const ceo = await createPersona('Alex (CEO)', 'alex@sim.com');
        const cto = await createPersona('David (CTO)', 'david@sim.com');

        // 2. Organization Setup
        let org = await Organization.findOne({ slug: 'tech-innovators' });
        if (!org) {
            org = await Organization.create({
                name: 'Tech Innovators',
                slug: 'tech-innovators',
                members: [sm._id, ceo._id, cto._id]
            });
            console.log('Created Organization: Tech Innovators');
        }

        let project = await Project.findOne({ org_id: org._id, key: 'CORE' });
        if (!project) {
            project = await Project.create({ name: 'Core Platform', key: 'CORE', org_id: org._id });
            console.log('Created Project: Core Platform');
        }

        // 3. Planning (SM creates Epics)
        console.log('\n--- Phase: Planning ---');
        const epic1 = await Task.create({
            title: 'Q1 User Growth',
            type: 'Epic',
            status: 'Todo',
            priority: 'High',
            project_id: project._id,
            assignee: sm._id,
            description: 'Initiatives to double user base.'
        });
        console.log(`[SM] Created Epic: ${epic1.title}`);

        // 4. Refinement (CEO adds Stories)
        console.log('\n--- Phase: Refinement ---');
        const story1 = await Task.create({
            title: 'Viral Invite Loop',
            type: 'Story',
            status: 'Backlog',
            priority: 'High',
            project_id: project._id,
            assignee: ceo._id,
            description: 'Implement shareable invite links.'
        });
        console.log(`[CEO] Added Story to Backlog: ${story1.title}`);

        // 5. Execution (CTO moves to In Progress & Comments)
        console.log('\n--- Phase: Execution ---');
        story1.status = 'In Progress';
        story1.assignee = cto._id;
        await story1.save();
        console.log(`[CTO] Moved "${story1.title}" to In Progress`);

        await Comment.create({
            task_id: story1._id,
            user_id: cto._id,
            content: 'Started working on the token generation logic. Need decision on token expiry.'
        });
        console.log(`[CTO] Commented on "${story1.title}"`);

        // 6. Collaboration (CEO responds)
        await Comment.create({
            task_id: story1._id,
            user_id: ceo._id,
            content: '@David Let\'s set it to 48 hours for now.'
        });
        console.log(`[CEO] Responded on "${story1.title}"`);

        console.log('\n--- Simulation Complete ---');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

runSimulation();
