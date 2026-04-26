'use strict'

// import { match } from 'assert'

/**
*  position utilty for bento spaces
*
*
* @class PositionUtility
* @package    LKN health
* @copyright  Copyright (c) 2022 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// const util = require('util')
// const events = require('events')


class PositionUtility {

  constructor() {
    // super()
    this.ctx = {}
    this.scale = 50
    this.zoom = 1
    this.liveSpaceCoord = {}
    this.liveMinimapCoord = {}
    this.mouseHistory = {}
    this.firstClick = false
    this.spaceClick = false
    this.minimClick = false
  }

  /**
  * set the minimap canvas context
  * @method setCanvas
  *
  */
  setCanvas  = function (canvascontext) {
    this.ctx = canvascontext
  }

  /**
  * hide the canvas minimap
  * @method hideShowMinimap
  *
  */
  hideShowMinimap = function (status) {
    this.ctx.canvas.hidden = status
  }

  /**
  * set the minimap canvas context
  * @method setZoom
  *
  */
  setZoom = function (zoom) {
    this.zoom = zoom
  }

  /**
  * prepare grid layout for display per module type.
  * @method displayPrepareModules
  *
  */
  startPositionSpace = function (nxpID, spaceCoord, setupType) {
    let coord = {}
    // are setting up coords for first time or from save bentospace?
    if (setupType !== 'saved') {
      // loop over existing coordination and avoid clash
      let spaceItems = Object.keys(this.liveSpaceCoord)
      // need to extract farthest right x coord and add right of it
      let coordList = []
      if (spaceItems.length !== 0) {
        spaceItems.forEach(
          element => coordList.push(spaceCoord[element])
        )
        coord.x = 20 + (spaceItems.length * 1600) + 20
        coord.y = 20
      } else {
        coord = { x: 20, y: 20 }
      }
    } else {
      // set coord direct from bentospace saved info
      coord = spaceCoord
    }
    // need to both add and remove and change position
    this.liveSpaceCoord[nxpID] = coord
    return coord
  }

  /**
  * prepare grid layout for display per module type.
  * @method displayPrepareModules
  *
  */
  startPositionCellspace = function (mcount, cells, spaceCoord, setupType) {
    let cellCount = cells.length
    let cellPostions = []
    // are setting up coords for first time or from save bentospace?
    if (setupType === 'cell') {
      // make sure each cell has a unquie space
      for (let cl of cells) {
        let coord = {}
        coord.x = 200 * (cellCount * mcount)
        coord.y = 200 * (cellCount * mcount)
        coord.cell = cl
        cellPostions.push(coord)
        cellCount++
      }
    } else {
      // cellPostions.push(coord)
    }
    return cellPostions
  }

  /**
  * draw the current dashboard mini map locations
  * @method miniMapLocations
  *
  */
   miniMapLocations = function () {
    const localthis = this
    function placeBBox (box, scale, zoom) {
      let xStart = box.left / (scale * zoom)
      let yStart = box.top / (scale * zoom)
      localthis.ctx.beginPath()
      localthis.ctx.strokeStyle = '#000000'
      localthis.ctx.rect(xStart, yStart, 15, 30)
      localthis.ctx.stroke()
    }
    let liveBBox = Object.keys(this.liveSpaceCoord)
    liveBBox.forEach(
      element => placeBBox(this.liveSpaceCoord[element], this.scale, this.zoom))
  }

  /**
  * mouse minidash collition ie closest to minimouse click
  * @method collisionMiniDash
  *
  */
  collisionMiniDash = function (miniMouse) {
    let dashMatch = {}
    let distanceList = []
    function collitionMatch (mdash, mmouse, scale, zoom) {
      let xSq = ((mdash.x / (scale * zoom)) - mmouse.x) * ((mdash.x / (scale * zoom)) - mmouse.x)
      let ySq = ((mdash.y / (scale * zoom)) - mmouse.y) * ((mdash.y / (scale * zoom)) - mmouse.y)
      let zDist = Math.sqrt((xSq + ySq))
      let trackCoord = {}
      trackCoord.dist = zDist
      trackCoord.dash = mdash
      distanceList.push(trackCoord)
    }

    let liveBBox = Object.keys(this.liveSpaceCoord)
    if (liveBBox.length > 0) {
      liveBBox.forEach(
        element => collitionMatch(this.liveSpaceCoord[element], miniMouse, this.scale, this.zoom))
      let lowest = distanceList.sort(function (a, b) {
        return a.dist - b.dist
      })
      // whick is closest?  Return coordion of that dashboard
      dashMatch = lowest[0].dash
    } else {
      console.log('no dashboard on space')
    }
    return dashMatch
  }

  /**
  * clear the mini map ready for update
  * @method clearMMap
  *
  */
  clearMMap = function (newCoord) {
    let liveBBox = Object.keys(this.liveSpaceCoord)
    for (let mmkey of liveBBox) {
      if (newCoord === mmkey) {
        delete this.liveSpaceCoord[mmkey]
      }
    }
    this.ctx.clearRect(0, 0, 200, 200)
  }

  /**
  * draw the current mini this of bentospace
  * @method drawmMap
  *
  */
  drawmMMap = function () {
    console.log('in annimation mode draw updates to minimap')
  }

  /**
  * scroll to selected miniMap dashboard rectangle
  * @method scrollTODashboard
  *
  */
  scrollTODashboard = function (miniMouse) {
    let mMouse = {}
    mMouse.x = miniMouse.offsetX
    mMouse.y = miniMouse.offsetY
    // identify click minidash closest to mouse click on minimap
    let scrollMatch = this.collisionMiniDash(mMouse)
    // executue scrollTO  dashboard-space
    // window.scrollTo(scrollMatch.x, scrollMatch.y)
    // document.getElementById('dashboard-placeholder').scrollIntoView()
    // document.getElementById('single-space').scrollIntoView(false) // { behavior: 'smooth', block: 'end', inline: 'nearest' })
    // window.scrollBy(-1600, 1600)
    // document.getElementById('dashboard-placeholder').scroll = true
    window.scroll(scrollMatch.left, scrollMatch.top)
    // window.scroll(5000, 5000)
    const element = document.getElementById('bentospace-holder')
    let x = element.scrollLeft
    let y = element.scrollTop
    const elementm = document.getElementById('bentospace-holder')
    elementm.scrollLeft = 0
    elementm.scrollTop = 0
  }

  /**
  * update locations of Dashboards and minimap
  * @method updateMMapSpace
  *
  */
  updateMMapSpace = function (newCoord) {
    this.clearMMap()
    // update mini coords  update nxp key
    this.liveSpaceCoord[newCoord.nxp] = newCoord
    // redraw the dashboards and mouse pointer
    this.miniMapLocations()
    return this.liveSpaceCoord[newCoord.nxp]
  }

  /**
  * remove location of Dashboards and minimap
  * @method removeMMapSpace
  *
  */
  removeMMapSpace = function (newCoord) {
    this.clearMMap()
    // update mini coords  remove nxp key
    delete this.liveSpaceCoord[newCoord]
    // redraw the dashboards and mouse pointer
    this.miniMapLocations()
    return this.liveSpaceCoord[newCoord.nxp]
  }

  /**
  * draw postition of mouse pointer
  * @method updateMmap
  *
  */
  mousePointer = function (update) {
    if (this.firstClick !== true) {
      // this.ctx.clearRect(0, 0, 200, 200)
      this.ctx.beginPath()
      this.ctx.strokeStyle = 'lightgrey'
      this.ctx.lineWidth = '3'
      this.ctx.rect(this.mouseHistory.x, this.mouseHistory.y, 10, 10)
      this.ctx.stroke()
      this.ctx.closePath()
    } else {
      this.firstClick = false
    }
    let xStart = update.x / this.scale
    let yStart = update.y / this.scale
    let mousePair = {}
    mousePair.x = xStart
    mousePair.y = yStart
    this.mouseHistory = mousePair
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#FF0000'
    this.ctx.lineWidth = '1'
    this.ctx.rect(xStart, yStart, 10, 10)
    this.ctx.stroke()
    this.ctx.closePath()
  }

}

export default PositionUtility
