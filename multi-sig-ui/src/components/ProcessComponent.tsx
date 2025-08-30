'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { TransactionCard } from './TransactionCard';
import { SubmitTransaction } from './SubmitTransaction';
import { MultisigBalance } from './MultisigBalance';
import { DepositTokens } from './DepositTokens';
import { AlertTriangle, FileText, Loader, RefreshCw } from 'lucide-react';

// Reusable button component
function ActionButton({
    onClick,
    variant = 'primary',
    children,
    className = ''
}: {
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    className?: string;
}) {
    const baseClasses = "px-4 py-2 rounded-lg transition-all flex items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = variant === 'primary'
        ? "bg-[#FBB701] text-black hover:bg-yellow-400"
        : "bg-transparent border border-[#FBB701]/50 text-[#FBB701] hover:bg-[#FBB701]/10";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses} ${className}`}
        >
            {children}
        </button>
    );
}

// Reusable state display component
function StateDisplay({
    icon,
    title,
    description,
    action
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="text-center py-12 bg-[#202020] border border-[#FBB701]/30 rounded-2xl p-6 mt-6">
            <div className="mb-4">
                {icon}
                <p className="text-lg font-semibold text-white mb-2">{title}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            {action}
        </div>
    );
}

export function ProcessComponent() {
    const { transactions, threshold, loading, error, refetch } = useTransactions();

    const renderTransactionsContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12 bg-[#202020] border border-[#FBB701]/30 rounded-2xl p-6 mt-6">
                    <div className="flex items-center space-x-3">
                        <Loader className="animate-spin w-6 h-6 text-[#FBB701]" />
                        <span className="text-gray-400">Loading transactions...</span>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <StateDisplay
                    icon={<AlertTriangle className="w-12 h-12 mx-auto mb-2 text-red-500" />}
                    title="Error loading transactions"
                    description={error}
                    action={<ActionButton onClick={refetch}><RefreshCw className="w-4 h-4 mr-2"/>Try Again</ActionButton>}
                />
            );
        }

        if (transactions.length === 0) {
            return (
                <StateDisplay
                    icon={<FileText className="w-16 h-16 mx-auto mb-4 text-blue-500" />}
                    title="No transactions found"
                    description="Submit your first transaction to get started."
                    action={<ActionButton onClick={refetch} variant="secondary"><RefreshCw className="w-4 h-4 mr-2"/>Refresh</ActionButton>}
                />
            );
        }

        return (
            <div className="bg-[#202020] border border-[#FBB701]/30 shadow-md shadow-gray-600 rounded-2xl p-6 mt-6 space-y-6">
                {/* Transactions Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#FBB701]">
                        Multisig Transactions ({transactions.length})
                    </h2>
                    <ActionButton
                        onClick={refetch}
                        variant="secondary"
                        className="flex items-center space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </ActionButton>
                </div>

                {/* Transactions List */}
                <div className="grid gap-6">
                    {transactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                            threshold={threshold}
                            onTransactionUpdated={refetch}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Top Row: Balance Display */}
            <MultisigBalance />

            {/* Middle Row: Deposit and Submit Transaction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepositTokens />
                <SubmitTransaction />
            </div>

            {/* Transactions Content - Depends on loading state */}
            {renderTransactionsContent()}
        </div>
    );
}