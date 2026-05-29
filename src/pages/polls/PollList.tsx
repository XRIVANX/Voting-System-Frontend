// File: src/pages/polls/PollList.tsx

import { useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { showConfirmation } from '../../helpers/swalHelpers';
import { type Poll, type TabType, type OptionPayload, formatForDateTimeInput } from '../../features/poll/poll';
import { usePolls, usePollMutations } from '../../features/poll/hooks/usePollQueries';

import PollTabs from '../../features/poll/PollTabs';
import PollTable from '../../features/poll/PollTable';
import Pagination from '../../components/navigation/Pagination';

const DEFAULT_OPTIONS: OptionPayload[] = [
    { value: '', image: null },
    { value: '', image: null },
];

export default function PollList() {
    const titleInputRef = useRef<HTMLInputElement>(null);

    // --- UI State ---
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('form');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- Form States ---
    const [editingPollId, setEditingPollId] = useState<string | null>(null);
    const [pollTitle, setPollTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pollStatus, setPollStatus] = useState('open');
    const [errorMessage, setErrorMessage] = useState('');

    // --- Options State ---
    const [options, setOptions] = useState<OptionPayload[]>(DEFAULT_OPTIONS);

    // --- Filter States ---
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortFilter, setSortFilter] = useState('newest');

    // --- TanStack Query ---
    const { data: polls = [], isLoading } = usePolls();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        bulkStatusMutation,
        bulkDeleteMutation
    } = usePollMutations();

    // --- Filter Handlers ---
    const handleSearchChange = (val: string) => { setSearchText(val); setCurrentPage(1); };
    const handleStatusFilterChange = (val: string) => { setStatusFilter(val); setCurrentPage(1); };
    const handleSortFilterChange = (val: string) => { setSortFilter(val); setCurrentPage(1); };

    // --- Form Helpers ---
    const handleClearForm = () => {
        setEditingPollId(null);
        setPollTitle('');
        setStartDate('');
        setEndDate('');
        setPollStatus('open');
        setErrorMessage('');
        setOptions(DEFAULT_OPTIONS);
    };

    const handleEditClick = (poll: Poll) => {
        setEditingPollId(poll.id);
        setPollTitle(poll.title);
        setStartDate(formatForDateTimeInput(poll.start_time));
        setEndDate(formatForDateTimeInput(poll.end_time));
        setPollStatus(poll.status);
        setActiveTab('form');
        setIsPanelOpen(true);

        // Pre-fill options from the poll — images can't be pre-filled (files only go one way)
        if (poll.options && poll.options.length > 0) {
            setOptions(poll.options.map(opt => ({ value: opt.value, image: null })));
        } else {
            setOptions(DEFAULT_OPTIONS);
        }

        setTimeout(() => {
            titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            titleInputRef.current?.focus();
        }, 100);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleMutationError = (error: unknown, fallback: string) => {
        if (axios.isAxiosError(error)) {
            setErrorMessage(error.response?.data?.message || fallback);
        } else {
            setErrorMessage(fallback);
        }
    };

    // --- Validate options before submitting ---
    const validateOptions = (): boolean => {
        const filled = options.filter(o => o.value.trim() !== '');
        if (filled.length < 2) {
            setErrorMessage('Please provide at least 2 option labels.');
            return false;
        }
        return true;
    };

    // --- Mutation Handlers ---
    const handleCreatePoll = () => {
        setErrorMessage('');
        if (!pollTitle.trim()) return setErrorMessage('Please provide a poll title.');
        if (!validateOptions()) return;

        createMutation.mutate({
            title: pollTitle,
            start_time: startDate || null,
            end_time: endDate || null,
            status: pollStatus,
            options: options.filter(o => o.value.trim() !== ''),
        }, {
            onSuccess: handleClearForm,
            onError: (err) => handleMutationError(err, 'Failed to create poll.')
        });
    };

    const handleUpdatePoll = () => {
        if (!editingPollId) return;
        setErrorMessage('');
        if (!pollTitle.trim()) return setErrorMessage('Please provide a poll title.');
        if (!validateOptions()) return;

        updateMutation.mutate({
            id: editingPollId,
            payload: {
                title: pollTitle,
                start_time: startDate || null,
                end_time: endDate || null,
                status: pollStatus,
                options: options.filter(o => o.value.trim() !== ''),
            }
        }, {
            onSuccess: handleClearForm,
            onError: (err) => handleMutationError(err, 'Failed to update poll.')
        });
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await showConfirmation(
            'Delete Poll',
            'Are you sure? This action cannot be undone.',
            false, 'warning', 'Yes, delete it'
        );
        if (!isConfirmed) return;

        deleteMutation.mutate(id, {
            onSuccess: () => {
                if (editingPollId === id) handleClearForm();
                if (paginatedPolls.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
            }
        });
    };

    const handleBulkStatusChange = (status: 'open' | 'closed') => {
        bulkStatusMutation.mutate({ ids: selectedIds, status }, {
            onSuccess: () => setSelectedIds([])
        });
    };

    const handleBulkDelete = async () => {
        const isConfirmed = await showConfirmation(
            'Delete Multiple',
            `Delete ${selectedIds.length} polls?`,
            false, 'warning', 'Yes, delete them'
        );
        if (!isConfirmed) return;

        bulkDeleteMutation.mutate(selectedIds, {
            onSuccess: () => {
                if (selectedIds.includes(editingPollId || '')) handleClearForm();
                setSelectedIds([]);
                setCurrentPage(1);
            }
        });
    };

    // --- Filtering and Sorting ---
    const filteredPolls = useMemo(() => {
        return polls
            .filter((poll) => {
                const matchesSearch =
                    poll.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    poll.id.toLowerCase().includes(searchText.toLowerCase());
                const matchesStatus = statusFilter === 'all' || poll.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                const dateA = a.start_time ? new Date(a.start_time).getTime() : 0;
                const dateB = b.start_time ? new Date(b.start_time).getTime() : 0;
                return sortFilter === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [polls, searchText, statusFilter, sortFilter]);

    const totalPages = Math.ceil(filteredPolls.length / itemsPerPage);
    const paginatedPolls = filteredPolls.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-page">
            <PollTabs
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}

                editingPollId={editingPollId}
                pollTitle={pollTitle}
                setPollTitle={setPollTitle}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                pollStatus={pollStatus}
                setPollStatus={setPollStatus}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                handleClearForm={handleClearForm}
                handleCreatePoll={handleCreatePoll}
                handleUpdatePoll={handleUpdatePoll}
                titleInputRef={titleInputRef}
                isSubmitting={createMutation.isPending || updateMutation.isPending}

                options={options}
                setOptions={setOptions}

                searchText={searchText}
                setSearchText={handleSearchChange}
                statusFilter={statusFilter}
                setStatusFilter={handleStatusFilterChange}
                sortFilter={sortFilter}
                setSortFilter={handleSortFilterChange}

                selectedIds={selectedIds}
                handleBulkStatusChange={handleBulkStatusChange}
                handleBulkDelete={handleBulkDelete}
            />

            <div>
                <PollTable
                    isLoading={isLoading}
                    filteredPolls={paginatedPolls}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    toggleSelect={toggleSelect}
                    handleEditClick={handleEditClick}
                    handleDelete={handleDelete}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}