
export const chunkArr = (arr, chunkSize) => new Array(
  Math.ceil(
    arr.length / chunkSize,
  ),
)
  .fill()
  .map(
    (
      _,
      i,
    ) => arr.slice(
      i * chunkSize,
      i * chunkSize + chunkSize,
    ),
  );
