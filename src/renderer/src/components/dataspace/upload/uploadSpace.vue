<template>
	<div id="upload-space">
		<drop-zone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
			<label for="file-input">
				<span v-if="dropZoneActive">
					<span>Drop Them Here</span>
					<span class="smaller">to add them</span>
				</span>
				<span v-else>
					<span class="drag-file-message">Drag Your Files Here</span>
					<span class="smaller">
						or <strong>click</strong> to select files
						<input type="file" id="file-input" multiple @change="onInputChange" />
					</span>
				</span>
				
			</label>
			<div class="image-list" v-show="files.length">
				<file-preview v-for="file of files" :key="file.id" :file="file" tag="li" @remove-file="removeFileEvent(file)"/>
			</div>
		</drop-zone>
		<button v-if="files.length !== 0" @click.prevent="saveFiles(files)" class="upload-button">Upload</button>
		<div id="library-message">
			<header>Library feedback</header>
			File {{ storeLibrary.libraryMessage.data?.headerinfo.splitwords }} saved: {{ storeLibrary.libraryMessage.success }}
		</div>
		<!--<div id="files-list">files {{ files }}</div>-->
	</div>
</template>

<script setup>
// Components
import hashObject from 'object-hash'
import DropZone from '@/components/dataspace/upload/dropZone.vue'
import FilePreview from '@/components/dataspace/upload/filePreview.vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref, shallowRef, computed } from "vue"
import FileHander from '@/components/dataspace/upload/utils/fileHandler.js'

	const file = shallowRef(null)
	let HandleLargeFiles = new FileHander()
	let headerLocal = ref({})

	const storeLibrary = libraryStore()
	const storeAI = aiInterfaceStore()

// File Management
import useFileList from '@/components/dataspace/upload/compositions/fileList.js'

const { files, addFiles, removeFile } = useFileList()

	/* computed */
	const uploadStatus = computed(() => {
    return storeLibrary.uploadStatus
  })

	/* methods */
	function onInputChange(e) {
		file.value = e.target.files[0]
		let fileName = file.value.name
		storeLibrary.fileBund.name = fileName
		let addF = addFiles(e.target.files)
		//e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
	}

	const closedataBox = () => {
    storeAI.dataBoxStatus = !storeAI.dataBoxStatus
    storeLibrary.uploadStatus = false
  }


// Uploader
// import createUploader from '@/components/dataspace/upload/compositions/fileUploader.js'
// const { uploadFiles } = createUploader('url')
const removeFileEvent = (file) => {
	removeFile(file)
}

const checkElectron = () => {
    // Renderer process
	if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
			return true
	}
	// Main process
	if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
			return true
	}
	// Detect the user agent when the `nodeIntegration` option is set to true
	if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
			return true
	}
	return false
}

