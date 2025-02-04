'use strict'
import { Info } from 'luxon'
/**
*  FlakeUtility
*
*
* @class FlakeUtility
* @package    FlakeUtility
* @copyright  Copyright (c) 2025 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'
import hashObject from 'object-hash'

class FlakeUtility {

  constructor() {
    // super()
    this.trackGaia = []
  }

  /**
  * match flake to another
  * @method flakeMatch
  *
  */
  cueMatch = function (cueIn) {
    let matchC = {}
    return matchC
  }

  /**
  * prepare flake given cue active
  * @method prepareFlakeCues
  *
  */
  prepareFlakeCues = function (cueInfo) {
    let flakeCues = {}
    // let flakesListTest = [ { cue: 1, name: 'posture', cuecolor: 'red' }, { cue: 2, name: 'sleep', cuecolor: 'orange' },{ cue: 3, name: 'heart', cuecolor: 'green' }, { cue: 4, name: 'courage', cuecolor: 'green' }, { cue: 5, name: 'sleep', cuecolor: 'orange' }, { cue: 6, name: 'posture', cuecolor: 'red' }]
    // how many cues and how many bentoboxes per cue?  How to rate bentoboxes or besearch within?  Use SafeFlowECS or summaary saved.  Need to check state of besearch cyccles and state in done, inprogress or ongoing
    flakeCues = [{ cue: cueInfo.key, name: 'in-progress', cuecolor: 'purple', branch: cueInfo.key, branchname: cueInfo.value.concept.name}]
    return flakeCues
  }
  
  /**
  * prepare flake given cue active
  * @method prepareFlakeCuesMarkers
  *
  */
  prepareFlakeCuesMarkers = function (cueContract, markerInfo) {
    let markerFlake = {}
    let flakesList = []
    for (let marker of markerInfo) {
      let hexPrep = this.prepareHexFlake(cueContract, marker[0])
      flakesList.push(hexPrep)
      markerFlake[hexPrep.cue] = flakesList
      flakesList = []
    }
    // how many cues and how many bentoboxes per cue?  How to rate bentoboxes or besearch within?  Use SafeFlowECS or summaary saved.  Need to check state of besearch cyccles and state in done, inprogress or ongoing
    return markerFlake
  }

  /**
  * format hex flake based on bentobox decision state
  * @method prepareHexFlake
  *
  */
  prepareHexFlake = function (cueCont, hexInfo) {
    let hexFlake = {}
    hexFlake.branch = cueCont.key
    hexFlake.branchname = hexInfo.value.concept.name
    hexFlake.cue = hexInfo.key
    hexFlake.name = hexInfo.value.concept.name
    hexFlake.cuecolor = 'green'
    hexFlake.bentobox = hexInfo.key
    return hexFlake
  }

  /**
  * nothing for this inform with clear hex 
  * @method prepareHexFlake
  *
  */
  prepareHexFlakeEmpty = function (cueCont, hexInfo) {
    let hexFlake = {}
    hexFlake.branch = cueCont.key
    hexFlake.branchname = cueCont?.value?.concept?.name
    hexFlake.cue = hexInfo.key
    hexFlake.name = 'empty'
    hexFlake.cuecolor = 'white'
    hexFlake.bentobox = hexInfo
    return hexFlake
  }

}

  export default FlakeUtility