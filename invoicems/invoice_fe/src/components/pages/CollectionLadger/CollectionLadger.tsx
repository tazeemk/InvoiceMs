"use client";

import { useState, useMemo, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { Search, File, Check, X, DollarSign, Calendar, User, Tag, Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PaymentCollectionModal from './PaymentCollectionModal';
import ReceiptPreviewModal from './ReceiptPreviewModal';

// --- Types ---
type CollectionStatus = 'Pending' | 'Collected' | 'Received' | 'Validated' | 'Synced' | 'Failed';
type CollectionRecord = {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: CollectionStatus;
  collectedBy: string;
  paymentMethod: 'Cash' | 'Cheque' | 'UPI';
};

type PaymentDetails = {
  collectionId: string;
  amount: string;
  method: string;
  reference: string;
  remarks: string;
  location: string;
  collectionDate: string;
};

type ReceiptDisplayDetails = {
  collectionId: string;
  customer: string;
  collectedAmount: string;
  paymentMethod: string;
  paymentRef: string;
  collectedBy: string;
  collectionDate: string;
  remarks?: string;
};

// --- Placeholder Data ---
const collectionData: CollectionRecord[] = [
  { id: 'COL-001', date: '2023-11-28', customer: 'CHACHA BOOT HOUSE', amount: 5000.00, status: 'Pending', collectedBy: 'Ramesh', paymentMethod: 'Cash' },
  { id: 'COL-002', date: '2023-11-27', customer: 'NAMASTE SS INTERNATIONAL Pvt. Ltd.', amount: 12000.00, status: 'Collected', collectedBy: 'Suresh', paymentMethod: 'UPI' },
  { id: 'COL-003', date: '2023-11-27', customer: 'RAJESH TRADERS', amount: 7500.00, status: 'Received', collectedBy: 'Ramesh', paymentMethod: 'Cheque' },
  { id: 'COL-004', date: '2023-11-26', customer: 'MODERN FOOTWEAR', amount: 25000.00, status: 'Validated', collectedBy: 'Suresh', paymentMethod: 'Cash' },
  { id: 'COL-005', date: '2023-11-25', customer: 'BATA INDIA LTD', amount: 150000.00, status: 'Synced', collectedBy: 'Ramesh', paymentMethod: 'Cheque' },
  { id: 'COL-006', date: '2023-11-24', customer: 'RELAXO FOOTWEARS', amount: 8000.00, status: 'Failed', collectedBy: 'Suresh', paymentMethod: 'UPI' },
  { id: 'COL-007', date: '2023-11-23', customer: 'LIBERTY SHOES', amount: 18000.00, status: 'Received', collectedBy: 'Ramesh', paymentMethod: 'Cash' },
];

// --- Helper Components ---
const StatusBadge = ({ status }: { status: CollectionStatus }) => {
  const statusStyles: Record<CollectionStatus, string> = {
    Pending: 'bg-gray-100 text-gray-800',
    Collected: 'bg-blue-100 text-blue-800',
    Received: 'bg-purple-100 text-purple-800',
    Validated: 'bg-green-100 text-green-800',
    Synced: 'bg-emerald-100 text-emerald-800',
    Failed: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const ActionButtons = ({ status, onValidate, onReject, onSync, onViewDetails, onCollectPayment }: { status: CollectionStatus, onValidate: () => void, onReject: () => void, onSync: () => void, onViewDetails: () => void, onCollectPayment: () => void }) => {
  if (status === 'Received') {
    return (
      <div className="flex items-center gap-2">
        <Button onClick={onValidate} size="sm" className="bg-green-500 hover:bg-green-600 h-8">
          <Check className="h-4 w-4 mr-1" /> Validate
        </Button>
        <Button onClick={onReject} size="sm" variant="destructive" className="h-8">
          <X className="h-4 w-4 mr-1" /> Reject
        </Button>
      </div>
    );
  }
  if (status === 'Validated') {
    return (
      <Button onClick={onSync} size="sm" className="bg-blue-500 hover:bg-blue-600 h-8">
        Sync to Tally
      </Button>
    );
  }
  if (status === 'Pending') {
    return (
      <Button onClick={onCollectPayment} size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8">
        <Receipt className="h-4 w-4 mr-1" /> Collect Payment
      </Button>
    );
  }
  return <Button size="sm" variant="outline" className="h-8" onClick={onViewDetails}>View Details</Button>;
};

// --- Main Component ---
export default function CollectionLadger() {
  const [collections, setCollections] = useState(collectionData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<ReceiptDisplayDetails | null>(null);

  const pathname = usePathname();

  const filteredData = useMemo(() => {
    const pathSegments = pathname.split('/');
    const statusFilter = pathSegments.length > 2 ? pathSegments[2] : 'all';

    let data = collections;

    if (statusFilter && statusFilter !== 'all') {
      data = data.filter(entry => entry.status.toLowerCase() === statusFilter);
    }

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      data = data.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(lowercasedFilter)
        )
      );
    }
    return data;
  }, [searchTerm, pathname, collections]);

  const handleStatusChange = (id: string, newStatus: CollectionStatus) => {
    setCollections(currentCollections =>
      currentCollections.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleOpenModal = (collection: CollectionRecord) => {
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCollection(null);
  };

  const handleGenerateReceipt = (details: PaymentDetails) => {
    // 1. Update collection status to 'Collected'
    handleStatusChange(details.collectionId, 'Collected');

    // 2. Prepare details for the receipt preview
    const collection = collections.find(c => c.id === details.collectionId);
    if (collection) {
      setReceiptDetails({
        collectionId: details.collectionId,
        customer: collection.customer,
        collectedAmount: details.amount,
        paymentMethod: details.method,
        paymentRef: details.reference,
        collectedBy: collection.collectedBy,
        collectionDate: details.collectionDate,
        remarks: details.remarks,
      });
      setIsReceiptModalOpen(true);
    }

    toast.success(`Receipt for ${details.collectionId} generated successfully!`);
  };

  return (
    <div className="space-y-4">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-2 py-2 w-full border-green-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
          <File className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-emerald-800">{entry.customer}</h3>
                <StatusBadge status={entry.status} />
              </div>
              <p className="text-xs text-gray-500">{entry.id}</p>
            </div>

            <div className="p-4 space-y-3 text-sm flex-grow">
              <div className="flex items-center text-emerald-700">
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="font-semibold text-lg">₹{entry.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{entry.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>Collected by: {entry.collectedBy}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Tag className="h-4 w-4 mr-2" />
                <span>Method: {entry.paymentMethod}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <ActionButtons
                status={entry.status}
                onValidate={() => handleStatusChange(entry.id, 'Validated')}
                onReject={() => handleStatusChange(entry.id, 'Failed')}
                onSync={() => handleStatusChange(entry.id, 'Synced')}
                onViewDetails={() => handleOpenModal(entry)}
                onCollectPayment={() => handleOpenModal(entry)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Payment Collection Modal */}
      <PaymentCollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        collection={selectedCollection}
        onGenerateReceipt={handleGenerateReceipt}
      />

      <ReceiptPreviewModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        details={receiptDetails}
      />
    </div>
  );
}
