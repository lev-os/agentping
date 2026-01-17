import React from 'react';
import {
    CalendarView,
    WeeklySchedule,
    DailyAgenda,
    EventCard,
    YearHeatmap,
    ResourceView,
    DatePickerPro,
    TimeSlotPicker,
    CountdownWidget,
    TimezoneSlider,
    RecurringEventEditor
} from '../index';

export const GallerySchedulingSection = () => {
    return (
        <div className="app-grid">
            <div className="app-card" style={{ gridColumn: '1 / -1' }}>
                <div className="app-card-header">
                    <h3>CalendarView</h3>
                    <p>Monthly schedule</p>
                </div>
                <div className="app-card-body">
                    <CalendarView
                        initialDate={new Date(2026, 0, 1)}
                        events={[
                            { id: '1', date: '2026-01-15', title: 'Project Kickoff', type: 'info' },
                            { id: '2', date: '2026-01-20', title: 'Design Review', type: 'warning' },
                            { id: '3', date: '2026-01-25', title: 'Deployment', type: 'success' }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2', height: 650 }}>
                <div className="app-card-header">
                    <h3>WeeklySchedule</h3>
                    <p>Time grid view</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <WeeklySchedule
                        startDate={new Date()}
                        events={[
                            { id: '1', title: 'Standup', start: new Date(new Date().setHours(10, 0)), end: new Date(new Date().setHours(10, 30)), color: '#20bf6b' },
                            { id: '2', title: 'Deep Work', start: new Date(new Date().setHours(13, 0)), end: new Date(new Date().setHours(16, 0)), color: '#a55eea' }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>DailyAgenda</h3>
                    <p>Day overview</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <DailyAgenda
                        items={[
                            { id: '1', title: 'Breakfast', startTime: '08:00', endTime: '09:00', location: 'Kitchen' },
                            { id: '2', title: 'Team Sync', startTime: '10:00', endTime: '10:30', location: 'Zoom' },
                            { id: '3', title: 'Client Call', startTime: '14:00', endTime: '15:00', location: 'Meeting Room A', color: 'var(--accent-warning)' }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>EventCard & Heatmap</h3>
                    <p>Details & Density</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <EventCard
                        title="Product Launch"
                        time="10:00 AM - 11:30 AM"
                        date="Mon, Jan 20"
                        description="Final review before public release. All stakeholders must attend."
                        color="var(--accent-error)"
                        attendees={[
                            { id: '1', name: 'Alice', initials: 'AL' },
                            { id: '2', name: 'Bob', initials: 'BO' },
                            { id: '3', name: 'Charlie', initials: 'CH' }
                        ]}
                    />
                    <div style={{ flex: 1, minWidth: 300 }}>
                        <YearHeatmap
                            data={[
                                { date: '2026-01-01', value: 2 },
                                { date: '2026-01-05', value: 4 },
                                { date: '2026-01-12', value: 1 },
                                { date: '2026-02-14', value: 3 }
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>ResourceView</h3>
                    <p>Swimlanes</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <ResourceView
                        resources={[
                            { id: 'r1', name: 'Room A' },
                            { id: 'r2', name: 'Room B' },
                            { id: 'r3', name: 'Projector' }
                        ]}
                        events={[
                            { id: 'e1', resourceId: 'r1', start: 9, end: 11, title: 'Workshop' },
                            { id: 'e2', resourceId: 'r2', start: 10, end: 12, title: 'Interview', color: 'var(--accent-warning)' },
                            { id: 'e3', resourceId: 'r3', start: 14, end: 16, title: 'Movie Night' }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Interactive Inputs</h3>
                    <p>Specialized pickers</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <DatePickerPro label="Start Date" />
                    <DatePickerPro label="Date Range" range />
                    <TimeSlotPicker
                        slots={['09:00', '09:30', '10:00', '10:30', '11:00']}
                        selectedSlot="10:00"
                        onSelect={() => { }}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Utilities</h3>
                    <p>Time & Recurrence</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <CountdownWidget targetDate={new Date(new Date().getTime() + 1000000000)} title="Launch" />
                    <TimezoneSlider timezones={["UTC", "America/New_York", "Asia/Tokyo"]} />
                    <RecurringEventEditor />
                </div>
            </div>
        </div>
    );
};
