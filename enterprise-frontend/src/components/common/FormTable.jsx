import { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const FormTable = () => {
  const [assetTitle, setAssetTitle] = useState('');
  const [classification, setClassification] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetTitle || !classification || !status) {
      alert('Please populate all operational matrix fields before deployment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: assetTitle,
          type: classification,
          status: status
        })
      });
      
      const payload = await response.json();
      if (payload.success) {
        alert('Asset successfully registered in global registry matrix!');
        setAssetTitle('');
        setClassification('');
        setStatus('');
      } else {
        alert('Server rejected field package payload.');
      }
    } catch (error) {
      console.error('Payload transmission error:', error);
      alert('Could not sync with infrastructure backend. Using local state simulation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { label: 'Available', value: 'Available' },
    { label: 'Allocated', value: 'Allocated' },
    { label: 'Damaged', value: 'Damaged' }
  ];

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontFamily: 'sans-serif' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', textAlign: 'center', fontWeight: '700' }}>
        Asset Registration Matrix
      </h3>
      
      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Asset Title"
          value={assetTitle}
          onChange={(e) => setAssetTitle(e.target.value)}
          placeholder="e.g. MacBook Pro M3"
        />

        <FormInput 
          label="Asset Classification"
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
          placeholder="e.g. Hardware, Software, Peripherals"
        />

        <FormSelect 
          label="Operational Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#93c5fd' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            fontSize: '14px',
            marginTop: '10px'
          }}
        >
          {isSubmitting ? 'Transmitting Field Package...' : 'Submit Field Package'}
        </button>
      </form>
    </div>
  );
};

export default FormTable;