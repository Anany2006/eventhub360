import React from 'react';

const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, error }) => {
  return (
    <div className="form-group" style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={name} style={{ fontWeight: '600', marginBottom: '5px', fontSize: '14px' }}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: '10px',
          borderRadius: '6px',
          border: error ? '2px solid #ff4d4d' : '1px solid #ccc',
          fontSize: '16px'
        }}
      />
      {error && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default FormInput;