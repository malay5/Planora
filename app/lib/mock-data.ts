export type Task = {
    id: string;
    title: string;
    status: 'Todo' | 'In Progress' | 'Done' | 'Blocked';
    priority: 'High' | 'Medium' | 'Low';
    assignee: 'Malay' | 'Yougesh';
    type: 'Epic' | 'Story' | 'Task';
};

export const MOCK_DATA = {
    organization: {
        name: "Startup Stealth Mode",
        members: [
            { name: "Malay", role: "Tech Lead" },
            { name: "Yougesh", role: "Ops Lead" }
        ]
    },
    metrics: [
        { label: "Investors Reached", value: 8, target: 20, unit: "VCs", trend: "up" },
        { label: "Runway", value: 12, target: 18, unit: "Months", trend: "down" },
        { label: "Active Designs", value: 5, target: 5, unit: "Figma", trend: "flat" },
    ],
    tasks: [
        // Legora Scraped Offerings
        { id: '1', title: 'Build Portal: Self-serve platform', status: 'In Progress', priority: 'High', assignee: 'Malay', type: 'EPIC' },
        { id: '2', title: 'Create Knowledge Hub (AI Search)', status: 'Todo', priority: 'Medium', assignee: 'Malay', type: 'STORY' },
        { id: '3', title: 'Develop Playbooks (Automation)', status: 'Todo', priority: 'Medium', assignee: 'Malay', type: 'STORY' },
        { id: '4', title: 'Implement Workflows', status: 'Blocked', priority: 'High', assignee: 'Malay', type: 'STORY' },
        { id: '5', title: 'Word Add-in Integration', status: 'Todo', priority: 'Low', assignee: 'Malay', type: 'TASK' },

        // Cluely-like Features
        { id: '6', title: 'Live Meeting Transcription', status: 'In Progress', priority: 'Critical', assignee: 'Malay', type: 'EPIC' },
        { id: '7', title: 'RAG Q&A Engine', status: 'Todo', priority: 'High', assignee: 'Malay', type: 'TASK' },

        // Startup Tasks
        { id: '8', title: 'Series A Preparation', status: 'Todo', priority: 'High', assignee: 'Yougesh', type: 'EPIC' },
        { id: '9', title: 'Investor Outreach (Target: 20)', status: 'In Progress', priority: 'High', assignee: 'Yougesh', type: 'TASK' },
        { id: '10', title: 'Social Media: Discord Community', status: 'Done', priority: 'Medium', assignee: 'Yougesh', type: 'TASK' },
        { id: '11', title: 'Social Media: LinkedIn Launch', status: 'In Progress', priority: 'Medium', assignee: 'Yougesh', type: 'TASK' },
    ]
};
