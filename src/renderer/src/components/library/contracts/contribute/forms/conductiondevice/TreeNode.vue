<template>
  <li :class="isObject ? 'branch-node' : 'leaf-node'">
    <!-- Branch Node (Objects/Arrays) -->
    <div v-if="isObject">
      <div 
        class="branch-header" 
        :class="{ selected: isSelected }"
        @click.stop="selectThisPath"
      >
        <strong>{{ nodeName }}</strong>
        <span class="badge">{{ isSelected ? '★ Mapped' : 'Map Path' }}</span>
      </div>
      <ul class="sub-tree">
        <TreeNode 
          v-for="key in keys" 
          :key="nextPath(key)"
          :node="node[key]" 
          :path="nextPath(key)"
          :selectedPath="selectedPath"
          @select-root="$emit('selectRoot', $event)"
        />
      </ul>
    </div>
    
    <!-- Leaf Node (Values) -->
    <div 
      v-else 
      class="leaf-content"
      :class="{ selected: isSelected }"
      @click.stop="selectThisPath"
    >
      <div class="leaf-data">
        <span class="key">{{ nodeName }}: </span>
        <span class="val">{{ String(node) }}</span>
      </div>
      <span class="badge" v-show="isSelected">★ Mapped</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'TreeNode',
  props: ['node', 'path', 'selectedPath'],
  emits: ['selectRoot'],
  computed: {
    isObject() {
      return this.node !== null && typeof this.node === 'object'
    },
    keys() {
      return this.isObject ? Object.keys(this.node) : []
    },
    nodeName() {
      return this.path ? this.path.split('.').pop() : '[Root]'
    },
    isSelected() {
      return this.selectedPath === this.path
    }
  },
  methods: {
    nextPath(key) {
      return this.path ? `${this.path}.${key}` : key
    },
    selectThisPath() {
      // Kept the emit name as 'selectRoot' so it doesn't break your parent mapper
      this.$emit('selectRoot', this.path)
    }
  }
}
</script>

<style scoped>
.branch-header {
  cursor: pointer;
  padding: 4px 8px;
  background: #2a2a2a;
  margin: 4px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  transition: background 0.2s;
}
.branch-header:hover {
  background: #333;
}
.branch-header.selected {
  background: #1a2b3c;
  border-left: 4px solid #74c7ec;
}

.sub-tree {
  padding-left: 1.5rem;
  list-style-type: none;
  margin: 4px 0;
}

.leaf-node {
  margin: 2px 0;
}
.leaf-content {
  cursor: pointer;
  padding: 4px 8px;
  color: #888;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  border-left: 4px solid transparent;
  transition: background 0.2s;
}
.leaf-content:hover {
  background: #222;
}
.leaf-content.selected {
  background: #1a2b3c;
  border-left: 4px solid #74c7ec;
  color: #ddd;
}
.leaf-data {
  display: flex;
  gap: 0.5rem;
}
.val {
  color: #74c7ec;
}
.badge {
  font-size: 0.75rem;
  color: #aaa;
  background: #111;
  padding: 2px 6px;
  border-radius: 3px;
}
.selected .badge {
  color: #74c7ec;
  background: transparent;
}
</style>