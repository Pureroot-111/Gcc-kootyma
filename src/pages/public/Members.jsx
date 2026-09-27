import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Eye } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import MemberDetailsModal from '../../components/MemberDetailsModal';

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'members'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setMembersList(data);
    });
    return () => unsub();
  }, []);

  const filteredMembers = membersList.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 2rem 0' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Member Directory</h2>
          <p style={{ color: 'var(--text-muted)' }}>100% transparency on our community members and their generous contributions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', background: 'white' }}>
            <Download size={18} /> Export List
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search members by name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.8)',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
        <button className="btn" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-main)' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="glass-panel desktop-table" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.4)' }}>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Member Profile</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Joined</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Contributions</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, i) => (
                <tr key={member.id} className={`stagger-${(i % 3) + 1}`} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', animation: 'fadeIn 0.5s ease forwards' }}>
                  <td style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={member.avatar} alt={member.name} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{member.name}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '99px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: member.type === 'Executive' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                      color: member.type === 'Executive' ? 'var(--accent)' : 'var(--primary-dark)'
                    }}>
                      {member.type}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{member.location}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{member.joinDate}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>₹ {member.totalContributions.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'white' }}
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-cards">
        {filteredMembers.map((member, i) => (
          <div key={member.id} className={`glass-card stagger-${(i % 3) + 1}`} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.5s ease forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={member.avatar} alt={member.name} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{member.location}</div>
                </div>
              </div>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '99px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                background: member.type === 'Executive' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                color: member.type === 'Executive' ? 'var(--accent)' : 'var(--primary-dark)'
              }}>
                {member.type}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Total Contributions</div>
                <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>₹ {member.totalContributions.toLocaleString()}</div>
              </div>
              <button 
                onClick={() => setSelectedMember(member)}
                className="btn btn-outline" 
                style={{ padding: '8px 16px', fontSize: '0.875rem', background: 'white' }}
              >
                <Eye size={16} /> View
              </button>
            </div>
          </div>
        ))}
      </div>
      <MemberDetailsModal 
        isOpen={!!selectedMember} 
        onClose={() => setSelectedMember(null)} 
        member={selectedMember} 
      />
    </div>
  );
}
