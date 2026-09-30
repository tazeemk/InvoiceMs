"use client";

import { useState, useEffect } from 'react';
import { IndianRupee, CreditCard, FileText, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collectPayment } from '@/service/payment';
import { Invoice } from '@/impData/types';

const PAYMENT_METHODS = [
  { value: 'Cash',   label: 'Cash'   },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'UPI',    label: 'UPI'    },
  { value: 'NEFT',   label: 'NEFT'   },
  { value: 'RTGS',   label: 'RTGS'   },
];

export type CollectionRecord = {
  id:                  string;
  customer:            string;
  amount:              number;
  previousOutstanding: number;
};

export type PaymentDetails = {
  collectionId:   string;
  amount:         string;
  method:         string;
  reference:      string;
  remarks:        string;
  location:       string;
  collectionDate: string;
  collectedBy?:   string;
  updatedInvoice: Invoice;   // real API response
};

interface PaymentCollectionModalProps {
  isOpen:            boolean;
  onClose:           () => void;
  collection:        CollectionRecord | null;
  onGenerateReceipt: (details: PaymentDetails) => void;
}

export default function PaymentCollectionModal({
  isOpen,
  onClose,
  collection,
  onGenerateReceipt,
}: PaymentCollectionModalProps) {
  const [paymentAmount,       setPaymentAmount]       = useState('');
  const [paymentMethod,       setPaymentMethod]       = useState('Cash');
  const [paymentRef,          setPaymentRef]          = useState('');
  const [remarks,             setRemarks]             = useState('');
  const [location,            setLocation]            = useState('');
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [locationError,       setLocationError]       = useState('');
  const [isProcessing,        setIsProcessing]        = useState(false);
  const [error,               setError]               = useState('');

  useEffect(() => {
    if (isOpen && collection) {
      setPaymentAmount('');
      setPaymentMethod('Cash');
      setPaymentRef('');
      setRemarks('');
      setLocation('');
      setError('');
      setIsProcessing(false);
      setIsCapturingLocation(false);
      setLocationError('');
    }
  }, [isOpen, collection]);

  if (!collection) return null;

  // ── Real API call ─────────────────────────────────────────────────────────
  const handleCollectClick = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (amount > collection.amount) {
      setError(`Amount cannot exceed outstanding ₹${collection.amount.toFixed(2)}.`);
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const updatedInvoice = await collectPayment(collection.id, {
        collectionAmount:  paymentAmount,
        paymentMethod,
        collectionAddress: location,
        remarks,
      });

      // Only opens receipt on real API success
      // collectedBy: read from your auth context/localStorage — adjust as per your auth setup
      const loggedInUser =
        (typeof window !== 'undefined' && (
          (window as any).__AUTH_USER__?.username ||
          localStorage.getItem('loggedInUser') ||
          localStorage.getItem('username')
        ));

      onGenerateReceipt({
        collectionId:   collection.id,
        amount:         paymentAmount,
        method:         paymentMethod,
        reference:      paymentRef,
        remarks,
        location,
        collectionDate: new Date().toLocaleString('en-IN'),
        collectedBy:    loggedInUser,
        updatedInvoice,
      });

      onClose();
    } catch (err: any) {
      console.error('collectPayment error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Payment collection failed. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Payment collection failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── GPS Capture ───────────────────────────────────────────────────────────
  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    setIsCapturingLocation(true);
    setLocationError('');
    setLocation('Capturing…');

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'PaymentCollectionApp/1.0' } }
          );
          const data = await res.json();
          setLocation(data?.display_name ?? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLocationError('');
        } catch {
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLocationError('Address lookup failed — showing coordinates.');
        } finally {
          setIsCapturingLocation(false);
        }
      },
      (err) => {
        setLocation('');
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Enable it in browser settings.'
            : `Location error: ${err.message}`
        );
        setIsCapturingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-emerald-800">
            Collect Payment
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="font-semibold text-gray-700">{collection.customer}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Outstanding:{' '}
                <span className="text-red-600 font-semibold">
                  ₹{collection.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-2">

          {/* Amount */}
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              placeholder="Amount Collecting *"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="pl-9"
              min={0}
              max={collection.amount}
              step="0.01"
            />
          </div>

          {/* Payment Method */}
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full pl-9">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reference No. */}
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Reference No. (Cheque / UPI / NEFT)"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Remarks */}
          <textarea
            placeholder="Remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />

          {/* GPS Location */}
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Collection location (GPS)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCaptureLocation}
              disabled={isCapturingLocation}
              className="flex-shrink-0"
            >
              {isCapturingLocation
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : 'Capture'
              }
            </Button>
          </div>
          {locationError && <p className="text-xs text-amber-600">{locationError}</p>}

          {/* API / Validation Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 min-w-[140px]"
            onClick={handleCollectClick}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </span>
            ) : (
              'Collect Payment'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}