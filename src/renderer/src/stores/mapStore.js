import { defineStore } from 'pinia'
import { bentoboxStore } from "@/stores/bentoboxStore.js"
import VisPositionUtility from '@/stores/hopUtility/positionUtility.js'

export const mapminiStore = defineStore('mapministore', {
  state: () => ({
    storeBentoBox: bentoboxStore(),
    liveSpaceCoord: {},
    c: {},
    ctx: new VisPositionUtility(),
    spaceClick: true,
    minmapClick: false,
    mouseClickCount: 0
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    setMapstyle (style) {
      console.log(style)
    },
    actionSetminmap (update) {
      this.ctx.setCanvas(update)
    },
    actionResetMmap () {
      this.ctx.clearMMap()
    },
    actionPostionCoordMouse (update) {
      // has the minimouse area been clicked?
      this.ctx.mousePointer(update)
    },
    actionPostionCoord (spaceID) {
      let boxesInspace = Object.keys(this.storeBentoBox.locationBbox[spaceID])
      for (let bbox of boxesInspace) {
        // extract current coords
        let currentCoord = {}
        currentCoord.bboxid = spaceID
        currentCoord.coord = this.storeBentoBox.locationBbox[spaceID][bbox]
        currentCoord.type = 'saved'
        // keep track of position in bento space
        this.ctx.startPositionSpace(currentCoord.bboxid, currentCoord.coord, currentCoord.type)
        // Vue.set(this.liveSpaceCoord, update.nxp, positionTrack)
        // update the minimap
        this.ctx.miniMapLocations()
      }
    },
    actionClearPosition () {
      let coordKeys = Object.keys(this.liveSpaceCoord)
      const clearCoord = { ...this.liveSpaceCoord }
      for (let ck of coordKeys) {
        delete clearCoord[ck]
      }
    },
    actionMMapMove (update) {
      // context.rootState.activeScalevalue = 1
      this.ctx.scrollTODashboard(update)
    },
    actionDashBmove (update) {
      let updateCOORD = this.ctx.updateMMapSpace(update)
      let updateXY = {}
      updateXY.x = updateCOORD.x
      updateXY.y = updateCOORD.y
      // Vue.set(this.liveSpaceCoord, inVerified.nxp, updateXY) use
    },
    actionDashBRemove (update) {
      // let updateCOORD = state.ctx.removeMMapSpace(inVerified)
      this.ctx.removeMMapSpace(update)
      /* let updateXY = {}
      updateXY.x = updateCOORD.x
      updateXY.y = updateCOORD.y
      Vue.set(state.liveSpaceCoord, inVerified.nxp, updateXY) */
    },
    actionZoomset (update) {
      this.ctx.setZoom(update)
    },
    actionRefreshminimap (update) {
      console.log(update)
    }
  }
})