/**
 * Size presets for polymorph primitives.
 */
export declare const SIZES: {
    readonly sm: {
        readonly padding: 4;
        readonly fontSize: 12;
        readonly gap: 4;
        readonly radius: 4;
        readonly height: 24;
    };
    readonly md: {
        readonly padding: 8;
        readonly fontSize: 14;
        readonly gap: 8;
        readonly radius: 6;
        readonly height: 32;
    };
    readonly lg: {
        readonly padding: 12;
        readonly fontSize: 16;
        readonly gap: 12;
        readonly radius: 8;
        readonly height: 40;
    };
};
export type Size = keyof typeof SIZES;
