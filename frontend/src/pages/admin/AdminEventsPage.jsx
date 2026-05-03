/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { adminAPI, userAPI } from '../../services/api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { SkeletonTable } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash, HiCalendar, HiLocationMarker } from 'react-icons/hi';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', location: '' });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      toast.error('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      await adminAPI.createEvent(formData.title, formData.date, formData.location);
      toast.success('Event created successfully! 🎉');
      setShowModal(false);
      setFormData({ title: '', date: '', location: '' });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(deleteTarget.ID);
    try {
      await adminAPI.deleteEvent(deleteTarget.ID);
      toast.success('Event deleted');
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'ID' },
    {
      header: 'Title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center text-white text-sm">
            📅
          </div>
          <span className="font-medium">{row.Title}</span>
        </div>
      ),
    },
    {
      header: 'Date',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <HiCalendar className="text-[var(--color-primary)]" /> {row.Date}
        </span>
      ),
    },
    {
      header: 'Location',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <HiLocationMarker className="text-rose-500" /> {row.Location}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event Management</h1>
          <p className="text-[var(--text-muted)] mt-1">Create and manage your events</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<HiPlus />}>
          Create Event
        </Button>
      </div>

      {/* Events Table */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No events yet"
          description="Create your first event to get started"
          action={
            <Button onClick={() => setShowModal(true)} icon={<HiPlus />}>
              Create Event
            </Button>
          }
        />
      ) : (
        <Table
          columns={columns}
          data={events}
          emptyMessage="No events found"
          actions={(row) => (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteTarget(row)}
              loading={deleting === row.ID}
              icon={<HiTrash />}
            >
              Delete
            </Button>
          )}
        />
      )}

      {/* Create Event Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Event">
        <form onSubmit={handleCreate} className="space-y-5">
          <Input
            id="event-title"
            label="Event Title"
            placeholder="e.g. Tech Conference 2026"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            id="event-date"
            label="Event Date"
            placeholder="e.g. 15-05-2026"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            id="event-location"
            label="Location"
            placeholder="e.g. Convention Center, New Delhi"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={creating} className="flex-1">
              Create Event
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete event" size="sm">
        <div className="space-y-5">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">This will remove the event from the system.</p>
            <p className="mt-2 font-semibold text-[var(--text-primary)]">{deleteTarget?.Title}</p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">
              Cancel
            </Button>
            <Button type="button" variant="danger" loading={deleting === deleteTarget?.ID} onClick={handleDelete} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminEventsPage;
