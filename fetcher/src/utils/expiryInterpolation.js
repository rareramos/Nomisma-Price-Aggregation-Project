export default ({ expiry, marginCcy, map }) => {
  let result = 0;
  const expiryDates = Object.values(map).map(row => ({
    ...row,
    expiryDate: Date.parse(row.expiry) / 1000,
  }));
  const expiryDate = Date.parse(expiry) / 1000;
  expiryDates.forEach((row, index, all) => {
    const expDn = row.expiryDate;
    const expUp = (all[index + 1] && all[index + 1].expiryDate) || 0;
    if (expDn && expUp && expiryDate > expDn && expiryDate < expUp) {
      const vDn = row[marginCcy];
      const vUp = all[index + 1][marginCcy];
      result = vDn + ((vUp - vDn) * (expiryDate - expDn)) / (expUp - expDn);
    }
  });
  return result;
};
