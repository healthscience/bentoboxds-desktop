'use strict'
/**
*  Space ie. cue content utility
*
*
* @class SpaceContentutil
* @package    SpaceContentutil
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'
import hashObject from 'object-hash'

class SpaceContentutil {

  constructor() {
    // super()
  }

  /**
  * n=1 take private id and match to public genesis ID
  * @method n1Match
  *
  *
  */
  n1Match = function (content) {
    let n1Content = content
    return n1Content
  }

  /**
  * media per space
  * @method mediaMatch
  *
  *
  */
  mediaMatch = function (content) {
    let mediaContent = content
    return mediaContent
  }

  /**
  * research content
  * @method researchMatch
  *
  *
  */
  researchMatch = function (content) {
    let researchContent = content
    return researchContent
  }

  /**
  * marker content
  * @method markerMatch
  *
  *
  */
  markerMatch = function (content) {
    let markerContent = content
    return markerContent
  }

  /**
  * product Match
  * @method productMatch
  *
  *
  */
  productMatch = function (content) {
    let productContent = content
    return productContent
  }

}

export default SpaceContentutil