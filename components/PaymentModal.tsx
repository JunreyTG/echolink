import React, { useState } from 'react';
import { CloseIcon, CreditCardIcon, CalendarIcon, LockIcon, UserIcon, SparklesIcon } from './Icons';

interface PaymentModalProps {
  planName: string;
  price: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ planName, price, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
        // Remove non-digits and format as XXXX XXXX XXXX XXXX
        formattedValue = value.replace(/\D/g, '').substring(0, 16);
        formattedValue = formattedValue.replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
        // Remove non-digits and format as MM/YY
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
        if (formattedValue.length > 2) {
            formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
        }
    } else if (name === 'cvc') {
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!cardDetails.name.trim() || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        setError('Please fill in all fields.');
        return;
    }
    if (cardDetails.number.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number.');
        return;
    }
     if (cardDetails.expiry.length < 5) {
        setError('Please enter a valid expiry date.');
        return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000); // Simulate network request
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white flex items-center">
                    <SparklesIcon className="h-6 w-6 mr-2 text-purple-500"/>
                    Upgrade to Premium
                </h2>
                <p className="text-gray-600 dark:text-gray-400">You're subscribing to the <span className="font-semibold text-gray-800 dark:text-gray-200">{planName}</span> plan for <span className="font-semibold text-gray-800 dark:text-gray-200">{price}</span>.</p>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400" aria-label="Close">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="card-name" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Cardholder Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input id="card-name" name="name" type="text" value={cardDetails.name} onChange={handleInputChange} placeholder="John Doe" className="w-full bg-gray-100 dark:bg-[#202225] p-3 pl-10 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label htmlFor="card-number" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Card Number</label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input id="card-number" name="number" type="text" value={cardDetails.number} onChange={handleInputChange} placeholder="0000 0000 0000 0000" className="w-full bg-gray-100 dark:bg-[#202225] p-3 pl-10 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="card-expiry" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Expiry Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input id="card-expiry" name="expiry" type="text" value={cardDetails.expiry} onChange={handleInputChange} placeholder="MM/YY" className="w-full bg-gray-100 dark:bg-[#202225] p-3 pl-10 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="card-cvc" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">CVC</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input id="card-cvc" name="cvc" type="text" value={cardDetails.cvc} onChange={handleInputChange} placeholder="123" className="w-full bg-gray-100 dark:bg-[#202225] p-3 pl-10 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
          </div>
          <div className="p-4 bg-gray-100 dark:bg-[#292b2f] rounded-b-lg">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : `Pay ${price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
