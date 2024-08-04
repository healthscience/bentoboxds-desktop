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
    if (warmPeers.length > 0) {
      for (let wp of warmPeers) {
        if (wp.publickey === peerDetails.publickey) {
          
        } else {
          warmPeers.push(peerDetails)
        }
      }
    } else {
      warmPeers.push(peerDetails)
    }
    return warmPeers
  }

}

export default PeersUtility
