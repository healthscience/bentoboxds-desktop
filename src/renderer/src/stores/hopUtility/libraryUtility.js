'use strict'
/**
*  LibraryUtility
*
*
* @class LibraryUtility
* @package    LibraryUtility
* @copyright  Copyright (c) 2023 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'

class LibraryUtility { //  extends EventEmitter {

  constructor() {
    // super()
  }

  /**
  * Prepare table from bentospace saved list
  * @method prepareBentoSpaceJoinedNXPlist
  *
  *
  */
  prepareBentoSpaceJoinedNXPlist = function (peerExpModules) {
    let gridColumns = ['id', 'name', 'description', 'time', 'dapps', 'device', 'action']
    let gridDatapeer = this.prepareBentoSpaceExperimentSummary(peerExpModules)
    let gridPeer = {}
    gridPeer.columns = gridColumns
    gridPeer.data = gridDatapeer
    return gridPeer
  }

  /**
  * 
  * extract info. from contracts for display in list format
  * @method prepareBentoSpaceExperimentSummary
  *
  */
  prepareBentoSpaceExperimentSummary = function (peerExpModules) {
    let gridDatapeer = []
    let question2 = {}
    for (let mod of peerExpModules[0].modules) {
      // look up question
      if (typeof mod.value.info === 'object' && Object.keys(mod.value.info).length > 0) {
        if (mod.value.info.type === 'question') {
          question2 = mod.value.info.question
        } else {
          question2 = 'none'
        }
      }
      if (question2 !== 'none') {
        gridDatapeer.push({ id: peerExpModules[0].exp.key, name: question2.text, description: '--', time: Infinity, dapps: 'Yes', device: 'Yes', action: 'View' })
      }
    }
    return gridDatapeer
  }

  /**
  * 
  * select the network experiment contract for HOP
  * @method matchNXPcontract
  *
  */
  matchNXPcontract = function (contractID, nxpList) {
    let contractNXP = {}
    for (let nxp of nxpList) {
      if (nxp.exp.key === contractID) {
        contractNXP = nxp
      }
    }
    return contractNXP
  }

}

export default LibraryUtility