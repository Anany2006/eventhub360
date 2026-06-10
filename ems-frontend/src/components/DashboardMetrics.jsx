// src/components/DashboardMetrics.jsx
import React from 'react';

const MetricCard = ({ label, value, styles }) => (
    <div className={`p-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md ${styles}`}>
        <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">{label}</h3>
        <p className="mt-2 text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
);

export const DashboardMetrics = ({ data }) => {
    if (!data) return <div className="text-gray-500 animate-pulse">Gathering live records...</div>;

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total Staff Workforce" value={data.total_employees} />
            <MetricCard label="Active Departments" value={data.total_departments} />
            <MetricCard label="Registered Specializations" value={data.total_skills} />
            <MetricCard label="Pending Action Reviews" value={data.pending_leaves} styles="border-l-4 border-l-amber-500" />
            <MetricCard label="Approved Clearances" value={data.approved_leaves} styles="border-l-4 border-l-emerald-500" />
            <MetricCard label="Rejected Requests" value={data.rejected_leaves} styles="border-l-4 border-l-rose-500" />
            <MetricCard label="Total Financial Compensation" value={`₹${Number(data.total_salary_expense).toLocaleString('en-IN')}`} styles="sm:col-span-2 lg:col-span-2 bg-slate-50" />
        </div>
    );
};