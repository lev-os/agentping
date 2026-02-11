/**
 * React Catalog Renderer
 *
 * Converts polymorph primitives into catalog entries for the CanvasRenderer.
 */
/**
 * Flatten polymorph primitives into React catalog entries
 * that the CanvasRenderer can consume.
 */
export function renderToReact(primitives) {
    return primitives.map(toEntry);
}
function toEntry(p) {
    return {
        id: p.id,
        kind: p.kind,
        label: p.label,
        props: p.props,
        children: p.children?.map(toEntry),
    };
}
