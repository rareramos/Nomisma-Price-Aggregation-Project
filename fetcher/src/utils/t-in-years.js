export default (expiry, today = new Date()) => {
  const date1 = typeof expiry === 'string' || (typeof expiry === 'number' && expiry > 0)
    ? new Date(expiry)
    : expiry;
  const date2 = typeof today === 'string' || (typeof today === 'number' && today > 0)
    ? new Date(today)
    : today;
  if (date1 instanceof Date && date2 instanceof Date) {
    return (
      parseFloat((date1 - date2) / (1000 * 60 * 60 * 24 * 365)).toFixed(8) * 1
    );
  }
  return 0;
};
