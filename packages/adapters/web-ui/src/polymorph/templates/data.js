/**
 * Data Template — Query Builder / Data Explorer
 *
 * Interactive playground for data exploration with metrics, filters, and results.
 */
import * as P from '../primitives.js';
export const dataTemplate = {
    name: 'data',
    description: 'Query builder — data exploration with metrics, filters, and results',
    previewRenderer: (values) => {
        const topic = values.topic ?? 'Data Explorer';
        const primitives = [];
        // Header metrics
        primitives.push(P.Card({
            title: topic,
            subtitle: 'Real-time data overview',
            children: [
                P.MetricValue({ label: 'Total Records', value: '24.7k', trend: 'up' }),
                P.MetricValue({ label: 'Avg Response', value: '186', unit: 'ms', trend: 'down' }),
                P.MetricValue({ label: 'Error Rate', value: '0.3', unit: '%', trend: 'flat' }),
            ],
        }));
        // Filters
        primitives.push(P.Card({
            title: 'Filters',
            children: [
                P.InputField({ label: 'Search', placeholder: 'Filter by name, id, or tag...' }),
                P.InputField({ label: 'Date Range', placeholder: 'Last 7 days' }),
                P.CheckItem({ text: 'Include archived', checked: false }),
                P.CheckItem({ text: 'Active only', checked: true }),
                P.ActionBar({
                    actions: [
                        { text: 'Reset', variant: 'ghost' },
                        { text: 'Apply Filters', variant: 'primary' },
                    ],
                }),
            ],
        }));
        // Results
        primitives.push(P.Card({
            title: 'Results',
            subtitle: '247 records match',
            children: [
                P.ListItem({ text: 'agent-alpha-01', secondary: '12ms avg · 99.9% uptime', active: true }),
                P.ListItem({ text: 'agent-beta-02', secondary: '45ms avg · 98.2% uptime' }),
                P.ListItem({ text: 'agent-gamma-03', secondary: '28ms avg · 99.5% uptime' }),
                P.ListItem({ text: 'agent-delta-04', secondary: '67ms avg · 97.1% uptime' }),
            ],
        }));
        // Status
        primitives.push(P.Card({
            title: 'Pipeline Status',
            children: [
                P.ProgressBar({ value: 100, label: 'Ingestion', variant: 'success' }),
                P.ProgressBar({ value: 72, label: 'Processing', variant: 'default' }),
                P.ProgressBar({ value: 0, label: 'Export', variant: 'default' }),
                P.StatusDot({ status: 'online', label: 'Pipeline healthy' }),
            ],
        }));
        return primitives;
    },
};
