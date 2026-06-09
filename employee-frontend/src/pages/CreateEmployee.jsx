import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateEmployee = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Controlled form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [departmentId, setDepartmentId] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [images, setImages] = useState([]);

  // Database dropdown state lists
  const [departments, setDepartments] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFormDropdowns = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch Master lookup lists
        const deptRes = await api.get('/api/master/departments', config).catch(() => ({ data: [{ id: 1, name: 'IT' }, { id: 2, name: 'HR' }] }));
        const skillsRes = await api.get('/api/master/skills', config).catch(() => ({ data: [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'SQL' }] }));
        
        setDepartments(deptRes.data);
        setSkillsList(skillsRes.data);
        if(deptRes.data.length > 0) setDepartmentId(deptRes.data[0].id);
      } catch (err) {
        console.error("Error loading master resource lists:", err);
      }
    };
    fetchFormDropdowns();
  }, [token]);

  const handleSkillChange = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files)); // Store actual multi-file array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      
      // Because we have arrays and files, we bundle them inside modern FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('department_id', departmentId);
      
      // Append multi-select values
      formData.append('skills', JSON.stringify(selectedSkills));

      // Append files
      images.forEach((file) => {
        formData.append('images', file);
      });

      await api.post('/api/employee', formData, config);
      navigate('/dashboard'); // Go straight back to directory overview on success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile matrix.");
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginTop: 0, color: '#343a40', borderBottom: '2px solid #f1f3f5', paddingBottom: '10px' }}>Register New Staff Record</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Corporate Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Default Access Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>System Role Assignment:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="employee">Regular Employee</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>

        {/* Deep relational resource mapping dropdown */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Assigned Core Department:</label>
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Multi-Select Competency Tags checkbox matrix */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Core Skills Competencies:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
            {skillsList.map(skill => (
              <label key={skill.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedSkills.includes(skill.id)} onChange={() => handleSkillChange(skill.id)} style={{ marginRight: '8px' }} />
                {skill.name}
              </label>
            ))}
          </div>
        </div>

        {/* Array File Dispatch Zone */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Upload Verification Profile Documents / Images:</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            Save Employee
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '12px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;