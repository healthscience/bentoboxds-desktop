<template>
  <div id="question-referencecontract">
    <header
      class="viewer-header"
      id="modalTitle"
    >
      <slot name="header">
        This is the default tile!
      </slot>
    </header>
    <section
      class="board-body"
      id="refcdescription"
    >
      <slot name="body">
        Question Reference Contract Info
      </slot>
    </section>
    <footer class="board-footer">
      <slot name="footer">
      </slot>
    </footer>
  </div>
</template>

<script setup>

</script>

<style scoped>
#question-referencecontract {
  text-align: left;
  margin: 2em;
  background-color: #e6e6ff;
  border: 1px solid lightgrey;
}

.viewer-header {
  font-size: 2em;
  font-weight: bold;
}

.board-body {
  font-size: 1.4em;
}

</style>
