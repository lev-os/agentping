/**
 * Spinner - Web-UI wrapper
 * Migrated to @kingly/ui canonical component
 * @see packages/ui/src/components/migrations/spinner-conflict.tsx
 */
import { SpinnerCandidate, type SpinnerConflictProps } from '@kingly/ui/components';

export type SpinnerProps = SpinnerConflictProps;

export function Spinner(props: SpinnerProps) {
    return <SpinnerCandidate {...props} />;
}

export default Spinner;
