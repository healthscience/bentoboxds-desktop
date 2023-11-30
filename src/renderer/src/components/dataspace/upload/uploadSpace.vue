<template>
	<div id="upload-space">
		<drop-zone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
			<label for="file-input">
				<span v-if="dropZoneActive">
					<span>Drop Them Here</span>
					<span class="smaller">to add them</span>
				</span>
				<span v-else>
					<span>Drag Your Files Here</span>
					<span class="smaller">
						or <strong><button>click here</button></strong> to select files
					</span>
				</span>
				<input type="file" id="file-input" multiple @change="onInputChange" />
			</label>
			<ul class="image-list" v-show="files.length">
				<file-preview v-for="file of files" :key="file.id" :file="file" tag="li" @remove="removeFile" />
			</ul>
		</drop-zone>
		<button @click.prevent="saveFiles(file)" class="upload-button">Upload</button>
		<div id="library-message">
			<header>Library feedback</header>
			File {{ storeLib.libraryMessage.path }} saved: {{ storeLib.libraryMessage.success }}
		</div>
	</div>
</template>

<script setup>
// Components
import DropZone from '@/components/dataspace/upload/dropZone.vue'
import FilePreview from '@/components/dataspace/upload/filePreview.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
// import { useObjectUrl } from '@vueuse/core'
// import { shallowRef } from 'vue'


import { ref, shallowRef, computed } from "vue"

const file = shallowRef(null)


const storeAI = aiInterfaceStore()
const bbliveStore = bentoboxStore()
const storeLib = libraryStore()

// File Management
import useFileList from '@/components/dataspace/upload/compositions/fileList.js'
const { files, addFiles, removeFile } = useFileList()

function onInputChange(e) {
  console.log('onchange')
  file.value = e.target.files[0]
	console.log('file change')
  console.log(file)
	// addFiles(e.target.files)
	// e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

// Uploader
// import createUploader from '@/components/dataspace/upload/compositions/fileUploader.js'
// const { uploadFiles } = createUploader('url')

const saveFiles = (file) => {
  /* upload file data flow */
  // let fileData = uploadFiles(files)
  // send data to HOP to save in Holepunch
	console.log('savefile')
	console.log(file)
  // file.value = file
  let sourceLocation = 'local'
	// prepare message data
	bbliveStore.fileBund.name = file.name
	bbliveStore.fileBund.source = sourceLocation
	bbliveStore.fileBund.websource = '' // readRemotefile
	bbliveStore.fileBund.web = 'none'
	bbliveStore.fileBund.path = file.url
	bbliveStore.fileBund.type = file.type
  // give summary back to peer
  if (file.type === 'text/csv') {
    storeAI.csvpreviewLive = true
    const reader = new FileReader()
    reader.onloadend = function () {  // = (event) => { // = function () {
      const lines = reader.result // .split(/\r\n|\n/)
			let splitLines = lines.split(/\r\n|\n/)
      storeAI.linesLimit = splitLines.slice(0, 40)
			let fileContent = reader.result
			bbliveStore.fileBund.content = fileContent
    }
		reader.onerror = function() {
   	 console.log(reader.error)
 		}
    reader.readAsText(file)
  } else {
		// prepare file data for storage via HOP
		let fileContent = {}
		const reader2 = new FileReader()
		reader2.readAsText(fileData)
		reader2.onload = function (e) {
			fileContent = e.target.result
			let lineBundle =
			{
				cnumber: '',
				dataline: '',
				delimiter: '',
				datetype: ''
			}
			bbliveStore.fileBund.content = fileContent
			bbliveStore.fileBund.info = lineBundle
			// prepare message structure
			let messageHOP = {}
			messageHOP.type = 'library'
			messageHOP.reftype = 'save-file'
			messageHOP.action = 'save-file'
			messageHOP.data = bbliveStore.fileBund
			// send to HOP
			console.log('before message send')
			storeAI.sendMessageHOP(messageHOP)
			storeAI.uploadStatus = false
		}
  }
}
</script>

<style scoped>

#upload-space {
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
  background-color: #2c3e50;
	color: #2c3e50;
	margin: 0 auto;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
  z-index: 4;
}

.drop-area {
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	padding: 50px;
	background: #ffffff55;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	transition: .2s ease;

	&[data-active=true] {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		background: #ffffffcc;
	}
}

label {
	font-size: 20px;
	cursor: pointer;
	display: block;

	span {
		display: block;
	}

	input[type=file]:not(:focus-visible) {
		position: absolute !important;
		width: 1px !important;
		height: 1px !important;
		padding: 0 !important;
		margin: -1px !important;
		overflow: hidden !important;
		clip: rect(0, 0, 0, 0) !important;
		white-space: nowrap !important;
		border: 0 !important;
	}

	.smaller {
		font-size: 16px;
	}
}

.image-list {
	display: flex;
	list-style: none;
	flex-wrap: wrap;
	padding: 0;
}

.upload-button {
	display: block;
	appearance: none;
	border: 0;
	border-radius: 50px;
	padding: 0.75rem 3rem;
	margin: 1rem auto;
	font-size: 1.25rem;
	font-weight: bold;
	background: #369;
	color: #fff;
	text-transform: uppercase;
}

button {
	cursor: pointer;
}

#library-message {
	background-color: white;
}
</style>