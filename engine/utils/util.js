function util_assignArr(...arrs) {
  if (arrs.length <= 1) {
    return arrs[0] || []
  }

  return arrs.reduce((arr1, arr2) => {
    arr2.forEach((element, index) => {
      if (typeof element !== 'undefined') {
        arr1[index] = element
      }
    })

    return arr1
  })
}

function throttle(func, limit) {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
