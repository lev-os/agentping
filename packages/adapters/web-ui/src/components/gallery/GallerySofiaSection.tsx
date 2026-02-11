import { DashboardWidget } from '../sofia/dashboard/DashboardWidget';
import { LoadingStateProvider } from '../sofia/dashboard/LoadingStateProvider';
import { GlowOrb } from '../sofia/ui/GlowOrb';
import { ShimmerText } from '../sofia/ui/ShimmerText';
import { StatusDot } from '../sofia/ui/StatusDot';
import { Activity, Bell } from 'lucide-react';

export function GallerySofiaSection() {
    return (
        <LoadingStateProvider>
            <div className="space-y-8 p-4">
                <section>
                    <h3 className="text-xl font-bold mb-4 text-white">Sofia UI Primitives</h3>
                    <div className="flex gap-8 items-center bg-black/20 p-6 rounded-lg border border-white/10">
                         <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-400">Glow Orb</span>
                            <GlowOrb size="md" color="cyan" />
                        </div>
                         <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-400">Shimmer Text</span>
                            <ShimmerText>AI Processing Active...</ShimmerText>
                        </div>
                         <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-400">Status Dot</span>
                            <div className="flex gap-2">
                                <StatusDot status="online" />
                                <StatusDot status="busy" />
                                <StatusDot status="offline" />
                            </div>
                        </div>
                    </div>
                </section>

                 <section>
                    <h3 className="text-xl font-bold mb-4 text-white">Dashboard Widget</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DashboardWidget
                            widgetId="w1"
                            title="System Health"
                            subtitle="Real-time monitoring"
                            icon={Activity}
                            isStreaming={true}
                            headerActions={[{ id: 'details', icon: Activity, label: 'Details', onClick: () => {} }]}
                        >
                            <div className="p-4 text-center text-gray-400 bg-white/5 rounded">
                                Widget Content Area
                            </div>
                        </DashboardWidget>

                        <DashboardWidget
                            widgetId="w2"
                            title="Alerts"
                            icon={Bell}
                            error={new Error('Failed to load alerts')}
                            onRefresh={() => {}}
                        >
                             <div className="p-4">Content</div>
                        </DashboardWidget>
                    </div>
                </section>
            </div>
        </LoadingStateProvider>
    );
}
