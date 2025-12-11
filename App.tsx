import React, { useState } from 'react';
import { FamilyMember } from './types';
import MemberForm from './components/MemberForm';
import MemberTable from './components/MemberTable';
import { generateFamilyHealthSummary } from './services/geminiService';
import { Activity, FileText, Users, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // Survey Details State
  const [headOfFamily, setHeadOfFamily] = useState('');
  const [address, setAddress] = useState('');
  const [surveyDate, setSurveyDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Members State
  const [members, setMembers] = useState<FamilyMember[]>([]);
  
  // AI Summary State
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleAddMember = (member: FamilyMember) => {
    setMembers([...members, member]);
    setSummary(null); // Invalidate old summary when data changes
  };

  const handleDeleteMember = (id: string) => {
    const updatedMembers = members.filter(m => m.id !== id);
    // Re-index serial numbers optionally, or keep them as is. 
    // Here we re-index for cleanliness.
    const reindexedMembers = updatedMembers.map((m, index) => ({
      ...m,
      serialNo: index + 1
    }));
    setMembers(reindexedMembers);
    setSummary(null);
  };

  const handleGenerateSummary = async () => {
    if (members.length === 0) return;
    setIsGeneratingSummary(true);
    try {
      const result = await generateFamilyHealthSummary(members);
      setSummary(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FamilyPulse Survey</h1>
        </div>
        <p className="text-gray-500">Comprehensive household health and demographic data collection.</p>
      </header>

      {/* Main Survey Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Head of Family</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={headOfFamily}
            onChange={(e) => setHeadOfFamily(e.target.value)}
            placeholder="Name of Head"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Household Address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Survey Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={surveyDate}
            onChange={(e) => setSurveyDate(e.target.value)}
          />
        </div>
      </div>

      {/* Member Entry Form */}
      <MemberForm 
        onAddMember={handleAddMember} 
        nextSerialNo={members.length + 1} 
      />

      {/* Member List Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            Family Members ({members.length})
          </h2>
        </div>
        <MemberTable members={members} onDelete={handleDeleteMember} />
      </div>

      {/* AI Health Summary Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Family Health Analysis
          </h2>
          <button
            onClick={handleGenerateSummary}
            disabled={members.length === 0 || isGeneratingSummary}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Summary'
            )}
          </button>
        </div>
        
        {summary ? (
          <div className="prose text-gray-700 text-sm bg-white p-4 rounded-lg shadow-sm border border-indigo-100 w-full max-w-none">
            {summary}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Add family members and click "Generate Summary" to get an AI-powered health overview of the household.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;