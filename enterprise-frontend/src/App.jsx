import { useState } from 'react';
import Dashboard from './components/Dashboard';
import GlobalSearch from './components/GlobalSearch';
import FormInput from './components/common/FormInput';
import FormSelect from './components/common/FormSelect';

function App() {
  // 1. Fully interactive form state object
  const [formData, setFormData] = useState({ 
    assetName: '', 
    assetStatus: '',
    assetType: '' 
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error message dynamically when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 2. State-driven arrays to populate form fields dynamically
  const statusOptions = [
    { value: 'Available', label: '🟢 Available for Deployment' },
    { value: 'Allocated', label: '🔵 Allocated to Staff' },
    { value: 'Damaged', label: '🔴 Sent for Repair / Damaged' }
  ];

  const typeOptions = [
    { value: 'Hardware', label: 'Hardware (Laptops, Monitors)' },
    { value: 'Software', label: 'Software License / Saas' },
    { value: 'Network', label: 'Network Peripheral' }
  ];

  // 3. Client-side submit action with basic validation guardrails
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.assetName.trim()) errors.assetName = 'Asset title is required';
    if (!formData.assetStatus) errors.assetStatus = 'Please select a operational status';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitMessage('');
      return;
    }

    // Success Simulation
    setSubmitMessage(`🚀 Field Package Successfully Formatted: "${formData.assetName}" added as ${formData.assetStatus}!`);
    // Clear out form inputs smoothly
    setFormData({ assetName: '', assetStatus: '', assetType: '' });
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '80px', width: '100%' }}>
      {/* Dashboard Section */}
      <Dashboard />

      {/* Main Grid Wrapper */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '40px auto 0 auto', 
        padding: '0 30px', 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        
        {/* Task 1: Reusable Dynamic Form Components */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b', fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            Asset Registration Matrix
          </h2>
          
          <form onSubmit={handleFormSubmit}>
            <FormInput
              label="Asset Title"
              name="assetName"
              value={formData.assetName}
              onChange={handleInputChange}
              placeholder="e.g. MacBook Pro M3"
              error={formErrors.assetName}
            />

            <FormSelect
              label="Asset Classification"
              name="assetType"
              value={formData.assetType}
              onChange={handleInputChange}
              options={typeOptions}
            />

            <FormSelect
              label="Operational Status"
              name="assetStatus"
              value={formData.assetStatus}
              onChange={handleInputChange}
              options={statusOptions}
              error={formErrors.assetStatus}
            />

            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#3b82f6', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                marginTop: '15px' 
              }}
            >
              Submit Field Package
            </button>
          </form>

          {/* User Confirmation Toast Message */}
          {submitMessage && (
            <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>
              {submitMessage}
            </div>
          )}
        </div>

        {/* Task 4: Omni-Search Interface */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b', fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            Global Registry Scan
          </h2>
          <GlobalSearch />
        </div>

      </div>
    </div>
  );
}

export default App;