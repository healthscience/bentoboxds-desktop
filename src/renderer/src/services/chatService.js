import ChatUtility from '@/stores/hopUtility/chatUtility.js'

class ChatService {
  constructor() {
    this.chatUtility = new ChatUtility()
    this.currentContext = 'chat'
  }
  // Initialize chat service
  initChat(context) {
    this.currentContext = context
    this.chatUtility.initChat(context)
  }
  // Create a new chat
  createNewChat(context, bboxid) {
    return this.chatUtility.createChatTemplate(context, bboxid)
  }
  // Create a new question
  createNewQuestion(text, context, toolsUsed, dataInfo, bboxid) {
    return this.chatUtility.createQuestionTemplate(text, context, toolsUsed, dataInfo, bboxid)
  }
  // Prepare a question for sending to HOP
  prepareQuestionForHOP(question) {
    return this.chatUtility.prepareQuestionForHOP(question)
  }
  // Create a feedback message
  createFeedbackMessage(message, bboxid) {
    return this.chatUtility.createFeedbackMessage(message, bboxid)
  }
  // Process incoming messages from HOP
  processIncomingMessage(message) {
    // Determine message type and process accordingly
    if (message.type === 'bbai-stream-reply') {
      return {
        type: 'ai',
        content: message.data.text,
        streaming: true,
        timestamp: new Date(),
        bboxid: message.bboxid || this.chatUtility.generateBboxId(),
        context: this.currentContext
      }
    }
    else if (message.type === 'token') {
      return {
        type: 'ai',
        content: message.data,
        streaming: true,
        timestamp: new Date(),
        bboxid: message.bboxid,
        context: this.currentContext
      }
    }
    else if (message.type === 'bbai-stream-end') {
      return {
        type: 'ai',
        content: '', // Empty content to signal end of streaming
        streaming: false,
        timestamp: new Date(),
        bboxid: message.bboxid,
        context: this.currentContext
      }
    }

    // Default processing
    return {
      type: message.type || 'system',
      content: message.content || '',
      timestamp: new Date(),
      bboxid: message.bboxid || this.chatUtility.generateBboxId(),
      context: this.currentContext
    }
  }
}

export default ChatService