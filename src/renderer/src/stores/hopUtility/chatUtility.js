'use strict'
/**
*  ChatUtility
*
*
* @class ChatUtility
* @package    ChatUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'

class ChatUtility {

  constructor() {
    // super()
  }

  /**
  * Prepare chat question and reply for beebee
  * @method prepareChatQandA
  *
  *
  */
  prepareChatQandA = function (inputHOP, summary) {
    let chatFeed = {}
    let boxID = inputHOP
    let pairBB = {}
    let question = this.prepareQuestion(boxID)
    let reply = this.prepareReply(summary.name)
    chatFeed.question = question
    chatFeed.reply = reply
    return chatFeed
  }

  /**
  * Prepare the question
  * @method prepareQuestion
  *
  */
  prepareQuestion = function (boxid, quest) {
    let question = {}
    question.data = { active: true }
    question.bbid = boxid
    return question
  }

  /**
  * Match to summary context info.
  * @method matchSummaryPeerContract
  *
  */
  matchSummaryPeerContract = function (key, peerSummmary) {
    let matchSummary = {}
    for (let psum of peerSummmary.data) {
      if (psum.id == key) {
        matchSummary = psum
      }
    }
    return matchSummary
  }



  /**
  * Prepare the reply
  * @method prepareReply
  *
  */
  prepareReply = function (context) {
    // compile the repy
    let reply = {}
    reply.time = new Date()
    reply.type = 'feedback'
    reply.data = { text: context + ' --- no data for this network experiment'}
    return reply
  }

  /**
  * match HOPid with bbid
  * @method matchHOPbbid
  *
  */
  matchHOPbbid = function (key, bbidHOPid) {
    let matchBBID = ''
    for (let bhid of bbidHOPid) {
      if (bhid.HOPid === key) {
        matchBBID = bhid.bbid
      }
    }
    return matchBBID
  }

  /**
  * match bbid with question history
  * @method matchBBIDchathistory
  *
  */
  matchBBIDchathistory = function (bbid, chatHistory) {
    let questionHistory = ''
    for (let histMatch of chatHistory) {
      if (histMatch.bbid === bbid) {
          questionHistory = histMatch
      }
    }
    return questionHistory
  }

  /**
  * prepare open data toolbar settings
  * @method setOpendataToolbar
  *
  */
  setOpendataToolbar = function () {
    let boxSettings = 
      {
        opendatatools: { active: false },
        boxtoolshow: { active: false },
        vistoolsstatus: { active: false },
        scalezoom: 1,
        location: {},
        chartstyle: 'line',
        legends: true
      }
    return boxSettings
  }

}

export default ChatUtility