<template>
	<component :is="tag" class="file-preview">
		<div id="filesummary">
			{{ file.id }}
		</div>
		<button class="remove-file" @click="handleFile(file.id)">remove</button>  <!--// testRemove()">remove</button>-->
		<!--<button class="close-icon">{{ file }}</button>-->
		<!--<img :src="file.url" :alt="file.file.name" :title="file.file.name"/>-->

		<!--<span class="status-indicator loading-indicator" v-show="file.status == 'loading'">In Progress</span>
		<span class="status-indicator success-indicator" v-show="file.status == true">Uploaded</span>
		<span class="status-indicator failure-indicator" v-show="file.status == false">Error</span>-->
	</component>
</template>

<script setup>

defineProps({
	file: { type: Object, required: true },
	tag: { type: String, default: 'li' },
})

const emit = defineEmits(['removeFile'])

const handleFile = (file) => {
	emit('removeFile', file)
}

</script>

<style scoped>
.file-preview {
	display: grid;
	grid-template-columns: 1fr;
	width: 30%;
	margin: 1rem 2.5%;
	position: relative;
	border: 1px solid blue;
	aspect-ratio: 1/1;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.close-icon, .status-indicator {
		--size: 20px;
		position: absolute;
		line-height: var(--size);
		height: var(--size);
		border-radius: var(--size);
		box-shadow: 0 0 5px currentColor;
		right: 0.25rem;
		appearance: none;
		border: 0;
		padding: 0;
	}

	.close-icon {
		width: var(--size);
		font-size: var(--size);
		background: #933;
		color: #fff;
		top: 0.25rem;
		cursor: pointer;
	}

	.status-indicator {
		font-size: calc(0.75 * var(--size));
		bottom: 0.25rem;
		padding: 0 10px;
	}

	.loading-indicator {
		animation: pulse 1.5s linear 0s infinite;
		color: #000;
	}

	.success-indicator {
		background: #6c6;
		color: #040;
	}

	.failure-indicator {
		background: #933;
		color: #fff;
	}
}

@keyframes pulse {
	0% {
		background: #fff;
	}

	50% {
		background: #ddd;
	}

	100% {
		background: #fff;
	}
}
</style>