/**
 * Polymorph Primitive Factories
 *
 * 12 universal components that render to any target (HTML, Pencil, React).
 */
import type { PolymorphPrimitive, PrimitiveKind } from './types.js';
/** Reset ID counter (useful for deterministic tests). */
export declare function resetIds(): void;
export declare function StatusDot(props: {
    status: 'online' | 'offline' | 'busy' | 'away';
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive;
export declare function Badge(props: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive;
export declare function Button(props: {
    text: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}): PolymorphPrimitive;
export declare function TextBlock(props: {
    content: string;
    variant?: 'heading' | 'body' | 'caption' | 'code';
    size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive;
export declare function InputField(props: {
    placeholder?: string;
    label?: string;
    type?: 'text' | 'number' | 'email' | 'password';
    value?: string;
    size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive;
export declare function ProgressBar(props: {
    value: number;
    max?: number;
    label?: string;
    variant?: 'default' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive;
export declare function CheckItem(props: {
    text: string;
    checked?: boolean;
    disabled?: boolean;
}): PolymorphPrimitive;
export declare function MetricValue(props: {
    label: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'flat';
    size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive;
export declare function ListItem(props: {
    text: string;
    secondary?: string;
    icon?: string;
    active?: boolean;
}): PolymorphPrimitive;
export declare function Card(props: {
    title?: string;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg';
    children?: PolymorphPrimitive[];
}): PolymorphPrimitive;
export declare function NavItem(props: {
    text: string;
    icon?: string;
    active?: boolean;
    badge?: string;
}): PolymorphPrimitive;
export declare function ActionBar(props: {
    actions: Array<{
        text: string;
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    }>;
    align?: 'left' | 'center' | 'right';
}): PolymorphPrimitive;
/** All primitive factories indexed by kind. */
export declare const PRIMITIVE_MAP: Record<PrimitiveKind, (...args: any[]) => PolymorphPrimitive>;
