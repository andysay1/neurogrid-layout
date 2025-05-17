import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import './styles.css';

export const NeuroGrid = ({ children }: { children: ReactNode }) => {
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const blocks = Array.from(gridRef.current.querySelectorAll('.neuro-block')) as HTMLElement[];

        const autoAssignSize = () => {
            blocks.forEach((block) => {
                const height = block.scrollHeight;
                const miniCount = block.querySelectorAll('.mini').length;
                const weight = height + miniCount * 50;
                if (!block.hasAttribute('data-size-manual')) {
                    if (weight > 500) block.dataset.size = 'full';
                    else if (weight > 300) block.dataset.size = 'wide';
                    else block.removeAttribute('data-size');
                }
            });
        };

        const spanOf = (el: HTMLElement, cols: number) => (el.dataset.size === 'full' ? cols : el.dataset.size === 'wide' ? Math.min(2, cols) : 1);

        const fillGapsEverywhere = () => {
            let cols = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
            blocks.forEach((b) => (b.style.gridColumn = ''));

            let used = 0;
            for (let i = 0; i < blocks.length; i++) {
                const span = spanOf(blocks[i], cols);
                if (used + span > cols) {
                    const leftover = cols - used;
                    const prev = blocks[i - 1];
                    if (prev) {
                        prev.style.gridColumn = `span ${spanOf(prev, cols) + leftover}`;
                    }
                    used = 0;
                }
                used = (used + span) % cols;
            }

            if (used) {
                const leftover = cols - used;
                const last = blocks.at(-1);
                if (last) last.style.gridColumn = `span ${spanOf(last, cols) + leftover}`;
            }
        };

        const fixOrphanLastBlock = () => {
            let cols = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
            let used = 0;
            for (let i = 0; i < blocks.length; i++) {
                used = (used + spanOf(blocks[i], cols)) % cols;
            }
            if (cols === 1 || used === 0) return;
            const leftover = cols - used;
            const last = blocks.at(-1);
            if (last) last.style.gridColumn = `span ${spanOf(last, cols) + leftover}`;
        };

        const recalc = () => {
            blocks.forEach((b) => {
                b.style.gridColumn = '';
                b.removeAttribute('data-force-row');
            });
            autoAssignSize();
            fixOrphanLastBlock();
            fillGapsEverywhere();
        };

        recalc();
        window.addEventListener('resize', () => requestAnimationFrame(recalc));
        return () => window.removeEventListener('resize', () => requestAnimationFrame(recalc));
    }, []);

    return (
        <div className='neuro-grid' ref={gridRef}>
            {children}
        </div>
    );
};
