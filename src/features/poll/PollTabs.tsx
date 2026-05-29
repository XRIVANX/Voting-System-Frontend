// File: src/features/poll/PollTabs.tsx

import { type RefObject } from 'react';
import {
    Plus, ChevronDown, ChevronUp, Filter, Lock, Unlock,
    Trash, CheckSquare, AlertCircle, Edit2, Loader2, ImagePlus, X
} from 'lucide-react';
import { Text } from '../../components/input/Text';
import { Select } from '../../components/input/Select';
import { SearchInput } from '../../components/input/SearchInput';
import { type TabType, type TabConfig, type OptionPayload } from './poll';

interface PollTabsProps {
    isPanelOpen: boolean;
    setIsPanelOpen: (v: boolean) => void;
    activeTab: TabType;
    setActiveTab: (v: TabType) => void;

    // Form States & Handlers
    editingPollId: string | null;
    pollTitle: string;
    setPollTitle: (v: string) => void;
    startDate: string;
    setStartDate: (v: string) => void;
    endDate: string;
    setEndDate: (v: string) => void;
    pollStatus: string;
    setPollStatus: (v: string) => void;
    errorMessage: string;
    setErrorMessage: (v: string) => void;
    handleClearForm: () => void;
    handleCreatePoll: () => void;
    handleUpdatePoll: () => void;

    // Options
    options: OptionPayload[];
    setOptions: (v: OptionPayload[]) => void;

    // Fix: Properly typed Ref
    titleInputRef: RefObject<HTMLInputElement | null>;

    // New: Mutation loading state
    isSubmitting: boolean;

    searchText: string;
    setSearchText: (v: string) => void;
    statusFilter: string;
    setStatusFilter: (v: string) => void;
    sortFilter: string;
    setSortFilter: (v: string) => void;

    // Action States & Handlers
    selectedIds: string[];
    handleBulkStatusChange: (status: 'open' | 'closed') => void;
    handleBulkDelete: () => void;
}

