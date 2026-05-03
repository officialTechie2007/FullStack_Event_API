/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { userAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import EventCard from '../../components/events/EventCard';
import EventDetailsModal from '../../components/events/EventDetailsModal';
import toast from 'react-hot-toast';
import { HiCalendar, HiLocationMarker, HiSearch, HiViewGrid, HiViewList } from 'react-icons/hi';
import { staggerContainer, staggerItem } from '../../utils/motion';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [registering, setRegistering] = useState(null);
  const [registered, setRegistered] = useState(() => new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await userAPI.getEvents();
      setEvents(res.data.data || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      await userAPI.registerForEvent(eventId);
      setRegistered((prev) => new Set([...prev, eventId]));
      toast.success('Registration confirmed');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.Title?.toLowerCase().includes(search.toLowerCase()) ||
      event.Location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">All Events</h1>
          <p className="text-[var(--text-muted)] mt-1">Browse and register for upcoming events</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'}`}
          >
            <HiViewGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'}`}
          >
            <HiViewList size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <motion.div layout className="relative">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/45"
        />
      </motion.div>

      {/* Events */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon="🎭"
          title="No events found"
          description={search ? 'Try a different search term' : 'No events available yet'}
        />
      ) : viewMode === 'grid' ? (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <motion.div key={event.ID} variants={staggerItem}>
              <EventCard
                event={event}
                onOpen={setSelectedEvent}
                onRegister={handleRegister}
                registering={registering}
                registered={registered.has(event.ID)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <Card key={event.ID} hover animate className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white text-xl shrink-0">
                  🎪
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">{event.Title}</h3>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><HiCalendar /> {event.Date}</span>
                    <span className="flex items-center gap-1"><HiLocationMarker /> {event.Location}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleRegister(event.ID)}
                loading={registering === event.ID}
                size="sm"
              >
                Register
              </Button>
            </Card>
          ))}
        </div>
      )}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onRegister={handleRegister}
            registering={registering}
            registered={registered.has(selectedEvent.ID)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
