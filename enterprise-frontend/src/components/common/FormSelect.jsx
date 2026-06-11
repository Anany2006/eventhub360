import React from 'react';

const FormSelect = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="form-group" style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={name} style={{ fontWeight: '600', marginBottom: '5px', fontSize: '14px' }}>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          padding: '10px',
          borderRadius: '6px',
          border: error ? '2px solid #ff4d4d' : '1px solid #ccc',
          fontSize: '16px',
          backgroundColor: '#fff'
        }}
      >
        <option value="">Select an option...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default FormSelect;