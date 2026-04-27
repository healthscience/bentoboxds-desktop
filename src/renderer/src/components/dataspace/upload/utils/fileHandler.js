'use strict'

import { parse } from "ol/xml"

/**
*  FileHandler
*
*
* @class FileHandler
* @package    FileHandler
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'

class FileHandler {

  constructor() {
    // super()
  }

  /**
  * handle large file chunk and send to HOP for storage
  * @method handleLargeFile
  *
  *
  */
  handleLargeFile = function (file, type, storeLibrary) {
		let localthis = this
    // chunck the file and pass on to appropriate parser for file type
		let chCount = 0
      function callback (data) {
				console.log('fist data check')
				// console.log(data)
				let dataHolder = {}
				dataHolder.filesize = fileSize
				dataHolder.offset = offset
				dataHolder.firstchunk = firstChunk
				dataHolder.chunk = data
				dataHolder.file = file
				dataHolder.type = type
				if (chCount === 0) {
					localthis.saveStreamDataHop(storeLibrary, dataHolder)
				}
      }
      var fileSize   = file.size
			let firstChunk = false
      var chunkSize  = 64 * 1024 * 200 // bytes
      var offset     = 0
      var self       = this // we need a reference to the current object
      var chunkReaderBlock = null
  
      var readEventHandler = function(evt) {
          if (evt.target.error == null) {
						if (offset === 0) {
							firstChunk = true
						} else {
							firstChunk = false
						}
            offset += evt.target.result.length
            callback(evt.target.result) // callback for handling read chunk
          } else {
						console.log("Read error: " + evt.target.error)
						return
          }
          if (offset >= fileSize) {
						console.log("Done reading file")
						return
					}
          // of to the next chunk
          chunkReaderBlock(offset, chunkSize, file)
      }
  
      chunkReaderBlock = function(_offset, length, _file) {
          var r = new FileReader()
          var blob = _file.slice(_offset, length + _offset)
          r.onload = readEventHandler
          r.readAsText(blob)
      }
  
      // now let's start the read with the first block
      chunkReaderBlock(offset, chunkSize, file)
    return {}
  }
    
	/**
	 * csv file parsing and saving
	 */
	csvHandler (file, storeAI, storeLibrary, hashObject, fileBundle) {
		let headerLocal = {}
		const reader = new FileReader()
		reader.onload = function () {
			const lines = reader.result 
			let splitLines = lines.split(/\r\n|\n/)
			storeLibrary.linesLimit = splitLines.slice(0, 40)
			let fileContent = reader.result
			// if direct from beebee inform chat
			if (storeAI.dataBoxStatus !== true) {
				console.log('data box not open')
				// TODO send to beebee via socket but for now create reply here
				storeAI.qcount++
				let question = {}
				question.type ='bbai'
				question.reftype = 'ignore'
				question.action = 'question'
				question.data = { "count": storeAI.qcount, "text": "Upload of file", "active": true, "time": new Date() }
				let hashQuestion = hashObject(question.data + file.file.name)
				// extract headers assume first line
				const localHeaderExtract = (lineOne) => {
					let headerInfo = lineOne.split(',')
					return headerInfo
				}
				headerLocal[hashQuestion] = localHeaderExtract(splitLines[0])

				storeLibrary.fileBund.content = fileContent
				// build for chart interface
				question.bbid = hashQuestion
				let fileData = {}
				fileData.content = { text: 'summary of file data file is csv, heading are:', filedata: { type: 'csv', file: fileBundle, columns: 'one', grid: storeLibrary.linesLimit }, prompt: 'Select data to chart:', options: headerLocal[hashQuestion], }
				fileData.bbid = hashQuestion
				storeLibrary.uploadHolder.push({ uploadid: hashQuestion, data: fileData })
				console.log(storeLibrary.uploadHolder)
				// if csv  active viewer
				// storeLibrary.csvpreviewLive = true
			} else {
				console.log('yes data box open')
				// extract headers assume first line
				const localHeaderExtract = (lineOne) => {
					let headerInfo = lineOne.split(',')
					return headerInfo
				}
				let headerLocal = localHeaderExtract(splitLines[0])
				// make columns in standard form object
				let columnStructure = []
				let scount = 0
				for (let head of headerLocal) {
					columnStructure.push({ cid: scount, name: head })
					scount++
				}
				// build for library upload
				console.log('ATTACHE NAME TO DIRECT LIBRARY UPLOAD')
				console.log(fileBundle)
				storeLibrary.newPackagingForm.apicolumns = headerLocal
				storeLibrary.newDatafile.columns = columnStructure
				storeLibrary.newDatafile.path = 'csv'
				storeLibrary.newDatafile.file = fileBundle.name
				let parseInfo = {}
				parseInfo.source = fileBundle.source
				parseInfo.cnumber = 0
				storeLibrary.newDatafile.info = parseInfo
				// route data to be dave via HOP
				console.log('this active')
				console.log(this)
			  this.fileStorePath(storeLibrary, fileContent)

			}
		}.bind(this) // Bind 'this' to the correct context

		reader.onerror = function() {
			console.log(reader.error)
		}
		reader.readAsText(file.file)
		// const reader2 = new FileReader();
		// reader2.readAsArrayBuffer(file.file)

	}

	/**
	 *  @method fileStorePath
	*/
	fileStorePath (storeLibrary, fileContent) {
		console.log('store path csv join or not???')
		if (storeLibrary.joinNXP !== true) {
			console.log('not join')
		// prepare message structure
		 // this.saveDataHop(storeLibrary, fileContent)	
	} else {
		console.log('yes part of JOIN process')
		this.saveDataHop(storeLibrary, fileContent)
		// close the upload
		storeLibrary.uploadStatus = false
		//storeLibrary.joinNXPprocess(messageHOP)  // just route to send message so deleete now
	}
	} 

	/**
	* pass stream i.e. large file data to hop for storage
	*/
	saveStreamDataHop (storeLibrary, chunk) {
		let messageHOP = {}
		messageHOP.type = 'library'
		messageHOP.action = 'contracts'
		messageHOP.reftype = 'save-file'
		messageHOP.privacy = 'private'
		messageHOP.task = 'PUT-stream'
		messageHOP.data = chunk
		// close the upload
		storeLibrary.uploadStatus = false
		storeLibrary.sendMessage(messageHOP)
	}

	/**
	* pass data to hop for storage
	*/
	saveDataHop (storeLibrary, fileContent) {
		let dataSend = {}
		dataSend.columns = storeLibrary.newDatafile.columns
		dataSend.path = storeLibrary.newDatafile.path
		dataSend.type = storeLibrary.newDatafile.path
		dataSend.file =	storeLibrary.newDatafile.file
		dataSend.info =	storeLibrary.newDatafile.info
		dataSend.content = fileContent

		let messageHOP = {}
		messageHOP.type = 'library'
		messageHOP.action = 'contracts'
		messageHOP.reftype = 'save-file'
		messageHOP.privacy = 'private'
		messageHOP.task = 'PUT'
		messageHOP.data = dataSend
		// close the upload
		storeLibrary.uploadStatus = false
		console.log('save file csv')
		console.log(messageHOP)
		storeLibrary.sendMessage(messageHOP)
	}

}

export default FileHandler