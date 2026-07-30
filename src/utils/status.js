export const toDisplayStatus = (raw = "") => {
  switch (raw?.toUpperCase()) {
    case "ONLINE":
      return "Online";
    case "BUSY":
      return "Busy";
    default:
      return "Offline";
  }
};

export const getStatusBadgeStyle = (display) => {
  switch (display) {
    case "Online":
      return "bg-green-500/90 text-white";
    case "Busy":
      return "bg-yellow-500/90 text-white";
    default:
      return "bg-red-500/90 text-white";
  }
};

export const getStatusStyle = (display) => {
  switch (display) {
    case "Online":
      return "bg-[#05BC27] text-white";
    case "Busy":
      return "bg-yellow-500/90 text-white";
    default:
      return "bg-red-500 text-white";
  }
};
