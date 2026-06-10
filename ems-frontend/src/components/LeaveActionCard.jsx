// src/components/LeaveActionCard.jsx
import React, { useState } from 'react';

export function LeaveActionCard({ onWorkflowProcessed }) {
    const [leaveId, setLeaveId] = useState('2'); // Pre-filled with standard seed ID 2 (Neha's Pending Fever Leave)
    const [actionStatus, setActionStatus] = useState('Approved');
    const [remarks, setRemarks] = useState('Approved after verification of medical status.');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleWorkflowSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/leaves/approve-workflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leaveId: parseInt(leaveId),
                    approvedBy: 2, // Pre-authenticated as Manager 'Rahul Sharma' (ID 2)
                    actionStatus,
                    remarks
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to complete workflow transaction processing.');
            }

            setMessage(data.message);
            // Fire callback hook to trigger an instant update of dashboard analytical counts
            if (onWorkflowProcessed) onWorkflowProcessed();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Manager Workflow Decision Engine</h2>
            <p className="text-xs text-slate-500 mb-4">Executes an atomic backend ACID database transaction block (BEGIN → COMMIT → ROLLBACK)</p>

            <form onSubmit={handleWorkflowSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Target Leave Application ID</label>
                    <input 
                        type="number" 
                        value={leaveId} 
                        onChange={(e) => setLeaveId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Workflow Action Decision</label>
                    <select 
                        value={actionStatus} 
                        onChange={(e) => setActionStatus(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="Approved">Approve Request (Deducts Balance)</option>
                        <option value="Rejected">Reject Request (Logs History Only)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Manager Evaluation Remarks</label>
                    <textarea 
                        rows="2"
                        value={remarks} 
                        onChange={(e) => setRemarks(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Provide transaction audit justification..."
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors disabled:bg-gray-400"
                >
                    {loading ? 'Processing Cloud Transaction Engine...' : 'Commit Operational Decision'}
                </button>
            </form>

            {message && <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-md font-medium">✅ {message}</div>}
            {error && <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-md font-medium">❌ Transaction Rolled Back: {error}</div>}
        </div>
    );
}