export default function ScheduleCell({ time, day, item, onClick, isOwner, selected }) {
  const currentUserID = parseInt(localStorage.getItem('userID'));
  const isAvailable = item?.available === 1 && item?.bookedByUserID !== currentUserID;
  const isBookedByCurrentUser = item?.available === 1 && item?.bookedByUserID === currentUserID
  const isBooked = item?.available === 0;
  const waitlistCount = item?.waitlist_count || 0;
  const hasBooking = item?.bookedByUserID != null;

  const handleClick = () => {
    if (onClick) {
      onClick({ time, day, item, isBookedByCurrentUser});
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        h-20 rounded-lg ${isOwner ? 'cursor-pointer' : 'cursor-pointer'} transition-all duration-200 transform 
        ${!item ? `${isOwner ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-100'} border-2 border-dashed border-gray-300` : ''}
        ${isAvailable ? `${isOwner ? 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600' : 'bg-gradient-to-br from-green-400 to-emerald-500'} shadow-lg border-2 border-green-400` : ''}
        ${isBooked ? `${isOwner ? 'bg-gradient-to-br from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600' : 'bg-gradient-to-br from-red-400 to-rose-500'} shadow-lg border-2 border-red-400` : ''}
		${isBookedByCurrentUser ? `bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 shadow-lg border-2 border-blue-400` : ''}
        ${!isOwner && selected ? 'ring-4 ring-indigo-400 scale-[1.02]' : ''}
        ${isOwner ? '' : 'opacity-95'}
        flex items-center justify-center group relative overflow-hidden
      `}
    >
      {/* Shimmer effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 ${isOwner ? 'group-hover:translate-x-full transition-transform duration-1000' : ''}`}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
		{waitlistCount > 0 && (
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-300 border border-yellow-500 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
               In Queue: {waitlistCount}
             </div>
        )}
		{hasBooking && (
             <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-indigo-100 border border-indigo-300 text-indigo-900 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md z-20 whitespace-nowrap">
               Booked by userID: {item.bookedByUserID}
             </div>
        )}
        {!item && isOwner && (
          <div className="flex flex-col items-center">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Make it busy</span>
          </div>
        )}
        
          {isAvailable && (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {isOwner ? (
              <>
                <span className="text-xs font-bold text-white mt-1 drop-shadow group-hover:hidden">Available</span>
                <span className="text-xs font-bold text-white mt-1 drop-shadow hidden group-hover:block">Make it busy</span>
              </>
            ) : (
              <span className="text-xs font-bold text-white mt-1 drop-shadow">Available</span>
			  
            )}
          </div>
        )}
        
          {isBooked && (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-white mt-1 drop-shadow">Busy</span>
          </div>
        )}
		
		{isBookedByCurrentUser && (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-white mt-1 drop-shadow group-hover:hidden">My Slot</span>
            <span className="text-xs font-bold text-white mt-1 drop-shadow hidden group-hover:block">Cancel?</span>
          </div>
        )}

        {!isOwner && !item && (
          <span className="text-[11px] text-gray-500">No slot</span>
        )}
      </div>
    </div>
  );
}
