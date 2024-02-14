'use strict'
/**
*  data - initial parse
*
*
* @class DataParse
* @package    BeeBeeParse
* @copyright  Copyright (c) 2023 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

class DataParse {

  constructor() {
  }

  /**
  * look for numbers
  * @method numberParse
  *
  */
  numberParse = function (input) {
    let dataNumbers = this.parseStringToNumbers(input) // [2, 4, 6]
    // produce label data some array length if not provided
    let dataLabel = this.formLabel(dataNumbers)
    // success number extract?
    let numberSuccess = {}
    if (dataNumbers.length > 0) {
      numberSuccess.status = true
      numberSuccess.data = dataNumbers
      numberSuccess.label = dataLabel
    } else {
      numberSuccess.status = false
      numberSuccess.data = input
      numberSuccess.label = []
    }
    return numberSuccess
  }

  /**
  * take text string and produce number array
  * @method parseStringToNumbers
  *
  */
  parseStringToNumbers = function (string) {
    const numericStrings = []
    const strings = string.split(' ').filter(el => typeof el !== 'number')
    strings.forEach(string => {
      if (/^[-+]?[0-9]+$/.test(string)) {
        numericStrings.push(string)
      }
    })
    return numericStrings
  }

  /**
  * take number array and provide number arry by count
  * @method formLabel
  *
  */
  formLabel = function (numArr) {
    let label = []
    let count = 1
    for (let item of numArr) {
      label.push(count.toString())
      count++
    }
    return label
  }

}

export default DataParse