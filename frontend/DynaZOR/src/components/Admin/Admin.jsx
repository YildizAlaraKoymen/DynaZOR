import { useState, Fragment } from 'react';
import { adminApi } from '../../apis/adminApi';

export default function Admin() {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [databaseData, setDatabaseData] = useState(null);
  const [modifyUser, setModifyUser] = useState({ userID: '', name: '', username: '', email: '' });
  const [expandedTimeslotId, setExpandedTimeslotId] = useState(null);
  const [expandedOwnerId, setExpandedOwnerId] = useState(null);

  const { authenticate, initDB, resetDB, viewDB, backupDB, modifyDB } = adminApi();

  const handleAuth = async () => {
    try {
      setLoading(true);
      await authenticate(adminPassword);
      setIsAuthenticated(true);
      setMessage(['Admin authenticated successfully', 'success']);
    } catch (err) {
      setMessage(['Invalid admin password', 'error']);
    } finally {
      setLoading(false);
    }
  };

  const handleInitDB = async () => {
    if (!window.confirm('Initialize database? This will create new tables.')) return;
    try {
      setLoading(true);
      await initDB(adminPassword);
      setMessage(['Database initialized successfully', 'success']);
    } catch (err) {
      setMessage(['Failed to initialize database', 'error']);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDB = async () => {
    if (!window.confirm('WARNING: This will delete ALL data! Are you sure?')) return;
    try {
      setLoading(true);
      await resetDB(adminPassword);
      setMessage(['Database reset - all data deleted', 'success']);
      setDatabaseData(null);
    } catch (err) {
      setMessage(['Failed to reset database', 'error']);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDB = async () => {
    try {
      setLoading(true);
      const data = await viewDB(adminPassword);
      setDatabaseData(data);
      setMessage(['Database data loaded', 'success']);
    } catch (err) {
      setMessage(['Failed to view database', 'error']);
    } finally {
      setLoading(false);
    }
  };

  const handleBackupDB = async () => {
    try {
      setLoading(true);
      const data = await backupDB(adminPassword);
      const jsonStr = JSON.stringify(data, null, 2);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
      element.setAttribute('download', `dynazor_backup_${new Date().toISOString().split('T')[0]}.json`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setMessage(['Backup downloaded successfully', 'success']);
    } catch (err) {
      setMessage(['Failed to backup database', 'error']);
    } finally {
      setLoading(false);
    }
  };

  const handleModifyUser = async () => {
    if (!modifyUser.userID) {
      setMessage(['Please enter a User ID', 'error']);
      return;
    }
    try {
      setLoading(true);
      await modifyDB(adminPassword, 'update', parseInt(modifyUser.userID), modifyUser.name, modifyUser.username, modifyUser.email);
      setMessage(['User updated successfully', 'success']);
      setModifyUser({ userID: '', name: '', username: '', email: '' });
      const data = await viewDB(adminPassword);
      setDatabaseData(data);
    } catch (err) {
      setMessage(['Failed to update user', 'error']);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userID) => {
    if (!window.confirm(`Delete user ${userID} and all their data? This cannot be undone.`)) return;
    try {
      setLoading(true);
      await modifyDB(adminPassword, 'delete', userID, null, null, null);
      setMessage(['User deleted successfully', 'success']);
      const data = await viewDB(adminPassword);
      setDatabaseData(data);
    } catch (err) {
      setMessage(['Failed to delete user', 'error']);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #f5f3ff 100%)' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>Admin Panel</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: 8 }}
          />
          <button
            onClick={handleAuth}
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#4f46e5', color: 'white', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
          {message && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 8, background: message[1] === 'error' ? '#fee2e2' : '#dcfce7', color: message[1] === 'error' ? '#991b1b' : '#166534' }}>
              {message[0]}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #f5f3ff 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#1f2937' }}>Admin Dashboard</h1>

        {message && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 8, background: message[1] === 'error' ? '#fee2e2' : '#dcfce7', color: message[1] === 'error' ? '#991b1b' : '#166534', fontWeight: 600 }}>
            {message[0]}
          </div>
        )}

        {/* Admin Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={handleInitDB} disabled={loading} style={{ padding: '1rem', background: '#3b82f6', color: 'white', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Initialize DB
          </button>
          <button onClick={handleResetDB} disabled={loading} style={{ padding: '1rem', background: '#ef4444', color: 'white', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Reset DB
          </button>
          <button onClick={handleViewDB} disabled={loading} style={{ padding: '1rem', background: '#10b981', color: 'white', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            View DB
          </button>
          <button onClick={handleBackupDB} disabled={loading} style={{ padding: '1rem', background: '#f59e0b', color: 'white', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Backup DB
          </button>
        </div>

        {/* Modify User Section */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>Modify User</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="number"
              placeholder="User ID"
              value={modifyUser.userID}
              onChange={(e) => setModifyUser({ ...modifyUser, userID: e.target.value })}
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8 }}
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={modifyUser.name}
              onChange={(e) => setModifyUser({ ...modifyUser, name: e.target.value })}
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8 }}
            />
            <input
              type="text"
              placeholder="Username (optional)"
              value={modifyUser.username}
              onChange={(e) => setModifyUser({ ...modifyUser, username: e.target.value })}
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8 }}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={modifyUser.email}
              onChange={(e) => setModifyUser({ ...modifyUser, email: e.target.value })}
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8 }}
            />
          </div>
          <button onClick={handleModifyUser} disabled={loading} style={{ padding: '0.75rem 1.5rem', background: '#7c3aed', color: 'white', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Update User
          </button>
        </div>

        {/* Database Display */}
        {databaseData && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>Database Contents</h2>

            {/* Users */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Users ({databaseData.users?.length || 0})</h3>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600 }}>Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600 }}>Username</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600 }}>Email</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600 }}>Password</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([...databaseData.users] || []).sort((a,b) => a.userID - b.userID).map((user) => (
                      <tr key={user.userID} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb' }}>{user.userID}</td>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb' }}>{user.name}</td>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb' }}>{user.username}</td>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb' }}>{user.email}</td>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb' }}>{user.password}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <button onClick={() => handleDeleteUser(user.userID)} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Schedules */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Schedules ({databaseData.schedules?.length || 0})</h3>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600 }}>Schedule ID</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600 }}>User</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(databaseData.schedules || [])
                      .slice()
                      .sort((a,b) => (a.scheduleID - b.scheduleID) || (new Date(b.date) - new Date(a.date)))
                      .map((sched) => (
                      <tr key={sched.scheduleID} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb' }}>{sched.scheduleID}</td>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #e5e7eb' }}>{sched.username} <span style={{color:'#6b7280'}}>(ID {sched.userID})</span></td>  
                        <td style={{ padding: '0.75rem' }}>{sched.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeslots */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Timeslots ({databaseData.timeslots?.length || 0})</h3>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Schedule ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set((databaseData.timeslots || []).map(ts => ts.scheduleID)))
                      .sort((a,b) => a - b)
                      .map((scheduleID) => (
                      <Fragment key={`group-${scheduleID}`}>
                        <tr 
                          key={`schedule-${scheduleID}`}
                          onClick={() => setExpandedTimeslotId(expandedTimeslotId === scheduleID ? null : scheduleID)}
                          style={{ 
                            borderTop: '1px solid #e5e7eb', 
                            cursor: 'pointer',
                            background: expandedTimeslotId === scheduleID ? '#f9fafb' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '0.75rem' }}>
                            {expandedTimeslotId === scheduleID ? '▼' : '▶'} Schedule {scheduleID}
                          </td>
                        </tr>
                        {expandedTimeslotId === scheduleID && (
                          <tr style={{ background: '#fafafa' }}>
                            <td style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                                <thead>
                                  <tr style={{ background: '#f0f1f3' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>Timeslot ID</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>Time</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>Available</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>Booked By</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {databaseData.timeslots
                                    ?.filter(ts => ts.scheduleID === scheduleID)
                                    .sort((a,b) => (a.hour - b.hour) || (a.minute - b.minute))
                                    .map((ts) => (
                                    <tr key={ts.timeSlotID} style={{ borderTop: '1px solid #e5e7eb' }}>
                                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e5e7eb' }}>{ts.timeSlotID}</td>
                                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e5e7eb' }}>{String(ts.hour).padStart(2, '0')}:{String(ts.minute).padStart(2, '0')}</td>
                                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e5e7eb' }}>{ts.available ? '✓ Yes' : '✗ No'}</td>
                                      <td style={{ padding: '0.5rem' }}>{ts.bookedByUserID || '—'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Appointment Stats */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.75rem', color: '#374151' }}>Appointment Stats ({databaseData.appointment_stats?.length || 0})</h3>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Owner ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...new Set(databaseData.appointment_stats?.map(as => as.ownerUserID))].map((ownerUserID) => (
                      <Fragment key={`owner-${ownerUserID}`}>
                        <tr
                          onClick={() => setExpandedOwnerId(expandedOwnerId === ownerUserID ? null : ownerUserID)}
                          style={{
                            borderTop: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            background: expandedOwnerId === ownerUserID ? '#f9fafb' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '0.75rem' }}>
                            {expandedOwnerId === ownerUserID ? '▼' : '▶'} Owner ID {ownerUserID}
                          </td>
                        </tr>
                        {expandedOwnerId === ownerUserID && (
                          <tr style={{ background: '#fafafa' }}>
                            <td style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                                <thead>
                                  <tr style={{ background: '#f0f1f3' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>Booker ID</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', borderRight: '1px solid #e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>Time</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>Bookings</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {databaseData.appointment_stats
                                    ?.filter(as => as.ownerUserID === ownerUserID)
                                    .map((as, i) => (
                                      <tr key={`${ownerUserID}-${as.bookerUserID}-${as.hour}-${as.minute}`} style={{ borderTop: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '0.5rem', borderRight: '1px solid #e5e7eb' }}>{as.bookerUserID}</td>
                                        <td style={{ padding: '0.5rem', borderRight: '1px solid #e5e7eb' }}>
                                          {String(as.hour).padStart(2, '0')}:{String(as.minute).padStart(2, '0')}
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>{as.bookingCount}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
