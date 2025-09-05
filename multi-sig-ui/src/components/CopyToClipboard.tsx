import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyToClipboardProps {
    text: string;
}

export function CopyToClipboard({ text }: CopyToClipboardProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="text-[#FBB701] hover:text-white transition-colors">
            {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
    );
}