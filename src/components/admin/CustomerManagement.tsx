import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CustomerRecord } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Users,
  Search,
  Eye,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserX,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  X,
  Loader2,
} from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { customers, isLoadingCustomers, updateCustomerStatus } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Confirmation Modal State
  const [confirmData, setConfirmData] = useState<{
    isOpen: boolean;
    customer: CustomerRecord | null;
    nextStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }>({
    isOpen: false,
    customer: null,
    nextStatus: 'ACTIVE',
  });

  // Filtering Logic
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.id.toString() === query;

      const matchesStatus = statusFilter === 'ALL' || c.accountStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // Handle status toggle prompt
  const promptStatusChange = (customer: CustomerRecord, newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    if (newStatus === 'SUSPENDED' || newStatus === 'INACTIVE') {
      setConfirmData({
        isOpen: true,
        customer,
        nextStatus: newStatus,
      });
    } else {
      updateCustomerStatus(customer.id, newStatus);
    }
  };

  const executeStatusChange = () => {
    if (confirmData.customer) {
      updateCustomerStatus(confirmData.customer.id, confirmData.nextStatus);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F9FAFB] font-['Poppins']">
                Customer Management
              </h1>
              <p className="text-xs text-[#9CA3AF]">
                View registered users, track order counts, check reservations, and manage account statuses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#D1D5DB] bg-[#1F2937] border border-[#374151] px-3 py-1.5 rounded-xl">
            Total Customers: <strong className="text-[#F97316]">{customers.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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

        {/* Status Filter Tabs & Page Size */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-[#374151] text-xs font-medium">
            {(['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#F97316] text-white font-bold shadow-md'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                {status === 'ALL' ? 'All Customers' : status}
              </button>
            ))}
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#111827] border border-[#374151] rounded-lg px-2 py-1 text-[#F9FAFB] text-xs focus:outline-none"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl shadow-md overflow-hidden">
        {isLoadingCustomers ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#F97316] animate-spin mx-auto" />
            <p className="text-xs text-[#9CA3AF]">Fetching live customer profiles from Spring Boot backend...</p>
          </div>
        ) : paginatedCustomers.length === 0 ? (
          <div className="py-16 text-center text-[#9CA3AF] space-y-3">
            <Users className="w-12 h-12 text-[#374151] mx-auto" />
            <p className="text-sm font-semibold text-[#F9FAFB]">No customers found</p>
            <p className="text-xs max-w-sm mx-auto">
              No registered customers match your current search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827] border-b border-[#374151] text-[#9CA3AF] font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6 text-center">Total Orders</th>
                  <th className="py-4 px-6 text-center">Reservations</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]/50 text-[#D1D5DB]">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#1F2937] transition-colors group">
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {customer.avatarUrl ? (
                          <img
                            src={customer.avatarUrl}
                            alt={customer.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#F97316]/30 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F97316] to-[#EA580C] text-white font-bold flex items-center justify-center text-sm shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-[#F9FAFB] block">{customer.name}</span>
                          <span className="text-[10px] text-[#9CA3AF]">ID #{customer.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-[#D1D5DB] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span>{customer.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 text-[#D1D5DB] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span>{customer.phone || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block bg-[#111827] border border-[#374151] font-extrabold text-[#F97316] px-3 py-1 rounded-full text-xs">
                        {customer.totalOrders}
                      </span>
                    </td>

                    {/* Total Reservations */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block bg-[#111827] border border-[#374151] font-bold text-[#3B82F6] px-3 py-1 rounded-full text-xs">
                        {customer.totalReservations}
                      </span>
                    </td>

                    {/* Account Status Badge */}
                    <td className="py-4 px-6">
                      {customer.accountStatus === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          <ShieldCheck className="w-3 h-3" />
                          ACTIVE
                        </span>
                      )}
                      {customer.accountStatus === 'INACTIVE' && (
                        <span className="inline-flex items-center gap-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          <UserX className="w-3 h-3" />
                          INACTIVE
                        </span>
                      )}
                      {customer.accountStatus === 'SUSPENDED' && (
                        <span className="inline-flex items-center gap-1.5 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          <ShieldAlert className="w-3 h-3" />
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] p-2 rounded-xl border border-[#374151] transition-colors cursor-pointer"
                        title="View Customer Details"
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

        {/* Pagination Footer */}
        {filteredCustomers.length > 0 && (
          <div className="p-4 bg-[#111827] border-t border-[#374151] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
            <div>
              Showing <strong className="text-white">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-white">
                {Math.min(currentPage * pageSize, filteredCustomers.length)}
              </strong>{' '}
              of <strong className="text-white">{filteredCustomers.length}</strong> customers
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] rounded-xl border border-[#374151] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-[#F9FAFB] px-3 py-1 bg-[#1F2937] rounded-lg border border-[#374151]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] rounded-xl border border-[#374151] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#1E293B] border border-[#374151] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="p-6 bg-[#111827] border-b border-[#374151] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedCustomer.avatarUrl ? (
                  <img
                    src={selectedCustomer.avatarUrl}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F97316] shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F97316] to-[#EA580C] text-white font-bold flex items-center justify-center text-lg shadow-md">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-[#F9FAFB] font-['Poppins']">
                    {selectedCustomer.name}
                  </h3>
                  <span className="text-xs text-[#9CA3AF]">Customer Profile & History</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] p-2 rounded-xl hover:bg-[#1F2937] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#111827] border border-[#374151] p-3 rounded-xl space-y-1">
                  <span className="text-[#9CA3AF] block font-medium">Email Address</span>
                  <span className="font-bold text-[#F9FAFB] truncate block">{selectedCustomer.email}</span>
                </div>
                <div className="bg-[#111827] border border-[#374151] p-3 rounded-xl space-y-1">
                  <span className="text-[#9CA3AF] block font-medium">Phone Number</span>
                  <span className="font-bold text-[#F9FAFB] truncate block">{selectedCustomer.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#111827] border border-[#374151] p-4 rounded-xl text-center space-y-1">
                  <ShoppingBag className="w-5 h-5 text-[#F97316] mx-auto" />
                  <span className="text-[10px] text-[#9CA3AF] block uppercase font-bold">Total Orders</span>
                  <span className="text-lg font-extrabold text-[#F9FAFB]">{selectedCustomer.totalOrders}</span>
                </div>

                <div className="bg-[#111827] border border-[#374151] p-4 rounded-xl text-center space-y-1">
                  <Calendar className="w-5 h-5 text-[#3B82F6] mx-auto" />
                  <span className="text-[10px] text-[#9CA3AF] block uppercase font-bold">Bookings</span>
                  <span className="text-lg font-extrabold text-[#F9FAFB]">{selectedCustomer.totalReservations}</span>
                </div>

                <div className="bg-[#111827] border border-[#374151] p-4 rounded-xl text-center space-y-1">
                  <DollarSign className="w-5 h-5 text-[#22C55E] mx-auto" />
                  <span className="text-[10px] text-[#9CA3AF] block uppercase font-bold">Total Spent</span>
                  <span className="text-lg font-extrabold text-[#22C55E]">₹{selectedCustomer.totalSpent}</span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="space-y-2 pt-2 border-t border-[#374151]">
                <label className="text-xs font-bold text-[#D1D5DB] block">Manage Account Status:</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      promptStatusChange(selectedCustomer, 'ACTIVE');
                      setSelectedCustomer((prev) => (prev ? { ...prev, accountStatus: 'ACTIVE' } : null));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      selectedCustomer.accountStatus === 'ACTIVE'
                        ? 'bg-[#22C55E] text-white border-[#22C55E] shadow-md'
                        : 'bg-[#111827] text-[#9CA3AF] hover:text-[#F9FAFB] border-[#374151]'
                    }`}
                  >
                    ACTIVE
                  </button>

                  <button
                    onClick={() => {
                      promptStatusChange(selectedCustomer, 'INACTIVE');
                      setSelectedCustomer((prev) => (prev ? { ...prev, accountStatus: 'INACTIVE' } : null));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      selectedCustomer.accountStatus === 'INACTIVE'
                        ? 'bg-[#F59E0B] text-white border-[#F59E0B] shadow-md'
                        : 'bg-[#111827] text-[#9CA3AF] hover:text-[#F9FAFB] border-[#374151]'
                    }`}
                  >
                    INACTIVE
                  </button>

                  <button
                    onClick={() => {
                      promptStatusChange(selectedCustomer, 'SUSPENDED');
                      setSelectedCustomer((prev) => (prev ? { ...prev, accountStatus: 'SUSPENDED' } : null));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      selectedCustomer.accountStatus === 'SUSPENDED'
                        ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-md'
                        : 'bg-[#111827] text-[#9CA3AF] hover:text-[#F9FAFB] border-[#374151]'
                    }`}
                  >
                    SUSPEND
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#111827] border-t border-[#374151] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer border border-[#374151]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmData.isOpen}
        title="Confirm Status Change"
        message={`Are you sure you want to set customer account status for "${confirmData.customer?.name}" to ${confirmData.nextStatus}?`}
        type={confirmData.nextStatus === 'SUSPENDED' ? 'danger' : 'warning'}
        confirmText={`Set to ${confirmData.nextStatus}`}
        onConfirm={executeStatusChange}
        onClose={() => setConfirmData((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
