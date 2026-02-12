/**
 * Spinner - Studio wrapper
 * Migrated to @kingly/ui canonical component
 * @see packages/ui/src/components/migrations/spinner-conflict.tsx
 */
import { SpinnerCandidate, type SpinnerConflictProps } from '@kingly/ui/components';

export type SpinnerProps = SpinnerConflictProps;

export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
    return <SpinnerCandidate size={size} label={label} className={className} />;
}

export default Spinner;
