'use strict'
import { Info } from 'luxon'
/**
*  ChatspaceUtility
*
*
* @class ChatspaceUtility
* @package    ChatUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'
import hashObject from 'object-hash'

class ChatspaceUtility {

  constructor() {
    // super()
  }

  /**
  * Prepare chat question and reply for beebee
  * @method prepareChatQandA
  *
  *
  */
  prepareChatQandA = function (inputBB, prompt) {
    console.log('perep chat q and a for space')
    console.log(inputBB)
    console.log(prompt)
    let chatFeed = {}
    let boxID = inputBB
    let pairBB = {}
    let question = this.prepareQuestion(boxID, inputBB.text)
    let reply = this.prepareReply(prompt.name)
    chatFeed.question = question
    chatFeed.reply = reply
    return chatFeed
  }

  /**
  * Prepare the question
  * @method prepareQuestion
  *
  */
  prepareQuestion = function (boxid, questionIn) {
    let question = {}
    question.data = { active: true, text: questionIn, date: new Date() }
    question.bbid = boxid
    return question
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

}

export default ChatspaceUtility