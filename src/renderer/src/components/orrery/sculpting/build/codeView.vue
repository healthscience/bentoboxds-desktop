<template>
  <div class="code-editor-box">
    <textarea 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      :readonly="readOnly"
      spellcheck="false"
      placeholder="// Pure JS executable code..."
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'BentoCodeEditor',
  props: {
    // The raw source code string pulled from HOP / Hyperbee
    modelValue: {
      type: String,
      default: ''
    },
    // Set to true when inspecting immutable library hashes
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.code-editor-box textarea {
  width: 100%;
  height: 250px;
  background-color: #1a1a1a;
  color: #00ffcc; /* Clean green/cyan terminal look */
  font-family: monospace;
  font-size: 14px;
  padding: 12px;
  border: 1px solid #333;
  border-radius: 6px;
  resize: vertical;
  box-sizing: border-box;
}

.code-editor-box textarea:focus {
  outline: 1px solid #00ffcc;
}

.code-editor-box textarea[readonly] {
  color: #888888;
  background-color: #141414;
  cursor: not-allowed;
}
</style>