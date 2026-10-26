# Life-Strap Chat Rewiring Plan

This plan outlines the steps to integrate the Life-Strap concept into the chat system, ensuring messages are correctly mapped to conversation IDs and include the necessary metadata.

## 1. State Management (`src/stores/aiInterface.js`)
- Add `activeLifeStrapID` and `activeContractKey` to the state.
- Implement a method to set the active Life-Strap.

## 2. Message Structure (`src/stores/aiInterface.js`)
- Update `submitAsk` to construct messages with the new format:
  ```javascript
  {
    role: 'peer' | 'beebee',
    content: String,
    conversationId: String,
    contract_key: String,
    lifeStrapID: String,
    context: 'extraction' | 'space' | 'emulation'
  }
  ```

## 3. Chat Logic (`src/stores/chatStore.js`)
- Update `addMessage` to use the `contract_key` or `lifeStrapID` as a fallback for `conversationId`.
- Ensure messages are indexed correctly in `chatHistory`.
- On start take chat history and format ready for use when called upon.

## 4. Component Upgrades
- **`src/components/beebeehelp/spaceChat.vue`**: Update to pass the correct context and IDs to the chat interface.
- **`src/components/beebeehelp/chatInterface.vue`**: Update filtering logic to use the new ID structure.

## 5. Verification
- Test the flow from `inputBox.vue` to ensure `beebeeDigest` correctly triggers the new logic.
