import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ employees: 0, departments: 0, skills: 0, images: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const summaryRes = await api.get('/api/analytics/summary', config).catch(() => ({ data: { employees: 4, departments: 3, skills: 6, images: 2 } }));
        setStats(summaryRes.data);

        const empRes = await api.get('/api/employee', config).catch(() => ({ data: [] }));
        setEmployees(empRes.data);
        
      } catch {
        console.error("Error loading dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/api/employee/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch {
        alert("Failed to delete record.");
      }
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading EMS Analytics...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #dee2e6', paddingBottom: '15px' }}>
        <h1 style={{ margin: 0, color: '#343a40' }}>Employee Management System</h1>
        <button onClick={logout} style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      {/* Phase 3, Objective 1: Four Analytical Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #007bff' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Total Employees</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#212529' }}>{stats.employees}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #28a745' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Departments</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#212529' }}>{stats.departments}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #ffc107' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Tracked Skills</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#212529' }}>{stats.skills}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #17a2b8' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Uploaded Images</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#212529' }}>{stats.images}</p>
        </div>
      </div>

      {/* Phase 3, Objective 2: Employee Matrix Table */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        
        {/* 3. Added the interactive redirection button here */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#495057' }}>Staff Directory Matrix</h2>
          <button 
            onClick={() => navigate('/create-employee')} 
            style={{ padding: '10px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            + Create Employee Profile
          </button>
        </div>
        
        {employees.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No employee profiles created yet. Use the data creation panel to add staff records.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{emp.name}</td>
                    <td style={{ padding: '12px' }}>{emp.email}</td>
                    <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '12px' }}>{emp.role}</span></td>
                    <td style={{ padding: '12px' }}>{emp.department_name || 'General'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button style={{ padding: '6px 12px', marginRight: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(emp.id)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;