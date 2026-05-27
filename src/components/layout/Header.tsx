// src/components/layout/Header.tsx
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg)]">
            <h1 className="text-xl font-bold text-[var(--text-h)]">Voting Site</h1>
            <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                aria-label="Toggle dark mode"
            >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
        </header>
    );
}