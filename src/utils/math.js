// Adding binary string and return binary string
export function addBinary(a = '0', b = '0') {
  let sum10Base = parseInt(a, 2) + parseInt(b, 2)
  return (sum10Base >>> 0).toString(2)
}
