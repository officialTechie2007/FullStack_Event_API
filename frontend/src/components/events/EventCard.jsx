import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import GlassCard from '../ui/GlassCard';

const EventCard = ({ event, onOpen, onRegister, registering, registered }) => {
  const eventId = event.ID;

  return (
    <GlassCard hover layoutId={`event-card-${eventId}`} onClick={() => onOpen(event)} className="flex min-h-[238px] flex-col">
      <div className="mb-5 flex items-center justify-between">
        <motion.div layoutId={`event-icon-${eventId}`} className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20">
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <span className="rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
          #{eventId}
        </span>
      </div>

      <div className="flex-1">
        <motion.h3 layoutId={`event-title-${eventId}`} className="mb-3 text-lg font-semibold leading-snug text-[var(--text-primary)]">
          {event.Title}
        </motion.h3>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-500" />
            <span>{event.Date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span className="truncate">{event.Location}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onRegister(eventId);
        }}
        loading={registering === eventId}
        success={registered}
        variant={registered ? 'success' : 'primary'}
        className="mt-5 w-full"
        icon={registered ? <CheckCircle2 className="h-4 w-4" /> : undefined}
      >
        Register
      </Button>
    </GlassCard>
  );
};

export default EventCard;
