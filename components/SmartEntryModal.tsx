import React, { useState } from 'react';
import { parseMemberFromText } from '../services/geminiService';
import { ParsedMemberData } from '../types';
import { Sparkles, Loader2, X } from 'lucide-react';

interface SmartEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataParsed: (data: ParsedMemberData) => void;
}

const SmartEntryModal: React.FC<SmartEntryModalProps> = ({ isOpen, onClose, onDataParsed }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const data = await parseMemberFromText(inputText);
      onDataParsed(data);
      onClose();
      setInputText('');
    } catch (err) {
      setError("Failed to process text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold text-lg">AI Smart Entry</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Describe the family member naturally. For example: <br/>
            <span className="italic text-gray-400">"John Doe, 45 years old, husband of Jane. He is diabetic."</span>
          </p>

          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-4"
            placeholder="Type details here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
          />

          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleProcess}
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Auto-Fill Form
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartEntryModal;