<template>
  <div id="upload-space" :class="{ inline: props.inline }">
    <drop-zone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
      <label for="file-input">
        <span v-if="dropZoneActive">
          <span>Drop Them Here</span>
          <span class="smaller">to add them</span>
        </span>
        <span v-else>
          <span class="drag-file-message">Drag Files Here</span>
          <span class="smaller">
            or <strong>click</strong> to select files
            <input type="file" id="file-input" multiple @change="onInputChange" />
          </span>
        </span>
      </label>

      <div class="image-list" v-if="files.length">
        <file-preview 
          v-for="file of files" 
          :key="file.id" 
          :file="file" 
          tag="li" 
          @remove-file="removeFileEvent(file)"
        />
      </div>
    </drop-zone>

    <button v-if="files.length !== 0" @click.prevent="saveFiles(files)" class="upload-button">
      Upload
    </button>

    <div id="library-message" v-if="storeLibrary.libraryMessage?.success">
      <header>Library feedback</header>
      File {{ storeLibrary.libraryMessage.data?.headerinfo?.splitwords }} saved: {{ storeLibrary.libraryMessage.success }}
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'
import hashObject from 'object-hash'
import DropZone from '@/components/dataspace/upload/dropZone.vue'
import FilePreview from '@/components/dataspace/upload/filePreview.vue'
import useFileList from '@/components/dataspace/upload/compositions/fileList.js'
import FileHandler from '@/components/dataspace/upload/utils/fileHandler.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const props = defineProps({
  inline: {
    type: Boolean,
    default: false
  },
  expectedType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['upload-sent', 'upload-error'])

const storeLibrary = libraryStore()
const storeAI = aiInterfaceStore()
const { files, addFiles, removeFile } = useFileList()

const file = shallowRef(null)
const handleLargeFiles = new FileHandler()

const uploadStatus = computed(() => storeLibrary.uploadStatus)

function checkElectron() {
  if (typeof window !== 'undefined' && window.process?.type === 'renderer') return true
  if (typeof process !== 'undefined' && process.versions?.electron) return true
  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.includes('Electron')) return true
  return false
}

function onInputChange(e) {
  if (!e.target.files?.length) return
  file.value = e.target.files[0]
  storeLibrary.fileBund.name = file.value.name
  addFiles(e.target.files)
}

function removeFileEvent(targetFile) {
  removeFile(targetFile)
}

function dispatchHOPMessage(messageHOP, fileBundle) {
  storeLibrary.uploadStatus = false
  if (storeLibrary.joinNXP) {
    storeLibrary.joinNXPprocess(messageHOP)
  } else {
    storeLibrary.sendMessage(messageHOP)
  }
  emit('upload-sent', { fileBundle, messageHOP })
}

