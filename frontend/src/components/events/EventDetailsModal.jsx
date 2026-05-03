import { Calendar, MapPin, Ticket } from 'lucide-react';
import Button from '../ui/Button';
import MotionModal from '../ui/MotionModal';

const EventDetailsModal = ({ event, onClose, onRegister, registering, registered }) => {
  if (!event) return null;

  return (
    <MotionModal
      isOpen={!!event}
      onClose={onClose}
      title="Event preview"
      size="lg"
      layoutId={`event-card-${event.ID}`}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-xl shadow-cyan-950/20">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/12 backdrop-blur">
            <Ticket className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">{event.Title}</h2>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Review the details, then reserve your place. Registration feedback stays immediate and reversible from the interface state.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] p-4">
            <Calendar className="mb-3 h-5 w-5 text-cyan-500" />
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">Date</p>
            <p className="mt-1 font-semibold text-[var(--text-primary)]">{event.Date}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] p-4">
            <MapPin className="mb-3 h-5 w-5 text-rose-500" />
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">Location</p>
            <p className="mt-1 font-semibold text-[var(--text-primary)]">{event.Location}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={onClose} className="flex-1">Close</Button>
          <Button
            onClick={() => onRegister(event.ID)}
            loading={registering === event.ID}
            success={registered}
            variant={registered ? 'success' : 'primary'}
            className="flex-1"
          >
            Register for event
          </Button>
        </div>
      </div>
    </MotionModal>
  );
};

export default EventDetailsModal;
