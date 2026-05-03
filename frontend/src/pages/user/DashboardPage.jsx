/* eslint-disable react-hooks/immutability */
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AnimatedCounter from '../../components/animation/AnimatedCounter';
import EventCard from '../../components/events/EventCard';
import EventDetailsModal from '../../components/events/EventDetailsModal';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { staggerContainer, staggerItem } from '../../utils/motion';

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
    <div className="space-y-8">
      <motion.section className="premium-hero relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl shadow-cyan-950/20 md:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="mb-1 text-sm font-medium text-white/70">Welcome back</p>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">{user?.name || 'User'}</h1>
              <p className="max-w-2xl text-lg text-white/80">
                Discover events, preview details, and register with immediate feedback.
              </p>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden rounded-3xl border border-white/15 bg-white/10 p-5 text-sm font-semibold backdrop-blur md:block"
            >
              Live events
            </motion.div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm">
              <p className="text-2xl font-bold"><AnimatedCounter value={events.length} /></p>
              <p className="text-sm text-white/70">Available events</p>
            </div>
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm">
              <p className="text-2xl font-bold capitalize">{user?.role}</p>
              <p className="text-sm text-white/70">Account type</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.div layout className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/45"
          />
        </motion.div>
      </div>

      <section>
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-[var(--text-primary)]">
          <Calendar className="h-5 w-5 text-cyan-500" />
          Available Events
          <span className="text-sm font-normal text-[var(--text-muted)]">({filteredEvents.length})</span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState title="No events found" description={search ? 'Try adjusting your search terms.' : 'No events are available right now.'} />
        ) : (
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
        )}
      </section>

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

export default DashboardPage;
