// File: src/features/poll/poll.ts

import { type LucideIcon } from 'lucide-react';

export type TabType = 'form' | 'filter' | 'action';

export interface TabConfig {
    id: TabType;
    label: string;
    icon: LucideIcon;
}

// Added this export to fix "Module has no exported member 'Option'"
export interface Option {
    id: number;
    poll_uuid: string;
    value: string;
    image_url: string | null;
    votes_count?: number;
}

export interface Poll {
    id: string;
    title: string;
    status: 'open' | 'closed';
    start_time: string | null;
    end_time: string | null;
    options?: Option[];
}

export const formatForDateTimeInput = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
};