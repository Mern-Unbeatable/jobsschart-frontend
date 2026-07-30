import React, { memo, useMemo, useState } from 'react';
import { Calendar, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetMonthlyInvoicesQuery } from '../../../../../features/api/consultantApi';
import { downloadWithAuth } from '../../../../../utils/downloadWithAuth';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

function buildYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 5; y -= 1) {
    years.push(y);
  }
  return years;
}

const InvoicesSection = memo(() => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [downloadingKey, setDownloadingKey] = useState(null);

  const { data: invoices = [], isLoading } = useGetMonthlyInvoicesQuery();
  const yearOptions = useMemo(() => buildYearOptions(), []);

  const invoiceByKey = useMemo(() => {
    const map = new Map();
    invoices.forEach((inv) => map.set(`${inv.year}-${inv.month}`, inv));
    return map;
  }, [invoices]);

  const selectedKey = `${selectedYear}-${selectedMonth}`;
  const selectedInvoice = invoiceByKey.get(selectedKey);
  const selectedLabel = `${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`;

  const handleDownload = async (year, month, label) => {
    const key = `${year}-${month}`;
    setDownloadingKey(key);
    try {
      const filename = `Illorac-Invoice-${year}-${String(month).padStart(2, '0')}.pdf`;
      await downloadWithAuth(
        `/consultants/me/invoices/${year}/${month}/download`,
        filename
      );
      toast.success(`Downloaded invoice for ${label}`);
    } catch (err) {
      const message = err?.message || 'Failed to download invoice';
      if (message.toLowerCase().includes('not found')) {
        toast.error(`No invoice for ${label}. You had no earnings that month.`);
      } else {
        toast.error(message);
      }
    } finally {
      setDownloadingKey(null);
    }
  };

  const isDownloadingSelected = downloadingKey === selectedKey;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Monthly Invoices</h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose any month from the past 5 years to download your earnings invoice as PDF.
      </p>

      {/* Month / year picker */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 sm:p-5 mb-6">
        <div className="flex items-center gap-2 mb-4 text-[#6E35AE]">
          <Calendar size={18} />
          <span className="text-sm font-semibold">Select invoice period</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Year</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#6E35AE] focus:outline-none focus:ring-2 focus:ring-[#6E35AE]/20"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#6E35AE] focus:outline-none focus:ring-2 focus:ring-[#6E35AE]/20"
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-medium text-gray-800">{selectedLabel}</p>
            {selectedInvoice ? (
              <p className="text-sm text-gray-500">
                Earnings: €{Number(selectedInvoice.total || 0).toFixed(2)}
              </p>
            ) : (
              <p className="text-sm text-amber-600">No earnings recorded for this month</p>
            )}
          </div>

          <button
            type="button"
            disabled={isDownloadingSelected || !selectedInvoice}
            onClick={() => handleDownload(selectedYear, selectedMonth, selectedLabel)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6E35AE] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5c2d94] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isDownloadingSelected ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Download PDF
          </button>
        </div>
      </div>

      {/* Quick access: months with earnings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Your invoice history</h3>
        {isLoading ? (
          <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
        ) : invoices.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No invoices yet. After you earn from sessions, each month will appear here for quick download.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {invoices.map((inv) => {
              const key = `${inv.year}-${inv.month}`;
              const isDownloading = downloadingKey === key;
              const isSelected = key === selectedKey;

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-[#6E35AE]/30 bg-[#6E35AE]/5'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear(inv.year);
                      setSelectedMonth(inv.month);
                    }}
                    className="text-left flex-1 min-w-0"
                  >
                    <p className="font-medium text-gray-800">{inv.label}</p>
                    <p className="text-sm text-gray-500">€{Number(inv.total || 0).toFixed(2)}</p>
                  </button>
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() => handleDownload(inv.year, inv.month, inv.label)}
                    className="flex items-center gap-1.5 text-sm text-[#6E35AE] font-semibold hover:underline disabled:opacity-50 shrink-0 ml-3"
                  >
                    {isDownloading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    PDF
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

InvoicesSection.displayName = 'InvoicesSection';
export default InvoicesSection;
