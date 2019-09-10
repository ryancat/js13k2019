function util_assignArr(...arrs) {
  if (arrs.length <= 1) {
    return arrs[0] || []
  }
  
  return arrs.reduce((arr1, arr2) => {
    arr2.forEach((element, index) => {
      if (typeof element !== 'undefined') {
        arr1[index] = element
      }
    });

    return arr1
  })
}