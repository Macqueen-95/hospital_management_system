import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllRooms } from '../utils/api';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { Bed, Building2, DoorOpen, DoorClosed } from 'lucide-react';

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, available, occupied
  
  const { user } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllRooms();
      setRooms(data.rooms);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filterType === 'available') return room.is_available === 1;
    if (filterType === 'occupied') return room.is_available === 0;
    return true;
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.is_available === 1).length,
    occupied: rooms.filter(r => r.is_available === 0).length,
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Building2 size={32} className="text-blue-600" />
          Room Management
        </h1>
        <p className="text-slate-600 mt-1">View all hospital rooms and their availability</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Rooms</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bed className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.available}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Occupied</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.occupied}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <DoorClosed className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Rooms ({stats.total})
          </button>
          <button
            onClick={() => setFilterType('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'available'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Available ({stats.available})
          </button>
          <button
            onClick={() => setFilterType('occupied')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'occupied'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Occupied ({stats.occupied})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRooms.length === 0 && (
        <EmptyState
          icon={Bed}
          title={filterType === 'all' ? 'No rooms found' : `No ${filterType} rooms`}
          description={
            filterType === 'all'
              ? 'There are no rooms in the system.'
              : `There are no ${filterType} rooms at the moment.`
          }
        />
      )}

      {/* Rooms Grid */}
      {!loading && filteredRooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.room_id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {/* Room Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Room {room.room_number}
                  </h3>
                  <p className="text-sm text-slate-600">Floor {room.floor}</p>
                </div>
                <Badge
                  variant={room.is_available ? 'success' : 'error'}
                  className="ml-2"
                >
                  {room.is_available ? 'Available' : 'Occupied'}
                </Badge>
              </div>

              {/* Room Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Type</span>
                  <span className="text-sm font-medium text-slate-800">{room.room_type}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Bed Count</span>
                  <span className="text-sm font-medium text-slate-800">{room.bed_count}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">Price Per Day</span>
                  <span className="text-sm font-medium text-green-600">
                    ₹{room.price_per_day.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default RoomListPage;
