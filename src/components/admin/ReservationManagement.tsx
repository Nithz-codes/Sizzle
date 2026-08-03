import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Reservation } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Calendar,
  Search,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Plus,
  X,
  Utensils,
} from 'lucide-react';

export const ReservationManagement: React.FC = () => {
  const { reservations, updateReservationStatus, assignTable, addReservation, tablesList } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED'>('ALL');

  // Modals State
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Reservation Form State
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [guestCount, setGuestCount] = useState(2);
  const [assignedTable, setAssignedTable] = useState('Unassigned');
  const [occasion, setOccasion] = useState('Casual Dining');
  const [specialRequest, setSpecialRequest] = useState('');

  // Cancellation Modal State
  const [confirmCancelData, setConfirmCancelData] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  // Filtered Logic
  const filteredReservations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return reservations.filter((res) => {
      const matchesSearch =
        !query ||
        res.id.toLowerCase().includes(query) ||
        res.guestName.toLowerCase().includes(query) ||
        res.email.toLowerCase().includes(query) ||
        res.phone.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchQuery, statusFilter]);

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    addReservation({
      guestName: guestName.trim(),
      email: email.trim() || 'guest@example.com',
      phone: phone.trim() || '+1 555-0000',
      date,
      time,
      guestCount,
      assignedTable,
      status: 'CONFIRMED',
      occasion,
      specialRequest: specialRequest.trim(),
    });

    // Reset Form
    setGuestName('');
    setEmail('');
    setPhone('');
    setSpecialRequest('');
    setIsAddModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <Clock className="w-3 h-3" />
            CONFIRMED
          </span>
        );
      case 'SEATED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <Utensils className="w-3 h-3" />
            SEATED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F9FAFB] font-['Poppins']">
              Reservation Management
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Manage dining reservations, assign table numbers, track guest counts, and record special dining requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#F97316]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Guest Name, Email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-[#374151] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#9CA3AF] hover:text-[#F9FAFB]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(['ALL', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                statusFilter === status
                  ? 'bg-[#F97316] text-white border-[#F97316] shadow-md'
                  : 'bg-[#111827] text-[#9CA3AF] border-[#374151] hover:text-[#F9FAFB]'
              }`}
            >
              {status === 'ALL' ? 'All Bookings' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl shadow-md overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="py-16 text-center text-[#9CA3AF] space-y-3">
            <Calendar className="w-12 h-12 text-[#374151] mx-auto" />
            <p className="text-sm font-semibold text-[#F9FAFB]">No reservations found</p>
            <p className="text-xs max-w-sm mx-auto">
              No table bookings match your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827] border-b border-[#374151] text-[#9CA3AF] font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-6">Res ID & Guest</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6 text-center">Guest Count</th>
                  <th className="py-4 px-6">Assigned Table</th>
                  <th className="py-4 px-6">Status Badge</th>
                  <th className="py-4 px-6 text-center">Quick Status Actions</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]/50 text-[#D1D5DB]">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-[#1F2937] transition-colors">
                    {/* ID & Guest */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-sm text-[#F9FAFB] font-['Poppins'] block">
                          {res.id}
                        </span>
                        <span className="font-bold text-[#D1D5DB] block">{res.guestName}</span>
                        <span className="text-[11px] text-[#9CA3AF]">{res.phone}</span>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#22C55E] block">{res.date}</span>
                        <span className="text-[#D1D5DB] font-semibold">{res.time}</span>
                        {res.occasion && (
                          <span className="block text-[10px] text-[#9CA3AF] italic">
                            {res.occasion}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Guest Count Badge */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 bg-[#111827] border border-[#374151] text-[#F97316] font-extrabold px-3 py-1 rounded-full text-xs">
                        <Users className="w-3 h-3 text-[#F97316]" />
                        {res.guestCount} Guests
                      </span>
                    </td>

                    {/* Table Assignment Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={res.assignedTable}
                        onChange={(e) => assignTable(res.id, e.target.value)}
                        className="bg-[#111827] border border-[#374151] text-[#F9FAFB] text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#F97316] cursor-pointer"
                      >
                        <option value="Unassigned">⚠️ Unassigned</option>
                        {tablesList.map((t) => (
                          <option key={t.name} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">{getStatusBadge(res.status)}</td>

                    {/* Quick Status Actions */}
                    <td className="py-4 px-6 text-center">
                      {res.status !== 'COMPLETED' && res.status !== 'CANCELLED' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {res.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'SEATED')}
                              className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                            >
                              Seat Guests
                            </button>
                          )}

                          {res.status === 'SEATED' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'COMPLETED')}
                              className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                            >
                              Complete
                            </button>
                          )}

                          <button
                            onClick={() => setConfirmCancelData({ isOpen: true, id: res.id })}
                            className="bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/40 font-bold text-[11px] px-2 py-1 rounded-lg transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#9CA3AF] italic">No further actions</span>
                      )}
                    </td>

                    {/* Details View Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedReservation(res)}
                        className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] p-2 rounded-xl border border-[#374151] transition-colors cursor-pointer"
                        title="View Reservation Details"
                      >
                        <Eye className="w-4 h-4 text-[#F97316]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#1E293B] border border-[#374151] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-[#111827] border-b border-[#374151] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F9FAFB] font-['Poppins']">
                    Reservation {selectedReservation.id}
                  </h3>
                  {getStatusBadge(selectedReservation.status)}
                </div>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] p-2 rounded-xl hover:bg-[#1F2937] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-[#111827] border border-[#374151] p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#374151]">
                  <span className="text-[#9CA3AF]">Guest Name</span>
                  <strong className="text-[#F9FAFB] text-sm">{selectedReservation.guestName}</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#374151]">
                  <span className="text-[#9CA3AF]">Phone</span>
                  <span className="text-[#D1D5DB] font-semibold">{selectedReservation.phone}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#374151]">
                  <span className="text-[#9CA3AF]">Email</span>
                  <span className="text-[#D1D5DB] font-semibold">{selectedReservation.email}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#374151]">
                  <span className="text-[#9CA3AF]">Date & Time</span>
                  <strong className="text-[#22C55E]">
                    {selectedReservation.date} at {selectedReservation.time}
                  </strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#374151]">
                  <span className="text-[#9CA3AF]">Guest Count</span>
                  <strong className="text-[#F97316]">{selectedReservation.guestCount} Guests</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF]">Assigned Table</span>
                  <strong className="text-[#F59E0B]">{selectedReservation.assignedTable}</strong>
                </div>
              </div>

              {selectedReservation.specialRequest && (
                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 p-3.5 rounded-2xl text-[#F59E0B] space-y-1">
                  <span className="font-bold block uppercase text-[10px]">Special Requests:</span>
                  <p className="text-xs">{selectedReservation.specialRequest}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#111827] border-t border-[#374151] flex justify-end">
              <button
                onClick={() => setSelectedReservation(null)}
                className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer border border-[#374151]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Reservation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#1E293B] border border-[#374151] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-[#111827] border-b border-[#374151] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#F9FAFB] font-['Poppins']">
                  Add New Table Reservation
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] p-2 rounded-xl hover:bg-[#1F2937] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#D1D5DB] font-bold mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-[#F9FAFB] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-[#D1D5DB] font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-[#F9FAFB] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D1D5DB] font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-[#F9FAFB] focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#D1D5DB] font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-2 py-2 text-[#F9FAFB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#D1D5DB] font-bold mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-2 py-2 text-[#F9FAFB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#D1D5DB] font-bold mb-1">Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-[#F9FAFB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#D1D5DB] font-bold mb-1">Assign Table</label>
                  <select
                    value={assignedTable}
                    onChange={(e) => setAssignedTable(e.target.value)}
                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-[#F9FAFB] focus:outline-none"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {tablesList.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#D1D5DB] font-bold mb-1">Occasion</label>
                  <input
                    type="text"
                    placeholder="Birthday, Business, etc."
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-[#F9FAFB] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D1D5DB] font-bold mb-1">Special Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Window seat, candle setup, high chair request..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full bg-[#111827] border border-[#374151] rounded-xl p-3 text-[#F9FAFB] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#374151] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold px-5 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#F97316]/20"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmCancelData.isOpen}
        title="Cancel Reservation"
        message={`Are you sure you want to cancel reservation "${confirmCancelData.id}"?`}
        type="danger"
        confirmText="Yes, Cancel Booking"
        onConfirm={() => {
          if (confirmCancelData.id) {
            updateReservationStatus(confirmCancelData.id, 'CANCELLED');
          }
        }}
        onClose={() => setConfirmCancelData({ isOpen: false, id: null })}
      />
    </div>
  );
};
