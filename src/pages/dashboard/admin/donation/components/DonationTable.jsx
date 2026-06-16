import React, { memo } from 'react';
import { MoreVertical } from 'lucide-react';
import ActionsDropdown from './ActionsDropdown';

const DonationTable = memo(({
  paginated,
  TABLE_COLS,
  DONOR_TYPE_STYLES,
  anchorRefs,
  handleToggle,
  openId,
  handleClose,
  handleSeeDetails,
  handleDelete,
  children
}) => {
  return (
    <div
      className='bg-white rounded-xl border border-black/10 overflow-hidden'
      data-reveal
    >
      {/* Desktop view */}
      <div className='hidden sm:block overflow-x-auto'>
        {/* Header */}
        <div className='bg-[#F6FBFF] flex items-center px-4'>
          {TABLE_COLS.map((col) => (
            <div
              key={col.label}
              className={`flex items-center px-2.5 py-3 ${col.width}`}
            >
              <p className='text-base text-black font-normal whitespace-nowrap'>
                {col.label}
              </p>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className='flex flex-col'>
          {paginated.length === 0 ? (
            <p className='px-4 py-12 text-center text-base text-[#8A8A8A]'>
              No donations found.
            </p>
          ) : (
            paginated.map((donor) => (
              <div
                key={donor.id}
                className='flex items-center px-4 border-b border-[#E4E4E4] last:border-b-0'
              >
                <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                  {donor.name}
                </div>
                <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C] break-all'>
                  {donor.email}
                </div>
                <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                  {donor.phone}
                </div>
                <div
                  className={`flex-1 px-2.5 py-4 text-base font-normal ${
                    DONOR_TYPE_STYLES[donor.type] ?? 'text-[#0C0C0C]'
                  }`}
                >
                  {donor.type}
                </div>
                <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                  {donor.amount}
                </div>
                <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                  {donor.date}
                </div>
                <div className='w-20 px-2.5 py-4 flex items-center justify-center'>
                  <button
                    type='button'
                    ref={(el) => {
                      anchorRefs.current[donor.id] = el;
                    }}
                    onClick={() => handleToggle(donor.id)}
                    aria-label={`Actions for ${donor.name}`}
                    className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#333]'
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openId === donor.id && (
                    <ActionsDropdown
                      anchorEl={anchorRefs.current[donor.id]}
                      onClose={handleClose}
                      onSeeDetails={() => handleSeeDetails(donor.id)}
                      onDelete={() => handleDelete(donor.id)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile view */}
      <div className='sm:hidden divide-y divide-gray-100'>
        {paginated.length === 0 ? (
          <p className='py-12 text-center text-base text-[#8A8A8A]'>
            No donations found.
          </p>
        ) : (
          paginated.map((donor) => (
            <div
              key={`m-${donor.id}`}
              className='px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors'
            >
              <div className='min-w-0'>
                <p className='text-base font-semibold text-[#0C0C0C]'>
                  {donor.name}
                </p>
                <p className='text-base text-[#0C0C0C] break-all'>
                  {donor.email}
                </p>
                <p className='text-base text-[#0C0C0C]'>{donor.phone}</p>
                <p
                  className={`text-base mt-0.5 ${
                    DONOR_TYPE_STYLES[donor.type] ?? 'text-[#0C0C0C]'
                  }`}
                >
                  {donor.type}
                </p>
                <p className='text-base text-[#0C0C0C]'>{donor.amount}</p>
                <p className='text-base text-[#0C0C0C]'>{donor.date}</p>
              </div>
              <div className='shrink-0'>
                <button
                  type='button'
                  ref={(el) => {
                    anchorRefs.current[`m-${donor.id}`] = el;
                  }}
                  onClick={() => handleToggle(`m-${donor.id}`)}
                  aria-label={`Actions for ${donor.name}`}
                  className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#333]'
                >
                  <MoreVertical size={18} />
                </button>
                {openId === `m-${donor.id}` && (
                  <ActionsDropdown
                    anchorEl={anchorRefs.current[`m-${donor.id}`]}
                    onClose={handleClose}
                    onSeeDetails={() => handleSeeDetails(donor.id)}
                    onDelete={() => handleDelete(donor.id)}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {children}
    </div>
  );
});

DonationTable.displayName = 'DonationTable';

export default DonationTable;
