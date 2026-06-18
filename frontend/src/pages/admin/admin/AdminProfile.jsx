import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import client from "../../../api/client";

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        background: 'var(--surface)', 
        borderRadius: 'var(--border-radius-lg)', 
        boxShadow: 'var(--shadow-md)', 
        padding: '2rem', 
        border: '1px solid var(--border)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: 'var(--primary)', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            👤 Admin Profile
          </h2>
          <button 
            onClick={() => {
              if (editing) {
                setForm({ name: user?.name || '', email: user?.email || '', password: '' });
                setMessage('');
              }
              setEditing(!editing);
            }}
            style={{
              padding: '8px 16px',
              background: editing ? 'var(--error)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--background)', 
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border)'
          }}>
            <label style={{ 
              fontWeight: '500', 
              color: 'var(--text-primary)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Full Name
            </label>
            {editing ? (
              <input 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '1rem'
                }}
              />
            ) : (
              <div style={{ 
                fontSize: '1rem', 
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                {user?.name || 'N/A'}
              </div>
            )}
          </div>

          <div style={{ 
            padding: '1rem', 
            background: 'var(--background)', 
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border)'
          }}>
            <label style={{ 
              fontWeight: '500', 
              color: 'var(--text-primary)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Email Address
            </label>
            {editing ? (
              <input 
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '1rem'
                }}
              />
            ) : (
              <div style={{ 
                fontSize: '1rem', 
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                {user?.email || 'N/A'}
              </div>
            )}
          </div>

          <div style={{ 
            padding: '1rem', 
            background: 'var(--background)', 
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border)'
          }}>
            <label style={{ 
              fontWeight: '500', 
              color: 'var(--text-primary)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Role
            </label>
            <div style={{ 
              fontSize: '1rem', 
              color: 'var(--primary)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚖️ {user?.role || 'N/A'}
            </div>
          </div>

          <div style={{ 
            padding: '1rem', 
            background: 'var(--background)', 
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border)'
          }}>
            <label style={{ 
              fontWeight: '500', 
              color: 'var(--text-primary)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              User ID
            </label>
            <div style={{ 
              fontSize: '1rem', 
              color: 'var(--text-secondary)',
              fontFamily: 'monospace'
            }}>
              #{user?.id || 'N/A'}
            </div>
          </div>
          
          {editing && (
            <div style={{ 
              padding: '1rem', 
              background: 'var(--background)', 
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border)'
            }}>
              <label style={{ 
                fontWeight: '500', 
                color: 'var(--text-primary)', 
                fontSize: '0.875rem',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                New Password (optional)
              </label>
              <input 
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="Leave blank to keep current password"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}
          
          {editing && (
            <button 
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await client.put('/api/user/profile', form);
                  setUser(res.data);
                  setEditing(false);
                  setMessage('Profile updated successfully!');
                  setTimeout(() => setMessage(''), 3000);
                } catch (err) {
                  setMessage(err.response?.data || 'Update failed');
                }
                setLoading(false);
              }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          )}
          
          {message && (
            <div style={{
              padding: '12px',
              background: message.includes('success') ? '#f0fdf4' : '#fef2f2',
              color: message.includes('success') ? '#16a34a' : '#dc2626',
              border: `1px solid ${message.includes('success') ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;