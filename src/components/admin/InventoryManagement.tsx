import React, { useState, useEffect, useMemo } from 'react';
import { InventoryItem } from '../../types';
import { inventoryApi, CreateInventoryPayload } from '../../services/api';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RotateCcw,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Layers,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<string>('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Produce');
  const [formQuantity, setFormQuantity] = useState('');
  const [formUnit, setFormUnit] = useState('kg');
  const [formMinThreshold, setFormMinThreshold] = useState('');
  const [formCostPerUnit, setFormCostPerUnit] = useState('');
  const [formSupplier, setFormSupplier] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Load Inventory Items from Backend API
  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await inventoryApi.getAllItems();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Filtered Items Computation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.supplier && item.supplier.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [items, categoryFilter, statusFilter, searchQuery]);

  // Statistics Computations
  const totalValuation = useMemo(() => items.reduce((acc, i) => acc + (i.totalValue || (i.quantity * i.costPerUnit)), 0), [items]);
  const lowStockCount = useMemo(() => items.filter((i) => i.status === 'LOW_STOCK').length, [items]);
  const outOfStockCount = useMemo(() => items.filter((i) => i.status === 'OUT_OF_STOCK').length, [items]);

  const categoriesList = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return Array.from(set);
  }, [items]);

  // Restock Handler
  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem || !restockQty || isNaN(Number(restockQty)) || Number(restockQty) <= 0) return;

    try {
      await inventoryApi.restockItem(restockModalItem.id, Number(restockQty));
      setRestockModalItem(null);
      setRestockQty('');
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to restock item');
    }
  };

  // Open Edit Modal
  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity.toString());
    setFormUnit(item.unit);
    setFormMinThreshold(item.minThreshold.toString());
    setFormCostPerUnit(item.costPerUnit.toString());
    setFormSupplier(item.supplier || '');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Produce');
    setFormQuantity('');
    setFormUnit('kg');
    setFormMinThreshold('');
    setFormCostPerUnit('');
    setFormSupplier('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Save Form Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formQuantity || !formMinThreshold || !formCostPerUnit) {
      setFormError('Please fill out all required fields');
      return;
    }

    const payload: CreateInventoryPayload = {
      name: formName.trim(),
      category: formCategory,
      quantity: Number(formQuantity),
      unit: formUnit,
      minThreshold: Number(formMinThreshold),
      costPerUnit: Number(formCostPerUnit),
      supplier: formSupplier.trim(),
    };

    try {
      if (editingItem) {
        await inventoryApi.updateItem(editingItem.id, payload);
      } else {
        await inventoryApi.createItem(payload);
      }
      setIsAddModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save inventory item');
    }
  };

  // Delete Handler
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from inventory?`)) return;
    try {
      await inventoryApi.deleteItem(id);
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to delete inventory item');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Stock Valuation</p>
            <p className="text-2xl font-bold text-white mt-1">₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tracked Ingredients</p>
            <p className="text-2xl font-bold text-white mt-1">{items.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{lowStockCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{outOfStockCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ingredient or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1A1F2C] border border-[#262B3B] text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Filter buttons */}
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-orange-500 text-white'
                : 'bg-[#1E2330] text-gray-400 hover:text-white'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setStatusFilter('LOW_STOCK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'LOW_STOCK'
                ? 'bg-amber-500 text-black'
                : 'bg-[#1E2330] text-gray-400 hover:text-white'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>

          {/* Add New Item Button */}
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-[#161922] border border-[#262B3B] rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading inventory stock database...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No inventory items matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1E2330] text-gray-400 uppercase tracking-wider border-b border-[#262B3B]">
                <tr>
                  <th className="px-5 py-4 font-bold">Ingredient / Item</th>
                  <th className="px-5 py-4 font-bold">Category</th>
                  <th className="px-5 py-4 font-bold">Current Stock Level</th>
                  <th className="px-5 py-4 font-bold">Reorder Threshold</th>
                  <th className="px-5 py-4 font-bold">Unit Cost</th>
                  <th className="px-5 py-4 font-bold">Stock Valuation</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B3B] text-gray-300">
                {filteredItems.map((item) => {
                  const percentage = Math.min(100, Math.round((item.quantity / (item.minThreshold * 3)) * 100));

                  return (
                    <tr key={item.id} className="hover:bg-[#1A1F2C] transition-colors">
                      <td className="px-5 py-4 font-semibold text-white">
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          {item.supplier && <p className="text-[11px] text-gray-500 mt-0.5">Supplier: {item.supplier}</p>}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-300">
                        <span className="bg-[#242A38] text-gray-300 px-2.5 py-1 rounded text-xs">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-white text-sm">
                            {item.quantity} {item.unit}
                          </p>
                          {/* Progress bar */}
                          <div className="w-32 bg-[#262B3B] h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.status === 'OUT_OF_STOCK'
                                  ? 'bg-red-500'
                                  : item.status === 'LOW_STOCK'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.max(5, percentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-400 font-medium">
                        {item.minThreshold} {item.unit}
                      </td>

                      <td className="px-5 py-4 font-semibold text-white">
                        ₹{item.costPerUnit.toFixed(2)} / {item.unit}
                      </td>

                      <td className="px-5 py-4 font-bold text-emerald-400">
                        ₹{(item.totalValue || item.quantity * item.costPerUnit).toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        {item.status === 'IN_STOCK' && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                        {item.status === 'LOW_STOCK' && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        )}
                        {item.status === 'OUT_OF_STOCK' && (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRestockModalItem(item)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                            title="Restock Item"
                          >
                            <RotateCcw className="w-3 h-3" /> Restock
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 bg-[#242A38] hover:bg-[#2F374A] text-gray-300 rounded-lg transition-all"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-[#262B3B] rounded-2xl max-w-md w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#262B3B] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                Restock {restockModalItem.name}
              </h3>
              <button onClick={() => setRestockModalItem(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Current Stock: <strong className="text-white">{restockModalItem.quantity} {restockModalItem.unit}</strong>
                </p>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Add Stock Quantity ({restockModalItem.unit}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 15.0"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-4 py-2 bg-[#242A38] text-gray-300 hover:text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Inventory Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-[#262B3B] rounded-2xl max-w-lg w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#262B3B] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                {editingItem ? `Edit Item #${editingItem.id}` : 'Add New Inventory Ingredient'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. White Truffle Oil"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Grains & Rice">Grains & Rice</option>
                    <option value="Produce">Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Condiments">Condiments</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Baking">Baking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Unit of Measure *</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="kg">kg</option>
                    <option value="grams">grams</option>
                    <option value="liters">liters</option>
                    <option value="pcs">pcs</option>
                    <option value="units">units</option>
                    <option value="packs">packs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Quantity *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 25.0"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Reorder Threshold *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 5.0"
                    value={formMinThreshold}
                    onChange={(e) => setFormMinThreshold(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Cost Per Unit (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 450.00"
                    value={formCostPerUnit}
                    onChange={(e) => setFormCostPerUnit(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Prime Meats Co."
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262B3B]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#242A38] text-gray-300 hover:text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20"
                >
                  {editingItem ? 'Update Item' : 'Save New Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
