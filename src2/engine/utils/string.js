const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

/**
 * Get an array of strings based on given string and options
 * @param {String} str - string to wrap
 * @param {Object} options
 * @param {Number} options.maxLineNum - maximum line number to wrapped to
 * @param {Number} options.maxWrappedWidth - maximum wrapped width
 * @param {Number} options.maxWrappedHeight - maximum wrapped height
 * @param {String} options.exceedingLine - 'first' or 'last'
 * @param {String} options.fontFamily - Default to Theme.fontFamily
 * @param {Number} options.fontSize - Default to Theme.labelFontSize
 * @param {String} options.fontStyle - Default to 'normal'
 * @param {String} options.fontWeight - Default to 'normal'
 */
export function getWrappedStrings(str, options) {
  var results = [],
    lineNum = 0,
    line,
    maxLineNum

  if (typeof str !== 'string') {
    return [str]
  }

  if (str === '') {
    return ['']
  }

  options = options || {}
  options.maxLineNum = options.maxLineNum > 0 ? options.maxLineNum : 1
  options.exceedingLine = options.exceedingLine || 'last'
  options.fontFamily = options.fontFamily || 'Roboto'
  options.fontSize = options.fontSize || '20'
  options.fontStyle = options.fontStyle || 'normal'
  options.fontWeight = options.fontWeight || 'normal'
  options.maxWrappedWidth =
    options.maxWrappedWidth >= 0 ? options.maxWrappedWidth : Infinity
  options.maxWrappedHeight =
    options.maxWrappedHeight >= 0
      ? Math.max(options.maxWrappedHeight, options.fontSize)
      : Infinity

  maxLineNum = Math.min(
    options.maxLineNum,
    Math.floor(options.maxWrappedHeight / options.fontSize)
  )

  while (lineNum < maxLineNum && str.length > 0) {
    if (options.exceedingLine === 'first') {
      if (lineNum === maxLineNum - 1) {
        // Just prepend all string
        results.unshift(str)
        break
      }

      line = globStringByWidth(str, options.maxWrappedWidth, {
        fromDirection: 'right',
        fontFamily: options.fontFamily,
        fontSize: options.fontSize,
        fontStyle: options.fontStyle,
        fontWeight: options.fontWeight,
      })
      if (line.length > 0) {
        results.unshift(line)
        str = str.slice(0, str.length - line.length).trim()
      }
    } else {
      if (lineNum === maxLineNum - 1) {
        // Just append all string
        results.push(str)
        break
      }

      line = globStringByWidth(str, options.maxWrappedWidth, {
        fromDirection: 'left',
        fontFamily: options.fontFamily,
        fontSize: options.fontSize,
        fontStyle: options.fontStyle,
        fontWeight: options.fontWeight,
      })
      if (line.length > 0) {
        results.push(line)
        str = str.slice(line.length).trim()
      }
    }

    lineNum++
  }

  return results
}

/**
 * Get a substring from string of width no more than given max width
 * @param {String} str - string to get substring from
 * @param {Number} maxWidth - the width limitation of substring
 * @param {String} options
 * @param {String} options.fromDirection - 'left' or 'right'
 * @param {String} options.fontFamily - Default to Theme.fontFamily
 * @param {Number} options.fontSize - Default to Theme.labelFontSize
 * @param {String} options.fontStyle - Default to 'normal'
 * @param {String} options.fontWeight - Default to 'normal'
 */
function globStringByWidth(str, maxWidth, options) {
  var start = 0,
    end,
    mid,
    words,
    pivot,
    pivotWidth

  if (str === '' || typeof str !== 'string') {
    return ''
  }

  maxWidth = maxWidth || Infinity
  options = options || {}
  options.fromDirection = options.fromDirection || 'left'
  options.fontFamily = options.fontFamily || Theme.fontFamily
  options.fontSize = options.fontSize || Theme.labelFontSize
  options.fontStyle = options.fontStyle || 'normal'
  options.fontWeight = options.fontWeight || 'normal'

  if (
    getWidth(
      str,
      options.fontFamily,
      options.fontSize,
      options.fontStyle,
      options.fontWeight
    ) <= maxWidth
  ) {
    return str
  }

  words = str.split(' ')
  end = words.length

  // Binary search on substring that fits in maxWidth
  // Note that the substring left to start will always be shorter, and
  // the substring right to end will always be shorter too.
  while (start <= end) {
    mid = Math.floor((start + end) / 2)
    pivot =
      options.fromDirection === 'right'
        ? words.slice(mid).join(' ')
        : words.slice(0, mid).join(' ')
    pivotWidth = getWidth(
      pivot,
      options.fontFamily,
      options.fontSize,
      options.fontStyle,
      options.fontWeight
    )

    if (pivotWidth < maxWidth) {
      if (options.fromDirection === 'right') {
        if (end === mid) {
          // We already checked the mid point in this iteration,
          // and start and end are together. We can stop here.
          break
        }

        end = mid
      } else {
        if (start === mid) {
          // We already checked the mid point in this iteration,
          // and end is one word away. We can stop here.
          break
        }

        start = mid
      }
    } else if (pivotWidth > maxWidth) {
      if (options.fromDirection === 'right') {
        if (start === mid) {
          // We already checked the mid point in this iteration,
          // and end is one word away. We can stop here.
          break
        }

        start = mid
      } else {
        if (end === mid) {
          // We already checked the mid point in this iteration,
          // and start and end are together. We can stop here.
          break
        }

        end = mid
      }
    } else {
      if (options.fromDirection === 'right') {
        end = mid
      } else {
        start = mid
      }
      // We reach a point where mid point is perfectly match maxWidth.
      // We can stop here.
      break
    }
  }

  return pivot
}

function getWidth(str, fontFamily, fontSize, fontStyle, fontWeight) {
  if (!fontStyle) {
    fontStyle = 'normal'
  }

  if (!fontWeight) {
    fontWeight = 'normal'
  }

  // first, get normalized font size using 12 px.  This enables us
  // to cache the text width
  // var normalizedWidth = Cache.get('textWidths-' + fontStyle + '-12px', str, function() {
  //   context.font = fontStyle + ' 12px ' + fontFamily;
  //   return context.measureText(str).width;
  // });

  //return normalizedWidth * fontSize / 12;

  context.font =
    fontStyle + ' ' + fontWeight + ' ' + fontSize + 'px ' + fontFamily
  // measureText - it is also overridden by mobile implementations,
  //               that use the 2nd and 3rd arguments.
  return context.measureText(str, fontFamily, fontSize).width
}
