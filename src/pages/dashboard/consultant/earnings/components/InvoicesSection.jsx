import React, { memo } from 'react';
import { Download } from 'lucide-react';
import { useGetMonthlyInvoicesQuery } from '../../../../../features/api/consultantApi';

const InvoicesSection = memo(() => {
  const { data: invoices = [], isLoading } = useGetMonthlyInvoicesQuery();
  const apiBase = process.env.REACT_APP_API_BASE_URL || '';

  const handleDownload = (year, month) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    window.open(
      `${apiBase}/consultants/me/invoices/${year}/${month}/download?token=${token}`,
      '_blank'
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Monthly Invoices</h2>
      <p className="text-sm text-gray-500 mb-6">Download invoices for the past 5 years</p>
      {isLoading ? (
        <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
      ) : invoices.length === 0 ? (
        <p className="text-gray-400 text-sm">No invoices available yet.</p>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={`${inv.year}-${inv.month}`}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">{inv.label}</p>
                <p className="text-sm text-gray-500">€{inv.total?.toFixed(2)}</p>
              </div>
              <button type="button" onClick={() => handleDownload(inv.year, inv.month)}
                className="flex items-center gap-1.5 text-sm text-[#6E35AE] font-semibold hover:underline">
                <Download size={16} /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

InvoicesSection.displayName = 'InvoicesSection';
export default InvoicesSection;
