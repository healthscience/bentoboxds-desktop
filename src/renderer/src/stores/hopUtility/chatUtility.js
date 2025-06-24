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
import hashObject from 'object-hash'
import { DateTime, Interval } from 'luxon'

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

  /**
  * prepare summary chat for upload sqlite
  * @method setSqliteUploadChat
  *
  */
  setSqliteUploadChat = function () {

    let question = {}
    question.type ='bbai'
    question.reftype = 'ignore'
    question.action = 'question'
    question.data = { "count": this.storeAI.qcount, "text": "Upload of file", "active": true, "time": new Date() }
    let hashQuestion = hashObject(question.data + message.data.path)
    // extract headers assume first line
    let headerLocal = {}
    headerLocal[hashQuestion] = message.data.columns
    question.bbid = hashQuestion
    let bbReply = {}
    bbReply.type = 'bbai-reply'
    bbReply.data = { text: 'Summary of tables in SQLite file, heading are:', filedata: { type: 'sqlite', file: message.data.path, columns: 'one', grid: [] }, prompt: 'Select data table to chart:', options: headerLocal[hashQuestion], }
    bbReply.bbid = hashQuestion
    let newPair = {}
    newPair.question = question
    newPair.reply = bbReply
  }

  /**
  * prepare summary chat for large upload e.g. csv
  * @method setlargeUploadChat
  *
  */
  setlargeUploadChat = function (message, count) {
    let question = {}
    question.type ='bbai'
    question.reftype = 'ignore'
    question.action = 'question'
    question.data = { "count": count, "text": "Upload of large file", "active": true, "time": new Date() }
    let hashQuestion = hashObject(question.data + message.data.path)
    // extract headers assume first line
    let headerLocal = {}
    headerLocal[hashQuestion] = message.data.columns
    question.bbid = hashQuestion
    let bbReply = {}
    bbReply.type = 'bbai-reply'
    bbReply.data = { text: 'Header for large CSV file, heading are:', filedata: { type: 'csv', size: 'large', file: message.data.path, columns: 'one', grid: [] }, prompt: 'Select data table to chart:', options: headerLocal[hashQuestion], }
    bbReply.bbid = hashQuestion
    let newPair = {}
    newPair.question = question
    newPair.reply = bbReply
    return newPair
  }

  /**
  * 
  * @method prepareChatMenu
  *
  */
  prepareChatMenu = function (chatData) {
    let menuList = []
    if (chatData.length !== 0) {
      for (let chat of chatData) {
        menuList.push(chat.value.chat)
      }
    } else {
      // first time
      let firstChat = {}
      firstChat.name = "latest"
      firstChat.chatid = "0123456543210"
      firstChat.active = true
      firstChat.createTimestamp = DateTime.now().toMillis()
      firstChat.lastTimestamp = DateTime.now().toMillis()
      firstChat.useCount = 0
      firstChat.favoriteCount = 0 
      menuList.push(firstChat)
    }
    return menuList
  }


}

export default ChatUtility