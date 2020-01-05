export const liveDataTopic = handler => (payload) => {
  handler.emit('update-live', payload);
};

// export const quasiLiveDataTopic = handler => payload => {
//   handler.emit('update-quasi-live', payload);
// };
