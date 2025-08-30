import { TransactionWithId } from '@/lib/contract';
import { ConfirmTransaction } from './ConfirmTransaction';
import { ExecuteTransaction } from './ExecuteTransaction';
import { CheckCircle, Clock, Hash } from 'lucide-react';

interface TransactionCardProps {
    transaction: TransactionWithId;
    threshold?: number;
    onTransactionUpdated?: () => void;
}

export function TransactionCard({ transaction, threshold = 2, onTransactionUpdated }: TransactionCardProps) {
    const { id, to, formattedAmount, executed, confirmations, status } = transaction;

    const isConfirmed = status === 'executed';
    const canExecute = !isConfirmed && Number(confirmations) >= threshold;

    const statusColor = isConfirmed ? 'bg-green-900/50 text-green-400' : canExecute ? 'bg-blue-900/50 text-blue-400' : 'bg-yellow-900/50 text-yellow-400';
    const borderColor = isConfirmed ? 'border-green-500/30' : canExecute ? 'border-blue-500/30' : 'border-yellow-500/30';

    return (
        <div className={`bg-[#2C2C2C] rounded-2xl border ${borderColor} p-6 shadow-lg hover:border-[#FBB701]/50 transition-all`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#202020] rounded-full flex items-center justify-center border border-gray-700">
                        <Hash className="text-[#FBB701]" size={20} />
                        <span className="text-white font-bold text-lg">{id + 1}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Transaction #{id + 1}</h3>
                        <p className="text-sm text-gray-400">
                            {isConfirmed ? 'Completed' : canExecute ? 'Ready to Execute' : 'Pending Confirmation'}
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {isConfirmed ? 'Executed' : canExecute ? 'Executable' : 'Pending'}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recipient</label>
                    <p className="text-sm font-mono bg-[#202020] p-2 mt-1 rounded-lg border border-gray-700 break-all text-gray-300">
                        {to}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</label>
                        <p className="text-xl font-bold text-white">
                            {parseFloat(formattedAmount).toLocaleString()} <span className="text-base font-medium text-gray-400">cCOP</span>
                        </p>
                    </div>

                    <div className='flex flex-col justify-center items-center'>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Confirmations</label>
                        <p className="text-xl font-bold text-white">
                            {confirmations.toString()} / {threshold}
                        </p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className={`
                                    h-2 rounded-full transition-all duration-500 ${
                                    confirmations && confirmations > 0 ? 'bg-[#1E8847]' : 'bg-gray-500'
                                }`}
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Number(confirmations.toString()) / threshold * 100
                                    )}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Status Footer */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    {isConfirmed ? (
                        <div className="flex items-center text-sm text-green-500">
                            <CheckCircle size={16} className="mr-2" />
                            Transaction successfully executed
                        </div>
                    ) : (
                        <div className="flex items-center text-sm text-yellow-500">
                            <Clock size={16} className="mr-2 animate-pulse" />
                            Waiting for {threshold - Number(confirmations)} more confirmation(s) to execute
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4">
                    {/* Confirm Transaction Component */}
                    {
                        !executed && !canExecute && (
                            <ConfirmTransaction
                                transactionId={id}
                                confirmations={confirmations}
                                threshold={threshold}
                                executed={executed}
                                onTransactionConfirmed={onTransactionUpdated}
                            />
                        )
                    }

                    {/* Execute Transaction Component */}
                    {
                        canExecute && (
                            <ExecuteTransaction
                                transactionId={id}
                                confirmations={confirmations}
                                threshold={threshold}
                                executed={executed}
                                onTransactionExecuted={onTransactionUpdated}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}