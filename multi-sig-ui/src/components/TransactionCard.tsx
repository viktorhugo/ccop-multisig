import { FullIndexerTransaction } from '@/lib/contract';
import { ConfirmTransaction } from './ConfirmTransaction';
import { ExecuteTransaction } from './ExecuteTransaction';
import { CheckCircle, Clock, User, ArrowRight, Box, FileText } from 'lucide-react';
import { CopyToClipboard } from './CopyToClipboard';

interface TransactionCardProps {
    transaction: FullIndexerTransaction;
    threshold?: number;
    onTransactionUpdated?: () => void;
}

export function TransactionCard({ transaction, threshold = 2, onTransactionUpdated }: TransactionCardProps) {
    const { id, to, formattedAmount, executed, confirmations, status, owner, txHash, blockNumber } = transaction;

    const isConfirmed = status === 'executed';
    const canExecute = !isConfirmed && Number(confirmations) >= threshold;

    const statusColor = isConfirmed ? 'bg-green-900/50 text-green-400' : canExecute ? 'bg-blue-900/50 text-blue-400' : 'bg-yellow-900/50 text-yellow-400';
    const borderColor = isConfirmed ? 'border-green-500/30' : canExecute ? 'border-blue-500/30' : 'border-yellow-500/30';

    return (
        <div className={`bg-[#1E1E1E] rounded-2xl border ${borderColor} p-6 shadow-lg hover:border-[#FBB701]/50 transition-all`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2C2C2C] rounded-full flex items-center justify-center border border-gray-700">
                        <span className="text-white font-bold text-lg">{id}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Transaction #{id}</h3>
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
                <div className="flex items-center justify-between bg-[#2C2C2C] p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2">
                        <User size={18} className="text-blue-400" />
                        <span className="text-sm font-mono text-gray-300 break-all">{owner}</span>
                    </div>
                    <ArrowRight size={26} className="text-[#FBB701]" />
                    <div className="flex items-center gap-2">
                        <User size={18} className="text-blue-400" />
                        <span className="text-sm font-mono text-gray-300 break-all">{to}</span>
                    </div>
                    <CopyToClipboard text={to} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#2C2C2C] p-4 rounded-lg border border-gray-700">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</label>
                        <p className="text-2xl font-bold text-white mt-1">
                            {parseFloat(formattedAmount).toLocaleString()} <span className="text-lg font-medium text-gray-400">cCOP</span>
                        </p>
                    </div>

                    <div className="bg-[#2C2C2C] p-4 rounded-lg border border-gray-700">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Confirmations</label>
                        <div className="flex flex-col items-center gap-4 mt-1">
                            <p className="text-2xl font-bold text-white">
                                {confirmations.toString()} / {threshold}
                            </p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-[#FBB701] h-2.5 rounded-full"
                                    style={{ width: `${(Number(confirmations) / threshold) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-[#2C2C2C] p-3 rounded-lg border border-gray-700">
                        <FileText size={16} className="text-gray-400" />
                        <span className="font-semibold text-gray-400">Tx Hash:</span>
                        <span className="font-mono text-gray-300 truncate">{txHash}</span>
                        <CopyToClipboard text={txHash} />
                    </div>
                    <div className="flex items-center gap-2 bg-[#2C2C2C] p-3 rounded-lg border border-gray-700">
                        <Box size={16} className="text-gray-400" />
                        <span className="font-semibold text-gray-400">Block:</span>
                        <span className="font-mono text-gray-300">{blockNumber}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-center">
                    {isConfirmed ? (
                        <div className="flex items-center bg-[#2C2C2C] border border-gray-600 rounded-lg p-3">
                            <CheckCircle size={18} className="mr-2 text-green-400" />
                            <span className='text-md font-medium text-zinc-300'>Transaction successfully executed</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-sm text-yellow-400">
                            <Clock size={16} className="mr-2" />
                            {canExecute ? 'Ready for execution' : `Waiting for ${threshold - Number(confirmations)} more confirmation(s)`}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4">
                    {!executed && (
                        <ConfirmTransaction
                            transactionId={id}
                            confirmations={confirmations}
                            threshold={threshold}
                            executed={executed}
                            onTransactionConfirmed={onTransactionUpdated}
                        />
                    )}
                    {canExecute && (
                        <ExecuteTransaction
                            transactionId={id}
                            confirmations={confirmations}
                            threshold={threshold}
                            executed={executed}
                            onTransactionExecuted={onTransactionUpdated}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}