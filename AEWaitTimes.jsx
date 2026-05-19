import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const STATUS_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7c3aed'
};

const STATUS_LABELS = {
  low: 'Short wait',
  medium: 'Moderate wait',
  high: 'Long wait',
  critical: 'Very long wait'
};

function formatWaitTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function WaitTimeCard({ trust, isNearest }) {
  const color = STATUS_COLORS[trust.status];
  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      backgroundColor: isNearest ? '#f0fdf4' : 'white',
      position: 'relative'
    }}>
      {isNearest && (
        <span style={{
          position: 'absolute', top: 8, right: 8,
          backgroundColor: '#22c55e', color: 'white',
          fontSize: 11, padding: '2px 8px', borderRadius: 12
        }}>Nearest</span>
      )}
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
        {trust.shortName}
      </div>
      <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>
        {trust.borough}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontSize: 28, fontWeight: 800, color
        }}>
          {formatWaitTime(trust.waitTimeMinutes)}
        </span>
        <span style={{
          backgroundColor: color, color: 'white',
          padding: '4px 10px', borderRadius: 20, fontSize: 12
        }}>
          {STATUS_LABELS[trust.status]}
        </span>
      </div>
      {!trust.isLive && (
        <div style={{ fontSize: 11, color: '#999', marginTop: 6 }}>
          Estimated — live data unavailable
        </div>
      )}
    </div>
  );
}

export default function AEWaitTimes() {
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestTrusts, setNearestTrusts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'map'

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearest(latitude, longitude);
        },
        () => {} // silently fail
      );
    }
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/ae-wait-times`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setTrusts(json.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError('Could not load wait times. Using estimated data.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchNearest(lat, lng) {
    try {
      const res = await fetch(`${API_URL}/api/nearest?lat=${lat}&lng=${lng}&limit=3`);
      const json = await res.json();
      setNearestTrusts(json.data.map(t => t.id));
    } catch (e) {}
  }

  const sorted = [...trusts].sort((a, b) => a.waitTimeMinutes - b.waitTimeMinutes);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#dc2626', marginBottom: 4 }}>
          London A&amp;E Wait Times
        </h1>
        <p style={{ color: '#666', fontSize: 14 }}>
          Real-time waiting times for London NHS Emergency Departments
        </p>
        {lastUpdated && (
          <p style={{ color: '#999', fontSize: 12 }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Status banner */}
      {error && (
        <div style={{
          backgroundColor: '#fef3c7', border: '1px solid #f59e0b',
          borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14
        }}>
          {error}
        </div>
      )}

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['list', 'map'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '8px 20px', borderRadius: 20, border: 'none',
            backgroundColor: view === v ? '#dc2626' : '#f1f5f9',
            color: view === v ? 'white' : '#64748b',
            cursor: 'pointer', fontWeight: 600, fontSize: 14
          }}>
            {v === 'list' ? 'List View' : 'Map View'}
          </button>
        ))}
        <button onClick={fetchData} style={{
          marginLeft: 'auto', padding: '8px 20px', borderRadius: 20,
          border: '1px solid #e2e8f0', backgroundColor: 'white',
          cursor: 'pointer', fontSize: 14
        }}>
          Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          Loading wait times...
        </div>
      )}

      {!loading && view === 'list' && (
        <>
          {userLocation && nearestTrusts.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#374151' }}>
                Nearest to You
              </h2>
              {sorted
                .filter(t => nearestTrusts.includes(t.id))
                .map(trust => (
                  <WaitTimeCard key={trust.id} trust={trust} isNearest={true} />
                ))}
            </div>
          )}
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#374151' }}>
            All Departments (Shortest Wait First)
          </h2>
          {sorted.map(trust => (
            <WaitTimeCard key={trust.id} trust={trust} isNearest={nearestTrusts.includes(trust.id)} />
          ))}
        </>
      )}

      {!loading && view === 'map' && (
        <div style={{ height: 500, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <MapContainer
            center={[51.5074, -0.1278]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {trusts.map(trust => (
              <Marker
                key={trust.id}
                position={[trust.location.lat, trust.location.lng]}
              >
                <Popup>
                  <strong>{trust.shortName}</strong><br />
                  Wait: {formatWaitTime(trust.waitTimeMinutes)}<br />
                  Status: {STATUS_LABELS[trust.status]}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Legend */}
      <div style={{
        marginTop: 24, padding: 16, backgroundColor: '#f8fafc',
        borderRadius: 8, border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Wait Time Guide</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }} />
              <span style={{ fontSize: 13, color: '#374151' }}>
                {STATUS_LABELS[status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
