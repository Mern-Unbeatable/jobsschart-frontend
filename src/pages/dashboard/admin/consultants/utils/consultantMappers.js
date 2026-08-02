const API_ORIGIN = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1')
  .replace(/\/api\/v1\/?$/, '');

export function resolveAssetUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return `${API_ORIGIN}/${url}`;
}

export function mapBackendConsultant(c) {
  const specialization = Array.isArray(c.specialization) ? c.specialization : [];

  let status = 'Pending';
  if (c.user?.status === 'SUSPENDED' || c.user?.status === 'Suspended') {
    status = 'Suspended';
  } else if (c.isApproved) {
    status = 'Approved';
  }

  const name = c.user?.name || 'Consultant';

  return {
    id: c.id,
    userId: c.userId || c.user?.id,
    name,
    title: c.user?.bio || c.bio || 'Professional Consultant',
    email: c.user?.email || 'N/A',
    phone: c.user?.phone || 'N/A',
    address: c.user?.location || 'N/A',
    category: c.category || specialization[0] || 'Consultant',
    status,
    verificationStatus: c.verificationStatus || 'UNVERIFIED',
    avatar:
      c.user?.avatar
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E2AB0B&color=fff`,
    about: c.bio || 'No description available.',
    experience: { years: 'N/A', role: 'Consulting' },
    languages: ['English'],
    location: { place: c.user?.location || 'N/A', note: 'Remote and in-person' },
    expertise: specialization,
    availability: [{ days: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' }],
    idFrontUrl: c.idFrontUrl || null,
    idBackUrl: c.idBackUrl || null,
    bsnNumber: c.bsnNumber || null,
    kvkNumber: c.kvkNumber || null,
    cityOfResidence: c.cityOfResidence || null,
    businessBankAccount: c.businessBankAccount || null,
    raw: c,
  };
}
