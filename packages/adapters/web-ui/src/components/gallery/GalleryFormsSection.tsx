import React from 'react';
import {
    ToggleSwitch,
    Slider,
    MultiSelect,
    SearchInput,
    TextArea,
    PropertyGrid,
    SecretInput,
    WizardStep,
    ColorPicker,
    DatePicker,
    PinInput,
    Rating,
    RangeSlider,
    Knob,
    SegmentedControl,
    TagInput,
    EditableText,
    TransferList
} from '../index';

export const GalleryFormsSection = () => {
    return (
        <div className="app-grid">
            <div className="app-card">
                <div className="app-card-header">
                    <h3>ToggleSwitch</h3>
                    <p>Binary choices</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <ToggleSwitch id="t1" checked={true} onChange={() => { }} label="Notifications" />
                    <ToggleSwitch id="t2" checked={false} onChange={() => { }} label="Dark Mode" />
                    <ToggleSwitch id="t3" checked={false} onChange={() => { }} label="Disabled" disabled />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Slider</h3>
                    <p>Range selection</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <Slider id="s1" value={50} min={0} max={100} onChange={() => { }} label="Volume" unit="%" />
                    <Slider id="s2" value={75} min={0} max={100} step={25} onChange={() => { }} label="Snap Step" />
                </div>
            </div>

            <div className="app-card" style={{ zIndex: 10 }}>
                <div className="app-card-header">
                    <h3>MultiSelect</h3>
                    <p>Tag selection</p>
                </div>
                <div className="app-card-body">
                    <MultiSelect
                        options={[
                            { id: '1', label: 'React' },
                            { id: '2', label: 'TypeScript' },
                            { id: '3', label: 'CSS' },
                            { id: '4', label: 'Node.js' }
                        ]}
                        selectedIds={['1', '2']}
                        onChange={() => { }}
                        label="Tech Stack"
                    />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>TextArea & Search</h3>
                    <p>Text inputs</p>
                </div>
                <div className="app-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <SearchInput value="" onChange={() => { }} placeholder="Search documentation..." />
                        <TextArea
                            value="Initial content..."
                            onChange={() => { }}
                            label="Description"
                            maxLength={200}
                            rows={4}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <TextArea
                            value=""
                            onChange={() => { }}
                            label="Error State"
                            error="This field is required"
                            placeholder="Type something..."
                        />
                    </div>
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>PropertyGrid</h3>
                    <p>Object inspector</p>
                </div>
                <div className="app-card-body">
                    <PropertyGrid data={{
                        name: "Agent-007",
                        role: "Executon",
                        active: true,
                        timeout: 5000,
                        retryPolicy: "exponential"
                    }} onChange={() => { }} />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>SecretInput</h3>
                    <p>Masked credential input</p>
                </div>
                <div className="app-card-body">
                    <SecretInput placeholder="Enter API Key" />
                </div>
            </div>



            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>Advanced Inputs</h3>
                    <p>Color, Date, PIN, Rating</p>
                </div>
                <div className="app-card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                    <ColorPicker value="#20bf6b" onChange={() => { }} label="Theme Color" />
                    <DatePicker value={new Date()} onChange={() => { }} label="Start Date" />
                    <PinInput value="123" onChange={() => { }} label="2FA Code" length={4} />
                    <Rating value={4} onChange={() => { }} label="Feedback" />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Range & Controls</h3>
                    <p>Sliders & Knobs</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <RangeSlider min={0} max={100} value={[20, 80]} onChange={() => { }} label="Price Range" unit="$" />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingTop: 12 }}>
                        <Knob value={45} min={0} max={100} onChange={() => { }} label="Gain" />
                        <Knob value={75} min={0} max={100} onChange={() => { }} label="Reverb" />
                    </div>
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Tags & Segments</h3>
                    <p>Categorization & Modes</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <SegmentedControl
                        options={[
                            { id: 'all', label: 'All' },
                            { id: 'active', label: 'Active' },
                            { id: 'archived', label: 'Archived' }
                        ]}
                        value="active"
                        onChange={() => { }}
                        label="Filter Mode"
                    />
                    <TagInput
                        tags={['React', 'TypeScript', 'UI']}
                        onChange={() => { }}
                        label="Skills"
                    />
                    <EditableText value="Click to edit project name" onChange={() => { }} label="Project Name" />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>TransferList</h3>
                    <p>Bulk assignment</p>
                </div>
                <div className="app-card-body">
                    <TransferList
                        items={[
                            { id: '1', label: 'Admin Access' },
                            { id: '2', label: 'Read Only' },
                            { id: '3', label: 'Write Access' },
                            { id: '4', label: 'Delete' },
                            { id: '5', label: 'Audit Log' },
                            { id: '6', label: 'Billing' }
                        ]}
                        leftIds={['2', '4', '6']}
                        rightIds={['1', '3', '5']}
                        onChange={() => { }}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: '1 / -1' }}>
                <div className="app-card-header">
                    <h3>WizardStep</h3>
                    <p>Complex form flows</p>
                </div>
                <div className="app-card-body">
                    <WizardStep
                        title="Connect Database"
                        subtitle="Step 2: Authenticate"
                        currentStep={2}
                        totalSteps={4}
                        onBack={() => { }}
                        onNext={() => { }}
                    >
                        <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            Form Content Here...
                        </div>
                    </WizardStep>
                </div>
            </div>
        </div>
    );
};
