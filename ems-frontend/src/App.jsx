// src/App.jsx
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardMetrics } from './components/DashboardMetrics';
import { LeaveActionCard } from './components/LeaveActionCard';

function DashboardView() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState(null);

    // Encapsulate fetching logic so we can call it anytime data updates
    const loadDashboardMetricsData = () => {
        fetch('http://localhost:5000/api/leaves/dashboard')
            .then(res => {
                if (!res.ok) throw new Error("Failed to extract data matrix from server.");
                return res.json();
            })
            .then(data => setMetrics(data))
            .catch(err => setError(err.message));
    };

    useEffect(() => {
        loadDashboardMetricsData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-8 font-sans">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employee Leave Management System</h1>
                    <p className="text-sm text-slate-500 mt-1">Enterprise Analytics Operational Panel</p>
                </div>
                {user && (
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-sm text-gray-700 font-medium">
                            Logged in as: <strong className="text-slate-900 capitalize">{user.name} ({user.role})</strong>
                        </span>
                    </div>
                )}
            </header>

            {error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm">
                    ⚠️ Connection Interrupted: {error}
                </div>
            ) : (
                <>
                    <DashboardMetrics data={metrics} />
                    {/* Mounting our interactive business process transaction layout */}
                    <LeaveActionCard onWorkflowProcessed={loadDashboardMetricsData} />
                </>
            )}
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <DashboardView />
        </AuthProvider>
    );
}