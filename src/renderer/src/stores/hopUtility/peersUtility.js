'use strict'
/**
*  PeersUtility
*
*
* @class PeersUtility
* @package    PeersUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'

class PeersUtility {

  constructor() {
    // super()
  }

  /**
  * check match if already a connection
  * @method checkPeerMatch
  *
  *
  */
  checkPeerMatch = function (warmPeers, peerDetails) {
    let peerMatch = {}
    if (warmPeers.length > 0) {
      for (let wp of warmPeers) {
        if (wp.key === peerDetails) {
          peerMatch = wp
        }
      }
    }
    return peerMatch
  }

  /**
  *  prepare matched bentobox with layout to share
  * @method n1Match
  *
  *
  */
  n1Match = function (sharePubkey, keyPublibary, cueID, bboxes, peerLibrary, layoutBBoxes) {
    let peerBBMatch = {}

    let publicN1contracts = []
    // match private nxp to genesis public contract
    for (let bbox of bboxes) {
     for (let n1contract of peerLibrary) {
        if (bbox.contract = n1contract.key) {
          let peerDetails = {}
          peerDetails.name = 'peer'
          peerDetails.type = 'public-n1-experiment'
          peerDetails.publickey = sharePubkey
          peerDetails.datastores = keyPublibary
          peerDetails.boardID =  n1contract.value.genesis
          peerDetails.boardname =  n1contract.value.name
          publicN1contracts.push(peerDetails)
        }
      }
    }
    // layout of boxes
    let bboxLayout = []
    for (let bboxsp of bboxes) {
      bboxLayout.push({ bboxid: bboxsp.bboxid, layout: layoutBBoxes[bboxsp.bboxid] })       
    }

    peerBBMatch.publicN1contracts = publicN1contracts
    peerBBMatch.bLayout = bboxLayout
    return peerBBMatch
  }

  /**
  *  convert string to binary TEMP TODO turn to has via HOP
  * @method binaryStringToByteBuffer
  *
  *
  */
  binaryStringToByteBuffer = function (binaryString) {
    let byteBuffer = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        byteBuffer[i] = binaryString.charCodeAt(i)
    }
    return byteBuffer
  }

  /**
  *  convert binary to string  TEMP TODO turn to has via HOP
  * @method binaryStringToByteBuffer
  *
  *
  */
  bytesToName = function (byteBuffer) {
    let name = ''
    for (let i = 0; i < byteBuffer.length; i++) {
        name += String.fromCharCode(byteBuffer[i])
    }
    return name
  }

}

export default PeersUtility