export default function PollTabs({
    isPanelOpen, setIsPanelOpen, activeTab, setActiveTab,
    editingPollId, pollTitle, setPollTitle, startDate, setStartDate, endDate, setEndDate,
    pollStatus, setPollStatus, errorMessage, setErrorMessage, handleClearForm,
    handleCreatePoll, handleUpdatePoll, titleInputRef, isSubmitting,
    options, setOptions,
    searchText, setSearchText, statusFilter, setStatusFilter, sortFilter, setSortFilter,
    selectedIds, handleBulkStatusChange, handleBulkDelete
}: PollTabsProps) {

    const tabs: TabConfig[] = [
        { id: 'form', label: editingPollId ? 'Edit' : 'Create', icon: editingPollId ? Edit2 : Plus },
        { id: 'filter', label: 'Filter', icon: Filter },
        { id: 'action', label: 'Actions', icon: CheckSquare },
    ];

    // Add a new blank option
    const addOption = () => {
        setOptions([...options, { value: '', image: null }]);
    };

    // Remove an option by index
    const removeOption = (index: number) => {
        if (options.length <= 2) return; // minimum 2 options
        setOptions(options.filter((_, i) => i !== index));
    };

    // Update an option's text value
    const updateOptionValue = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = { ...updated[index], value };
        setOptions(updated);
    };

    // Update an option's image file
    const updateOptionImage = (index: number, file: File | null) => {
        const updated = [...options];
        updated[index] = { ...updated[index], image: file };
        setOptions(updated);
    };

    // Remove just the image from an option
    const removeOptionImage = (index: number) => {
        const updated = [...options];
        updated[index] = { ...updated[index], image: null };
        setOptions(updated);
    };

    return (
        <section className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-color)] shadow-sm overflow-hidden transition-all duration-300">
            {/* Tab Headers */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-[var(--border-color)] bg-[var(--bg-main)]/30">
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsPanelOpen(true);
                            }}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                                activeTab === tab.id
                                    ? 'border-brand-600 text-brand-600'
                                    : 'border-transparent text-[var(--text-main)] opacity-50 hover:opacity-100'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="p-2 text-[var(--text-main)] hover:bg-[var(--bg-main)] rounded-xl transition-all"
                >
                    {isPanelOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Panel Content */}
            <div className={`transition-all duration-300 ${isPanelOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-8">

                    {/* FORM TAB */}
                    {activeTab === 'form' && (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-300">
                            {errorMessage && (
                                <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-sm font-bold animate-in fade-in zoom-in duration-200">
                                    <AlertCircle size={18} />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* Poll details row */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-4">
                                    <Text
                                        ref={titleInputRef}
                                        name="pollTitle"
                                        label="Poll Title"
                                        placeholder="e.g., Budget Approval 2026"
                                        value={pollTitle}
                                        onChange={(e) => {
                                            setPollTitle(e.target.value);
                                            if (errorMessage) setErrorMessage('');
                                        }}
                                        inputClassName={`w-full px-5 py-4 rounded-2xl bg-[var(--bg-main)] border focus:ring-brand-500/20 ${errorMessage && !pollTitle.trim() ? 'border-rose-500' : 'border-[var(--border-color)]'}`}
                                    />
                                </div>
                                <div>
                                    <Text
                                        type="datetime-local"
                                        name="startDate"
                                        label="Start Time"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        inputClassName="w-full px-5 py-4 rounded-2xl bg-[var(--bg-main)] border-[var(--border-color)] focus:ring-brand-500/20"
                                    />
                                </div>
                                <div>
                                    <Text
                                        type="datetime-local"
                                        name="endDate"
                                        label="End Time"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        inputClassName="w-full px-5 py-4 rounded-2xl bg-[var(--bg-main)] border-[var(--border-color)] focus:ring-brand-500/20"
                                    />
                                </div>
                                <div>
                                    <Select
                                        name="pollStatus"
                                        label={editingPollId ? 'Status' : 'Initial Status'}
                                        value={pollStatus}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPollStatus(e.target.value)}
                                        options={[
                                            { value: 'open', label: 'Open' },
                                            { value: 'closed', label: 'Closed' },
                                        ]}
                                        selectClassName="w-full pl-5 pr-12 py-4 rounded-2xl bg-[var(--bg-main)] border-[var(--border-color)] focus:ring-brand-500/20"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    {editingPollId && (
                                        <button
                                            onClick={handleClearForm}
                                            disabled={isSubmitting}
                                            className="w-1/3 bg-slate-500/10 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-500/20 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            CLEAR
                                        </button>
                                    )}
                                    <button
                                        onClick={editingPollId ? handleUpdatePoll : handleCreatePoll}
                                        disabled={isSubmitting}
                                        className={`${editingPollId ? 'w-2/3' : 'w-full'} flex items-center justify-center gap-2 bg-brand-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                <span>PROCESSING...</span>
                                            </>
                                        ) : (
                                            editingPollId ? 'EDIT' : 'INITIALIZE'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Options Section */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">
                                        Poll Options <span className="text-rose-500">*</span>
                                        <span className="ml-2 opacity-40 font-medium normal-case tracking-normal">min. 2</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl transition-all border border-brand-500/20"
                                    >
                                        <Plus size={12} /> Add Option
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {options.map((option, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl"
                                        >
                                            {/* Image preview / upload button */}
                                            <div className="flex-shrink-0">
                                                {option.image ? (
                                                    <div className="relative w-12 h-12">
                                                        <img
                                                            src={URL.createObjectURL(option.image)}
                                                            alt={`Option ${index + 1}`}
                                                            className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOptionImage(index)}
                                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-all"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="w-12 h-12 rounded-xl border-2 border-dashed border-[var(--border-color)] flex items-center justify-center cursor-pointer hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group">
                                                        <ImagePlus size={16} className="text-[var(--text-main)] opacity-40 group-hover:opacity-100 group-hover:text-brand-600 transition-all" />
                                                        <input
                                                            type="file"
                                                            accept="image/jpg,image/jpeg,image/png,image/webp,image/gif"
                                                            className="hidden"
                                                            onChange={(e) => updateOptionImage(index, e.target.files?.[0] ?? null)}
                                                        />
                                                    </label>
                                                )}
                                            </div>

                                            {/* Option label number */}
                                            <span className="text-xs font-black text-[var(--text-main)] opacity-30 w-5 text-center flex-shrink-0">
                                                {index + 1}
                                            </span>

                                            {/* Option text input */}
                                            <input
                                                type="text"
                                                value={option.value}
                                                onChange={(e) => updateOptionValue(index, e.target.value)}
                                                placeholder={`Option ${index + 1} label`}
                                                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                                            />

                                            {/* Remove option button */}
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                disabled={options.length <= 2}
                                                className="flex-shrink-0 p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                                title="Remove option"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FILTER TAB */}
                    {activeTab === 'filter' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="md:col-span-2">
                                <SearchInput
                                    value={searchText}
                                    onChange={setSearchText}
                                    label="Keyword Search"
                                    placeholder="Filter by title or ID..."
                                />
                            </div>
                            <div>
                                <Select
                                    name="status"
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                                    options={[
                                        { value: 'all', label: 'All Statuses' },
                                        { value: 'open', label: 'Open' },
                                        { value: 'closed', label: 'Closed' },
                                    ]}
                                    selectClassName="w-full pl-5 pr-12 py-4 rounded-2xl bg-[var(--bg-main)] border-[var(--border-color)] focus:ring-brand-500/20"
                                />
                            </div>
                            <div>
                                <Select
                                    name="sort"
                                    label="Sort By"
                                    value={sortFilter}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortFilter(e.target.value)}
                                    options={[
                                        { value: 'newest', label: 'Newest First' },
                                        { value: 'oldest', label: 'Oldest First' },
                                    ]}
                                    selectClassName="w-full pl-5 pr-12 py-4 rounded-2xl bg-[var(--bg-main)] border-[var(--border-color)] focus:ring-brand-500/20"
                                />
                            </div>
                        </div>
                    )}

                    {/* ACTION TAB */}
                    {activeTab === 'action' && (
                        <div className="flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-[var(--text-heading)]">
                                    {selectedIds.length > 0 ? `${selectedIds.length} Polls Selected` : 'No Selection'}
                                </h3>
                                <p className="text-sm text-[var(--text-main)] opacity-70">
                                    Perform bulk modifications on selected records.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkStatusChange('open')}
                                    disabled={!selectedIds.length || isSubmitting}
                                    className="flex items-center gap-2 px-6 py-4 bg-emerald-500/10 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white disabled:opacity-30 transition-all border border-emerald-500/20"
                                >
                                    <Unlock size={14} /> Open
                                </button>
                                <button
                                    onClick={() => handleBulkStatusChange('closed')}
                                    disabled={!selectedIds.length || isSubmitting}
                                    className="flex items-center gap-2 px-6 py-4 bg-amber-500/10 text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 hover:text-white disabled:opacity-30 transition-all border border-amber-500/20"
                                >
                                    <Lock size={14} /> Closed
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={!selectedIds.length || isSubmitting}
                                    className="flex items-center gap-2 px-6 py-4 bg-rose-500/10 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white disabled:opacity-30 transition-all border border-rose-500/20"
                                >
                                    <Trash size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}