import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, LogOut, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Redirect if not admin
  useEffect(() => {
    if (!token || adminUser.role !== 'admin') {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(users.filter((u) => u._id !== id));
      else {
        const d = await res.json();
        alert(d.error);
      }
    } catch {
      alert('Delete failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <Shield size={28} />
          <span>Admin</span>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active">
            <Users size={18} /> Users
          </div>
        </nav>
        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>User Management</h1>
            <p>Manage registered users — {users.length} total</p>
          </div>
          <button className="refresh-btn" onClick={fetchUsers}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && (
          <div className="admin-alert">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="admin-loading">
            <div className="spinner-lg" />
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <Users size={48} />
            <p>No users registered yet.</p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="user-avatar">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(u._id)}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
