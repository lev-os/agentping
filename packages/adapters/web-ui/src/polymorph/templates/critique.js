/**
 * Critique Template — Document Reviewer
 *
 * Playground for reviewing, annotating, and providing feedback on documents.
 */
import * as P from '../primitives.js';
export const critiqueTemplate = {
    name: 'critique',
    description: 'Document reviewer — annotate, critique, and provide structured feedback',
    previewRenderer: (values) => {
        const topic = values.topic ?? 'Document Review';
        const primitives = [];
        // Review header
        primitives.push(P.Card({
            title: topic,
            subtitle: 'Structured feedback and annotations',
            children: [
                P.StatusDot({ status: 'busy', label: 'Review in progress' }),
                P.ProgressBar({ value: 60, label: 'Review Progress', variant: 'default' }),
            ],
        }));
        // Document sections
        primitives.push(P.Card({
            title: 'Sections',
            children: [
                P.ListItem({ text: 'Introduction', secondary: '2 comments', active: true }),
                P.ListItem({ text: 'Architecture Overview', secondary: '5 comments' }),
                P.ListItem({ text: 'API Design', secondary: '1 comment' }),
                P.ListItem({ text: 'Testing Strategy', secondary: 'No comments' }),
                P.ListItem({ text: 'Deployment Plan', secondary: '3 comments' }),
            ],
        }));
        // Current section review
        primitives.push(P.Card({
            title: 'Introduction — Review',
            children: [
                P.TextBlock({ content: '"The system architecture follows a microservices pattern with event-driven communication between services."', variant: 'code' }),
                P.TextBlock({ content: 'Feedback', variant: 'heading', size: 'sm' }),
                P.Badge({ text: 'Suggestion', variant: 'info' }),
                P.TextBlock({ content: 'Consider specifying which event bus technology is used (e.g., NATS, Kafka, Redis Streams).', variant: 'body' }),
                P.InputField({ label: 'Add Comment', placeholder: 'Type your feedback...' }),
            ],
        }));
        // Review checklist
        primitives.push(P.Card({
            title: 'Review Checklist',
            children: [
                P.CheckItem({ text: 'Technical accuracy verified', checked: true }),
                P.CheckItem({ text: 'Code examples compile', checked: true }),
                P.CheckItem({ text: 'Security implications documented', checked: false }),
                P.CheckItem({ text: 'Performance benchmarks included', checked: false }),
                P.CheckItem({ text: 'Edge cases covered', checked: false }),
            ],
        }));
        // Verdict
        primitives.push(P.Card({
            title: 'Verdict',
            children: [
                P.MetricValue({ label: 'Quality Score', value: '7.5', unit: '/10', trend: 'up' }),
                P.MetricValue({ label: 'Issues Found', value: '8', trend: 'down' }),
                P.ActionBar({
                    actions: [
                        { text: 'Request Changes', variant: 'secondary' },
                        { text: 'Approve', variant: 'primary' },
                    ],
                    align: 'right',
                }),
            ],
        }));
        return primitives;
    },
};
