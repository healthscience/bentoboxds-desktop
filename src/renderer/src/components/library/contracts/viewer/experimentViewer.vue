<template>
  <div id="module-referencecontract">
    <header
      class="viewer-header"
      id="modalTitle"
    >
      <slot name="header">
        This is a experiment
      </slot>
    </header>
    <section
      class="board-body"
      id="refcdescription"
    >
      <slot name="body">
        experiment Reference Contract Info
      </slot>
    </section>
    <footer class="board-footer">
      <slot name="footer">
        Close
      </slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'module-refcontract',
  components: {
  },
  computed: {
  },
  data: () => ({
  }),
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
#module-referencecontract {
  text-align: center;
  background-color: #e6e6ff;
  margin-bottom: 2em;
}

.viewer-header {
  text-align: center;
  font-size: 2em;
  font-weight: bold;
}

.board-body {
  font-size: 1.4em;
}

</style>
