"use client";

import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Type, MapPin, Loader2 } from 'lucide-react';
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

const paymentMethods = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'UPI', label: 'UPI' },
  { value: 'NEFT', label: 'NEFT' },
  { value: 'RTGS', label: 'RTGS' },
];

type CollectionRecord = {
  id: string;
  customer: string;
  amount: number;
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

interface PaymentCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionRecord | null;
  onGenerateReceipt: (details: PaymentDetails) => void;
}

export default function PaymentCollectionModal({ isOpen, onClose, collection, onGenerateReceipt }: PaymentCollectionModalProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentRef, setPaymentRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [location, setLocation] = useState('');
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && collection) {
      // Reset form when modal opens for a new collection
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

  const handleGenerateClick = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (amount > collection.amount) {
      setError(`Amount cannot exceed the outstanding amount of ₹${collection.amount.toFixed(2)}.`);
      return;
    }
    setError('');
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
    onGenerateReceipt({
      collectionId: collection.id,
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentRef,
      remarks: remarks,
      location: location,
      collectionDate: new Date().toLocaleString(),
    });
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    if (window.isSecureContext === false) {
      setLocationError('Geolocation is only available on secure (HTTPS) connections.');
      return;
    }

    setIsCapturingLocation(true);
    setLocationError('');
    setLocation('Capturing...');

navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'PaymentCollectionApp/1.0'
              }
            }
          );
          if (!response.ok) {
            throw new Error(`Reverse geocoding failed with status: ${response.status}`);
          }
          const data = await response.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
            setLocationError('');
          } else {
            throw new Error('Address not found in geocoding response.');
          }
        } catch (error: any) {
          console.error("Error fetching address: ", error);
          // Fallback to coordinates if address fetch fails
          setLocation(`Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`);
          setLocationError(`Address lookup failed. Showing coordinates instead.`);
        } finally {
          setIsCapturingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error: ", error);
        setLocation('Unable to retrieve location.');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Geolocation permission was denied. Please enable it in your browser settings.');
        } else {
          setLocationError(`Geolocation error: ${error.message}`);
        }
        setIsCapturingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Collect Payment for {collection.customer}</AlertDialogTitle>
          <AlertDialogDescription>
            Outstanding Amount: ₹{collection.amount.toFixed(2)}. Enter the details for the payment being collected.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input id="amount" type="number" placeholder="Amount Collecting *" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="pl-10" />
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full pl-10">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input id="reference" placeholder="Payment Reference (Cheque No, UPI ID, etc.)" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} className="pl-10" />
          </div>

     
          <div className="flex items-center gap-3">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="location" placeholder="GPS Location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" size="sm" onClick={handleCaptureLocation} disabled={isCapturingLocation}>
              {isCapturingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Capture'}
            </Button>
          </div>
          {locationError && <p className="text-sm text-red-500">{locationError}</p>}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
          )}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 w-32"
            onClick={handleGenerateClick}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Collect Payment'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}