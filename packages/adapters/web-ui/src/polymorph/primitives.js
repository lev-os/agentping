/**
 * Polymorph Primitive Factories
 *
 * 12 universal components that render to any target (HTML, Pencil, React).
 */
let counter = 0;
function uid(kind) {
    return `${kind}-${++counter}`;
}
/** Reset ID counter (useful for deterministic tests). */
export function resetIds() {
    counter = 0;
}
export function StatusDot(props) {
    return { kind: 'status-dot', id: uid('status-dot'), label: props.label, props };
}
export function Badge(props) {
    return { kind: 'badge', id: uid('badge'), label: props.text, props };
}
export function Button(props) {
    return { kind: 'button', id: uid('button'), label: props.text, props };
}
export function TextBlock(props) {
    return { kind: 'text-block', id: uid('text-block'), label: props.content, props };
}
export function InputField(props) {
    return { kind: 'input-field', id: uid('input-field'), label: props.label, props };
}
export function ProgressBar(props) {
    return { kind: 'progress-bar', id: uid('progress-bar'), label: props.label, props };
}
export function CheckItem(props) {
    return { kind: 'check-item', id: uid('check-item'), label: props.text, props };
}
export function MetricValue(props) {
    return { kind: 'metric-value', id: uid('metric-value'), label: props.label, props };
}
export function ListItem(props) {
    return { kind: 'list-item', id: uid('list-item'), label: props.text, props };
}
export function Card(props) {
    return {
        kind: 'card',
        id: uid('card'),
        label: props.title,
        props,
        children: props.children,
    };
}
export function NavItem(props) {
    return { kind: 'nav-item', id: uid('nav-item'), label: props.text, props };
}
export function ActionBar(props) {
    return {
        kind: 'action-bar',
        id: uid('action-bar'),
        props,
        children: props.actions.map((a) => Button({ text: a.text, variant: a.variant })),
    };
}
/** All primitive factories indexed by kind. */
export const PRIMITIVE_MAP = {
    'status-dot': StatusDot,
    badge: Badge,
    button: Button,
    'text-block': TextBlock,
    'input-field': InputField,
    'progress-bar': ProgressBar,
    'check-item': CheckItem,
    'metric-value': MetricValue,
    'list-item': ListItem,
    card: Card,
    'nav-item': NavItem,
    'action-bar': ActionBar,
};