const saveFiles = (files) => {
	console.log(HandleLargeFiles)
	for (let file of files) {
		console.log('file size')
		console.log(file.file.size)
		let fileSize = file.file.size
		let largeFileStatus = false
		if ((fileSize / 1000000) > 10) {
			largeFileStatus = true
		}
		/* upload file data flow */
		// check if file type given? if not extract file extention (different browser different info NOTE)
		if (file.file.type.length === 0) {
			// take file name and get extension and add 
			// file.file.type = 'sqlite'
		}
		// let fileData = uploadFiles(files)
		// send data to HOP to save in Holepunch
		let sourceLocation = ''
		if (checkElectron() === false) {
			sourceLocation = 'web'
		} else {
			sourceLocation = 'local'
		}
		storeLibrary.lineBundle.location = sourceLocation
		// prepare message data
		let fileBundle = {}
		fileBundle.name = file.file.name
		fileBundle.source = sourceLocation
		fileBundle.websource = '' // readRemotefile
		fileBundle.web = 'none'
		fileBundle.path = file.file.url
		fileBundle.type = file.file.type
		storeLibrary.fileBundleList.push(fileBundle)
		// give summary back to peer
		if (file.file.type === 'text/csv') {
			console.log('svs')
			storeLibrary.csvpreviewLive = true
			// use hander large or small?
			if (largeFileStatus === false) {
				HandleLargeFiles.csvHandler(file, storeAI, storeLibrary, hashObject, fileBundle)
			} else {
				HandleLargeFiles.handleLargeFile(file.file, 'csv', storeLibrary )
			}
		} else if (file.file.type === 'image/png') {
			storeLibrary.imagepreviewLive = true
			// get file data via reader
			const readerImage = new FileReader()
			// await read and responsed file image data
			readerImage.onload = function () {
			const fileContent = readerImage.result

			if (storeAI.dataBoxStatus !== true) {
				// prepare chat to view image data
				storeAI.qcount++
				let question = {}
				question.type ='bbai'
				question.reftype = 'ignore'
				question.action = 'question'
				question.data = { "count": storeAI.qcount, "text": "Image file has been uploaded", "active": true, "time": new Date() }
				let hashQuestion = hashObject(question.data + file.file.name)

				storeLibrary.fileBund.content = fileContent
				// build for chart interface
				question.bbid = hashQuestion
				let bbReply = {}
				bbReply.type = 'bbai-reply'
				bbReply.data = { text: 'Image file preview', filedata: { type: 'image/png', file: fileBundle, columns: 'one', grid: fileContent }, prompt: 'Happy with image?', options: null, }
				bbReply.bbid = hashQuestion
				let newPair = {}
				newPair.question = question
				newPair.reply = bbReply
				storeAI.historyPair[storeAI.chatAttention].push(newPair)
			} else {
				// build for library upload
				storeLibrary.newPackagingForm.apicolumns = null
				storeLibrary.newDatafile.columns = null
				storeLibrary.newDatafile.path = 'image/png'
				storeLibrary.newDatafile.file = 'image/png'
			}


			// save the Image to data store
			let fileSave = {}
			fileSave.file = file
			fileSave.content = fileContent
			fileSave.info = 'image' // lineBundle
			fileSave.type = file.file.type
			// prepare message structure
			let messageHOP = {}
			messageHOP.type = 'library'
			messageHOP.action = 'contracts'
			messageHOP.reftype = 'save-file'
			messageHOP.privacy = 'private'
			messageHOP.task = 'PUT'
			messageHOP.data = fileSave
			// send to HOP
			// storeLibrary.sendMessage(messageHOP)
			}
			readerImage.onerror = function() {
				console.log(readerImage.error)
			}
			readerImage.readAsDataURL(file.file)
		} else if (file.file.type !== 'text/csv') {
			// check for pdf file  i.e. sqlite file
			if (file.file.type !== 'application/pdf' && file.file.type !== 'application/json') {
				let fileSave = {}
				fileSave.name = file.file.name
				fileSave.path = file.url
				fileSave.source = sourceLocation
				if (file.file.type.length === 0) {
					let splitExtension = file.file.name.split('.')
					let matchExtension = ''
					if (splitExtension[1] === 'db') {
						matchExtension = 'sqlite'
					} else {
						matchExtension = splitExtension[1]
					}
					fileSave.type = matchExtension
				} else {
					fileSave.type = file.file.type
				}
				const reader2 = new FileReader()
				reader2.readAsDataURL(file.file)
				reader2.onload = function (e) {
					fileSave.content = e.target.result
					// is this for join nxp module?
					if (storeLibrary.joinNXP !== true) {
						// prepare message structure
						let messageHOP = {}
						messageHOP.type = 'library'
						messageHOP.action = 'contracts'
						messageHOP.reftype = 'save-file'
						messageHOP.privacy = 'private'
						messageHOP.task = 'PUT'
						messageHOP.data = fileSave
						// close the upload
						storeLibrary.uploadStatus = false
						storeLibrary.sendMessage(messageHOP)
					} else {
						// prepare message for join NXP module process i.e. HOPquery structure already setup by genesis
						let messageHOP = {}
						messageHOP.type = 'library'
						messageHOP.action = 'contracts'
						messageHOP.reftype = 'save-file'
						messageHOP.privacy = 'private'
						messageHOP.task = 'PUT'
						messageHOP.data = fileSave
						// close the upload
						storeLibrary.uploadStatus = false
						storeLibrary.joinNXPprocess(messageHOP)
					}
				}
			} else if (file.file.type === 'application/json') {
		  	  // build for chat and library upload
					const reader3 = new FileReader()
					reader3.readAsText(file.file)
					reader3.onload = function () {
					let rawData = reader3.result
					const lines = JSON.parse(rawData)
					storeLibrary.linesLimit = lines.slice(0, 20)
					// for chat interface
					if (storeAI.dataBoxStatus !== true) {
						// TODO send to beebee via socket but for now create reply here
						storeAI.qcount++
						let question = {}
						question.type ='bbai'
						question.reftype = 'ignore'
						question.action = 'question'
						question.data = { "count": storeAI.qcount, "text": "Upload of file", "active": true, "time": new Date() }
						let hashQuestion = hashObject(question.data + file.file.name)
				
						let headerLocal = Object.keys(lines[0])
						// make columns in standard form object
						let columnStructure = []
						let scount = 0
						for (let head of headerLocal) {
							columnStructure.push({ cid: scount, name: head })
							scount++
						}
						let fileContent = reader3.result
						storeLibrary.fileBund.content = fileContent
						// build for chart interface
						question.bbid = hashQuestion
						let bbReply = {}
						bbReply.type = 'bbai-reply'
						bbReply.data = { text: 'summary of file data file is json, headings are:', filedata: { type: 'json', file: fileBundle, columns: 'one', grid: storeLibrary.linesLimit }, prompt: 'Select data to chart:', options: headerLocal, }
						bbReply.bbid = hashQuestion
						let newPair = {}
						newPair.question = question
						newPair.reply = bbReply
						storeAI.historyPair[storeAI.chatAttention].push(newPair)
						// if json  active viewer
					} else {
							// build for library
							let headerLocal = Object.keys(lines[0])
							// make columns in standard form object
							let columnStructure = []
							let scount = 0
							for (let head of headerLocal) {
								columnStructure.push({ cid: scount, name: head })
								scount++
							}
							// build for library upload
							storeLibrary.newPackagingForm.apicolumns = headerLocal
							storeLibrary.newDatafile.columns = columnStructure
							storeLibrary.newDatafile.path = 'json'
							storeLibrary.newDatafile.file = 'json'
						}
					}
			} else {
				let aiMessage = {}
				aiMessage.type = 'bbai'
				aiMessage.reftype = 'ai'
				aiMessage.action = 'agent-task'
				aiMessage.task = 'cale-gpt4all-rag'
				aiMessage.data = { text: 'please add this data to medical learning rag'}
				aiMessage.bbid = '' // props.bboxid
				storeAI.sendMessageHOP(aiMessage)
			}
		} else {
			// prepare file data for storage via HOP
			const reader2 = new FileReader()
			// reader2.readAsText(fileData)
			reader2.onloadend = function () {
				let fileContent = reader2.result
				let lineBundle =
				{
					cnumber: '',
					dataline: '',
					delimiter: '',
					datetype: ''
				}
				let fileOut = {}
				fileOut.name = storeLibrary.fileBund.name
				let type = storeLibrary.newPackagingForm.type
				let fileSave = {}
				fileSave.file = fileOut
				fileSave.content = fileContent
				fileSave.info = lineBundle
				fileSave.type = type
				// prepare message structure
				let messageHOP = {}
				messageHOP.type = 'library'
				messageHOP.action = 'contracts'
				messageHOP.reftype = 'save-file'
				messageHOP.privacy = 'private'
				messageHOP.task = 'PUT'
				messageHOP.data = fileSave // storeLibrary.fileBund
				// send to HOP
				console.log('save on uplodald+++')
				storeLibrary.sendMessage(messageHOP)
				storeLibrary.uploadStatus = false
			}
			reader2.readAsDataURL(file)
		}
		// lastly clear file list
		removeFile(file)
  }

	const localHeaderExtract = (lineOne) => {
		let headerInfo = lineOne.split(',')
		return headerInfo
	}
	// need to close databox if enter from chat
	if (storeLibrary.libraryStatus === false) {
		storeAI.dataBoxStatus = false
    storeLibrary.uploadStatus = false
    storeLibrary.libraryStatus = false
	}
}
</script>

<style scoped>
#files-list {
	color: white;
}

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

.drag-file-message {
	color: white;
	font-weight: bold;
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
		color: white;
		font-weight: bold;
	}
}

.image-list {
	display: flex;
	border: 1px solid darkblue;
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

	@media (min-width: 1024px) {
		#upload-space {
			font-family: Helvetica, Arial, sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			text-align: center;
			background-color: #2c3e50;
			color: #2c3e50;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			border: 2px solid red;
		}

		.drop-area {
			min-height: 50vh;
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
	}
</style>