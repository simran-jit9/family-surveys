import React from 'react';
import { FamilyMember } from '../types';
import { Trash2 } from 'lucide-react';

interface MemberTableProps {
  members: FamilyMember[];
  onDelete: (id: string) => void;
}

const MemberTable: React.FC<MemberTableProps> = ({ members, onDelete }) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">No family members added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Serial No.</th>
              <th className="px-6 py-3 whitespace-nowrap">Name</th>
              <th className="px-6 py-3 whitespace-nowrap">Husband/Father Name</th>
              <th className="px-6 py-3 whitespace-nowrap">Relation w/ Head</th>
              <th className="px-6 py-3 whitespace-nowrap">Sex</th>
              <th className="px-6 py-3 whitespace-nowrap">Age</th>
              <th className="px-6 py-3 whitespace-nowrap">Marital Status</th>
              <th className="px-6 py-3 min-w-[200px]">Health Problems</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{member.serialNo}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{member.name}</td>
                <td className="px-6 py-4">{member.parentSpouseName || '-'}</td>
                <td className="px-6 py-4">{member.relationWithHead}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.sex === 'Male' ? 'bg-blue-100 text-blue-700' : 
                    member.sex === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {member.sex}
                  </span>
                </td>
                <td className="px-6 py-4">{member.age}</td>
                <td className="px-6 py-4">{member.maritalStatus}</td>
                <td className="px-6 py-4">
                  {member.healthProblems && member.healthProblems.toLowerCase() !== 'none' ? (
                     <span className="text-red-600 font-medium">{member.healthProblems}</span>
                  ) : (
                    <span className="text-green-600">None</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(member.id)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;