import React, { useState, useEffect } from 'react';
import { FamilyMember, Gender, MaritalStatus, ParsedMemberData } from '../types';
import { Plus, Save, Wand2 } from 'lucide-react';
import SmartEntryModal from './SmartEntryModal';

interface MemberFormProps {
  onAddMember: (member: FamilyMember) => void;
  nextSerialNo: number;
}

const initialMemberState = (serialNo: number): Omit<FamilyMember, 'id'> => ({
  serialNo,
  name: '',
  parentSpouseName: '',
  relationWithHead: '',
  sex: Gender.MALE,
  age: 0,
  maritalStatus: MaritalStatus.SINGLE,
  healthProblems: 'None',
});

const MemberForm: React.FC<MemberFormProps> = ({ onAddMember, nextSerialNo }) => {
  const [formState, setFormState] = useState(initialMemberState(nextSerialNo));
  const [isSmartEntryOpen, setIsSmartEntryOpen] = useState(false);

  useEffect(() => {
    setFormState(prev => ({ ...prev, serialNo: nextSerialNo }));
  }, [nextSerialNo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'serialNo' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMember({
      ...formState,
      id: crypto.randomUUID(),
    });
    setFormState(initialMemberState(nextSerialNo + 1)); // Prepare for next entry
  };

  const handleSmartFill = (data: ParsedMemberData) => {
    setFormState(prev => ({
      ...prev,
      name: data.name || prev.name,
      parentSpouseName: data.parentSpouseName || prev.parentSpouseName,
      relationWithHead: data.relationWithHead || prev.relationWithHead,
      sex: data.sex || prev.sex,
      age: data.age || prev.age,
      maritalStatus: data.maritalStatus || prev.maritalStatus,
      healthProblems: data.healthProblems || prev.healthProblems,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          Add Family Member
        </h3>
        <button
          type="button"
          onClick={() => setIsSmartEntryOpen(true)}
          className="text-sm flex items-center gap-1.5 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition font-medium"
        >
          <Wand2 className="w-4 h-4" />
          AI Smart Fill
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Serial No - usually auto but editable */}
        <div className="col-span-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Serial No.</label>
          <input
            type="number"
            name="serialNo"
            required
            value={formState.serialNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Name */}
        <div className="col-span-1 lg:col-span-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Name of Member</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            value={formState.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Parent/Spouse Name */}
        <div className="col-span-1 lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Husband / Father Name</label>
          <input
            type="text"
            name="parentSpouseName"
            placeholder="Enter name"
            value={formState.parentSpouseName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Relation */}
        <div className="col-span-1 lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Relation w/ Head</label>
          <input
            type="text"
            name="relationWithHead"
            placeholder="e.g. Wife, Son, Head"
            value={formState.relationWithHead}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Age */}
        <div className="col-span-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
          <input
            type="number"
            name="age"
            min="0"
            max="120"
            value={formState.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Sex */}
        <div className="col-span-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Sex</label>
          <select
            name="sex"
            value={formState.sex}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.values(Gender).map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Marital Status */}
        <div className="col-span-1 lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Marital Status</label>
          <select
            name="maritalStatus"
            value={formState.maritalStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.values(MaritalStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Health */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Health Problems</label>
          <input
            type="text"
            name="healthProblems"
            placeholder="Describe any health issues or 'None'"
            value={formState.healthProblems}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end mt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </form>

      <SmartEntryModal 
        isOpen={isSmartEntryOpen} 
        onClose={() => setIsSmartEntryOpen(false)} 
        onDataParsed={handleSmartFill} 
      />
    </div>
  );
};

export default MemberForm;