async function saveFiles(fileList) {
  storeLibrary.uploadFileStatus = true
  const sourceLocation = checkElectron() ? 'local' : 'web'
  storeLibrary.lineBundle.location = sourceLocation

  for (const item of [...fileList]) {
    const fileObj = item.file
    const fileSizeMB = fileObj.size / 1000000
    const isLarge = fileSizeMB > 10

    const fileBundle = {
      name: fileObj.name,
      source: sourceLocation,
      websource: '',
      web: 'none',
      path: item.url || '',
      type: fileObj.type
    }

    storeLibrary.fileBundleList.push(fileBundle)

    if (isLarge) {
      const fType = fileObj.type || 'unknown'
      handleLargeFiles.handleLargeFile(fileObj, fType, storeLibrary)
      emit('upload-sent', { fileBundle, messageHOP: {} })
      removeFile(item)
      continue
    }

    if (fileObj.type === 'text/csv') {
      storeLibrary.csvpreviewLive = true
      handleLargeFiles.csvHandler(item, storeAI, storeLibrary, hashObject, fileBundle)
      removeFile(item)
      continue
    }

    if (fileObj.type === 'image/png') {
      storeLibrary.imagepreviewLive = true
      const reader = new FileReader()
      reader.onload = () => {
        const fileContent = reader.result

        if (!storeAI.dataBoxStatus) {
          storeAI.qcount++
          const question = {
            type: 'bbai',
            reftype: 'ignore',
            action: 'question',
            data: { count: storeAI.qcount, text: 'Image file has been uploaded', active: true, time: new Date() }
          }
          const hashQuestion = hashObject(question.data + fileObj.name)
          question.bbid = hashQuestion

          storeLibrary.fileBund.content = fileContent

          const bbReply = {
            type: 'bbai-reply',
            data: {
              text: 'Image file preview',
              filedata: { type: 'image/png', file: fileBundle, columns: 'one', grid: fileContent },
              prompt: 'Happy with image?',
              options: null
            },
            bbid: hashQuestion
          }

          storeAI.historyPair[storeAI.chatAttention].push({ question, reply: bbReply })
        } else {
          storeLibrary.newPackagingForm.apicolumns = null
          storeLibrary.newDatafile.columns = null
          storeLibrary.newDatafile.path = 'image/png'
          storeLibrary.newDatafile.file = fileBundle.name
        }

        const messageHOP = {
          type: 'library',
          action: 'files',
          reftype: 'save-file',
          privacy: 'private',
          task: 'PUT',
          data: {
            file: item,
            content: fileContent,
            info: 'image',
            type: fileObj.type
          }
        }

        dispatchHOPMessage(messageHOP, fileBundle)
      }
      reader.onerror = () => emit('upload-error', reader.error)
      reader.readAsDataURL(fileObj)
      removeFile(item)
      continue
    }

    if (fileObj.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = () => {
        const rawData = reader.result
        const parsed = JSON.parse(rawData)

          //const hashQuestion = hashObject(question.data + fileObj.name)
          //question.bbid = hashQuestion

          /*storeLibrary.fileBund.content = rawData
          // form beebee message
          const bbReply = {
            type: 'bbai-reply',
            data: {
              text: 'summary of file data file is json, headings are:',
              filedata: { type: 'json', file: fileBundle, columns: 'one', grid: storeLibrary.linesLimit },
              prompt: 'Select data to chart:',
              options: headerLocal
            },
            bbid: hashQuestion
          }

          storeAI.historyPair[storeAI.chatAttention].push({ question, reply: bbReply }) */

        const messageHOP = {
          type: 'library',
          action: 'files',
          reftype: 'save-file',
          privacy: 'private',
          task: 'PUT',
          data: {
            name: fileObj.name,
            path: item.url || '',
            source: sourceLocation,
            type: 'json',
            content: rawData,
            fileIntent: storeLibrary.newFileIntent
          }
        }

        dispatchHOPMessage(messageHOP, fileBundle)
      }
      reader.readAsText(fileObj)
      removeFile(item)
      continue
    }

    if (fileObj.type === 'application/pdf') {
      const aiMessage = {
        type: 'bbai',
        reftype: 'ai',
        action: 'agent-task',
        task: 'cale-gpt4all-rag',
        data: { text: 'please add this data to medical learning rag' },
        bbid: ''
      }
      storeAI.sendMessageHOP(aiMessage)
      removeFile(item)
      continue
    }

    // Binary / Media fallback (DuckDB, SQLite, Video, etc.)
    const ext = fileObj.type.length === 0 
      ? (fileObj.name.split('.')[1] === 'db' ? 'sqlite' : fileObj.name.split('.')[1] || 'binary')
      : fileObj.type

    const reader = new FileReader()
    reader.onload = (e) => {
      const messageHOP = {
        type: 'library',
        action: 'files',
        reftype: 'save-file',
        privacy: 'private',
        task: 'PUT',
        data: {
          name: fileObj.name,
          path: item.url || '',
          source: sourceLocation,
          type: ext,
          content: e.target.result
        }
      }

      dispatchHOPMessage(messageHOP, fileBundle)
    }
    reader.readAsDataURL(fileObj)
    removeFile(item)
  }
}

if (storeLibrary.libraryStatus === false) {
  storeAI.dataBoxStatus = false
  storeLibrary.uploadStatus = false
  storeLibrary.libraryStatus = false
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
}

#upload-space.inline {
  height: auto;
  background-color: transparent;
  padding: 10px 0;
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

#upload-space.inline .drop-area {
  padding: 20px;
  min-height: auto;
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

  #upload-space.inline {
    border: none;
    background-color: transparent;
    padding: 10px 0;
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

  #upload-space.inline .drop-area {
    min-height: auto;
    padding: 20px;
  }
}
</style>