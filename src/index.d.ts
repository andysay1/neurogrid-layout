declare module 'neurogrid-layout' {
    import * as React from 'react';

    export interface NeuroGridProps {
        children: React.ReactNode;
    }

    export const NeuroGrid: React.FC<NeuroGridProps>;
}
