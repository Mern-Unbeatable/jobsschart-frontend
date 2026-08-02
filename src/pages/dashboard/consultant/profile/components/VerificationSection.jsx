import React, { useState, useEffect } from 'react';
import { ShieldCheck, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUpdateVerificationInfoMutation } from '../../../../../features/api/consultantApi';
import {
  getApiErrorMessage,
  getApiFieldErrors,
  validateIban,
  validateBsn,
  validateKvk,
} from '../../../../../utils/apiErrorUtils';

const EMPTY_FORM = {
  bsnNumber: '',
  kvkNumber: '',
  cityOfResidence: '',
  businessBankAccount: '',
};

export default function VerificationSection({ profile }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);
  const [updateVerification, { isLoading }] = useUpdateVerificationInfoMutation();

  useEffect(() => {
    if (!profile) return;
    setForm({
      bsnNumber: profile.bsnNumber || '',
      kvkNumber: profile.kvkNumber || '',
      cityOfResidence: profile.cityOfResidence || '',
      businessBankAccount: profile.businessBankAccount || '',
    });
  }, [profile]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const errors = {};
    const bsnError = validateBsn(form.bsnNumber);
    const kvkError = validateKvk(form.kvkNumber);
    const ibanError = validateIban(form.businessBankAccount);

    if (bsnError) errors.bsnNumber = bsnError;
    if (kvkError) errors.kvkNumber = kvkError;
    if (!form.cityOfResidence?.trim()) errors.cityOfResidence = 'Please enter your city of residence.';
    if (ibanError) errors.businessBankAccount = ibanError;
    if (!idFrontFile && !profile?.idFrontUrl) {
      errors.idFrontUrl = 'Please upload the front of your ID document.';
    }
    if (!idBackFile && !profile?.idBackUrl) {
      errors.idBackUrl = 'Please upload the back of your ID document.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the highlighted fields before submitting.');
      return;
    }

    const fd = new FormData();
    fd.append('bsnNumber', form.bsnNumber.trim());
    fd.append('kvkNumber', form.kvkNumber.trim());
    fd.append('cityOfResidence', form.cityOfResidence.trim());
    fd.append('businessBankAccount', form.businessBankAccount.replace(/\s/g, '').toUpperCase());
    if (idFrontFile) fd.append('idFront', idFrontFile);
    if (idBackFile) fd.append('idBack', idBackFile);

    try {
      await updateVerification(fd).unwrap();
      toast.success('Verification submitted. An admin will review your documents shortly.');
      setIdFrontFile(null);
      setIdBackFile(null);
      setFieldErrors({});
    } catch (err) {
      const apiFieldErrors = getApiFieldErrors(err);
      if (Object.keys(apiFieldErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }));
      }
      toast.error(getApiErrorMessage(err, 'Failed to submit verification. Please check your details.'), {
        duration: 7000,
      });
    }
  };

  const status = profile?.verificationStatus || 'UNVERIFIED';
  const statusLabel = {
    UNVERIFIED: 'Not verified',
    PENDING: 'Under review',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected — please resubmit',
  }[status] || status;

  const statusColor = {
    UNVERIFIED: 'text-gray-600',
    PENDING: 'text-amber-600',
    VERIFIED: 'text-green-600',
    REJECTED: 'text-red-600',
  }[status] || 'text-gray-600';

  const inputClass = (field) =>
    `mt-1 h-10 w-full rounded-lg border px-3 text-sm ${
      fieldErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-[#6E35AE]" />
        <h3 className="text-lg font-semibold text-gray-900">Identity & Business Verification</h3>
      </div>

      <p className="text-sm text-gray-500">
        Status: <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
      </p>
      <p className="text-xs text-gray-400">
        Upload your ID and business details for payouts. Use a valid Dutch/EU IBAN (example: NL91ABNA0417164300).
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-gray-600">ID Front (passport / ID card) *</label>
            <label className={`mt-1 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 text-sm text-gray-500 hover:border-[#6E35AE] ${fieldErrors.idFrontUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
              <Upload size={16} />
              {idFrontFile ? idFrontFile.name : profile?.idFrontUrl ? 'Replace front image' : 'Choose image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setIdFrontFile(e.target.files?.[0] || null);
                  setFieldErrors((prev) => ({ ...prev, idFrontUrl: undefined }));
                }}
              />
            </label>
            {fieldErrors.idFrontUrl && <p className="mt-1 text-xs text-red-600">{fieldErrors.idFrontUrl}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">ID Back *</label>
            <label className={`mt-1 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 text-sm text-gray-500 hover:border-[#6E35AE] ${fieldErrors.idBackUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
              <Upload size={16} />
              {idBackFile ? idBackFile.name : profile?.idBackUrl ? 'Replace back image' : 'Choose image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setIdBackFile(e.target.files?.[0] || null);
                  setFieldErrors((prev) => ({ ...prev, idBackUrl: undefined }));
                }}
              />
            </label>
            {fieldErrors.idBackUrl && <p className="mt-1 text-xs text-red-600">{fieldErrors.idBackUrl}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">BSN (9 digits) *</label>
            <input
              type="text"
              maxLength={9}
              value={form.bsnNumber}
              onChange={(e) => handleChange('bsnNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="123456789"
              className={inputClass('bsnNumber')}
            />
            {fieldErrors.bsnNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.bsnNumber}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">KvK number (8 digits) *</label>
            <input
              type="text"
              maxLength={8}
              value={form.kvkNumber}
              onChange={(e) => handleChange('kvkNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="12345678"
              className={inputClass('kvkNumber')}
            />
            {fieldErrors.kvkNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.kvkNumber}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">City of residence *</label>
            <input
              type="text"
              value={form.cityOfResidence}
              onChange={(e) => handleChange('cityOfResidence', e.target.value)}
              className={inputClass('cityOfResidence')}
            />
            {fieldErrors.cityOfResidence && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.cityOfResidence}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Business bank account (IBAN) *</label>
            <input
              type="text"
              value={form.businessBankAccount}
              onChange={(e) => handleChange('businessBankAccount', e.target.value.toUpperCase())}
              placeholder="NL91ABNA0417164300"
              className={inputClass('businessBankAccount')}
            />
            {fieldErrors.businessBankAccount && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.businessBankAccount}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || status === 'VERIFIED'}
          className="rounded-lg bg-[#6E35AE] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? 'Submitting…' : status === 'VERIFIED' ? 'Already Verified' : 'Submit for Verification'}
        </button>
      </form>
    </div>
  );
}
