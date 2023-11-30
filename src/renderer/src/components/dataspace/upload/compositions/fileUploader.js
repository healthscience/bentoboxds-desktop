export async function uploadFile(file, url) {
	// set up the request data
	let formData = new FormData()
	formData.append('file', file.file)

	// track status and upload file
	file.status = 'loading'
	let response = await fetch(url, { method: 'POST', body: formData })

	// change status to indicate the success of the upload request
	file.status = response.ok

	return response
}

export function uploadFiles(files, url) {
  console.log('files in')
  console.log(files)
	// return Promise.all(files.map((file) => uploadFile(file, url)))
  // return Promise.all(files.map((file) => loadTextFromFile(file, url)))
  return files.map((file) => loadTextFromFile(file, url))
}

export function loadTextFromFile (ev, url) {
  console.log('file input')
  console.log(ev)
  let sourceLocation = 'local'
  const localthis = this
  let fileData = ev
  let fileName = fileData.file.name
  let filepath = fileData.url
  let fileType = 'sqlite'
  /* const reader = new FileReader()
  reader.onloadend = function () {
    // const fileData = reader.result
  }
  reader.readAsText(filepath) */
  console.log('file url')
  console.log(fileData.url)
  let fileContent = {}
  const reader2 = new FileReader()
  reader2.readAsText(ev)
  // reader2.readAsDataURL(fileData.url)
  reader2.onload = function (e) {
    fileContent = e.target.result
    console.log('file conetnt')
    console.log(fileContent)
  }

  let lineBundle =
  {
    cnumber: '',
    dataline: '',
    delimiter: '',
    datetype: ''
  }

  const fileBund = {}
  fileBund.name = fileName
  fileBund.source = sourceLocation
  fileBund.websource = '' // readRemotefile
  fileBund.web = 'weblocal'
  fileBund.path = filepath
  fileBund.content = fileContent
  fileBund.type = fileType
  fileBund.info = lineBundle
  return fileBund
}


export default function createUploader(url) {
	return {
		uploadFile: function (file) {
			return uploadFile(file, url)
		},
		uploadFiles: function (files) {
			return uploadFiles(files, url)
		},
    loadTextFromFile: function () {
      return loadTextFromFile(url)
    }
	}
}