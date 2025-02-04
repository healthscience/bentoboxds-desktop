'use strict'
import { Info } from 'luxon'
/**
*  CuesUtility
*
*
* @class CuesUtility
* @package    CuesUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'
import hashObject from 'object-hash'

class CuesUtility {

  constructor() {
    // super()
    this.trackGaia = []
  }

  /**
  * match cue to another
  * @method cueMatch
  *
  */
  cueMatch = function (cueIn, cueLive) {
    let cueContract = {}
    for (let cue of cueLive) {
      if (cue.key === cueIn) {
        cueContract = cue
      }
    }
    return cueContract
  }

  /**
   * offer default cues
   * @method cuesDefaults
  */
  cuesDefault = function () {
    // build data cue holder
    let cueHolder = {}
    cueHolder.cuid = cueID // ask LLM to prepare ref contract next release tiny LLM
    cueHolder.name = cueName.value
    cueHolder.relationship = cuesNew.value
    // storeLibrary.sendMessage(refContract)
    // save cues & relationship(s)
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'public'
    cueContract.data = cueHolder
    storeLibrary.sendMessage(cueContract)
  }

  /**
  * prepare save cue contract
  * @method prepareCuesContractPrime
  *
  */
  prepareCuesContractPrime = function (cueInfo) {
    // structure inputs for cue contract
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'public'
    let cueHolder = {}
    let concept = {}
    concept.name = cueInfo.name
    concept.settings = { glue: 'prime', datatype: cueInfo.contract.key, backgroundColor: cueInfo.color }
    cueHolder.concept = concept
    cueHolder.computational = { relationships: [] } 
    cueContract.data = cueHolder
    return cueContract
  }

  /**
  * take four down cues and add to gaia cue contract
  * @method updataGaiaRelationships
  *
  */
  updataGaiaRelationships = function (contract) {
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'public'
    let cueHolder = {}
    cueHolder.refdatatype = contract.key // ask LLM to prepare ref contract next release tiny LLM
    cueHolder.name = contract.concept.name
    for (let cue of this.trackGaia) {
      cueHolder.relationship.push({ glue: 'down', datatype: cue, display: { labels: [''], datasets: [{ backgroundColor: [ 'blue' ], data: [ 360 ] }] } })
    }
    cueContract.data = cueHolder
    return cueContract
  }

  /**
   * parepare cue display data structure
   * @method cueDisplayMake
  */
  cueDisplayMake = function (cueKey, cueRel, existingRels) {
    let existingLabels = []
    let existingDatasets = {}
    // first time add?
    if (Object.keys(existingRels).length === 0 ) {
      existingRels = {
        labels: [],
        datasets: {
          backgroundColor: [],
          data: []
        }
      }
    }
    // capture existing label and dataset arrays
    existingLabels = existingRels.labels
    if (existingRels.datasets.length > 0) {
      existingDatasets = existingRels.datasets[0]
    } else {
      existingDatasets = existingRels.datasets
    }
    // add new label and dataset
    existingLabels.push(cueRel.value.concept.name)
    existingDatasets.backgroundColor.push(cueRel.value.concept.settings.backgroundColor)
    // size of each segment
    let segUpdate = this.prepareSegmentSize(existingLabels.length)
    existingDatasets.data = segUpdate
    // structure needed{ labels: [ dataCue.contract.value.concept.name], datasets: [{ backgroundColor: [colorCue], data: [ 360 ] }] }
    let displayData = {}
    displayData = { labels: existingLabels, datasets: [{ backgroundColor: existingDatasets.backgroundColor, data: existingDatasets.data }] }
    return displayData
  }

  /* look at relationship type and update cue wheel
  * @method prepareGlueWheel
  *
  */
  prepareGlueWheel = function (glueType, cueData, cueList) {
    let glueClueData = {}
    let beebeeFeedback = ''
    let glueWheel = []
    if (cueData.value.computational?.relationships[glueType] !== undefined) {
      for (let cl of cueData.value.computational.relationships[glueType]) {
        // match to cue contract and extract name info for label
        if (cl) {
          const matchedItem = cueList.find(item => item.key === cl)
          // match datatype key to contract info to get name
          glueWheel.push(matchedItem)
        } else {
          console.log('no relationship')
        }
      }
      // prepare segment size
      let segmentSize = 0
      let segmentNumber = glueWheel.length
      if (segmentNumber > 0) {
        segmentSize = 360 / segmentNumber
      }
      // loop over and prepare display data structure
      let wheelDisplay = {}
      let cueLabels = []
      let cueDatasets = {}
      let cueColors = []
      let segList = []
      for (let cue of glueWheel) {
        // look up datatype contract
        cueLabels.push(cue.value.concept.name)
        cueColors.push(cue.value.concept.settings.backgroundColor)
        segList.push(segmentSize)
      }
      cueDatasets = { backgroundColor: cueColors, data: segList }
      wheelDisplay = { labels: cueLabels, datasets: [cueDatasets] }
      glueClueData = {}
      glueClueData.expandedcues = glueWheel
      glueClueData.wheeldata = wheelDisplay
      glueClueData.feedback = beebeeFeedback
      return glueClueData
    } else {
      glueClueData.wheeldata = { labels: [], datasets: [{ backgroundColor: [], data: [] }] }
      glueClueData.feedback = 'no relationship found'
      return glueClueData
    }

  }

  /* prepare segment size
  * @method prepareSegmentSize
  *
  */
  prepareSegmentSize = function (noSegs) {
    let segArray = []
    let segmentSize = 360 / noSegs
    for (let i = 0; i < noSegs; i++) {
      segArray.push(segmentSize)
    }
    return segArray
  }

  /* prepare save contract message
  * @method prepareDTgaiaMessage
  *
  */
  prepareDTgaiaMessage = function (contract) {
    let gaiaJack = []
    // gaia
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary =  true
    dtSettings.name = 'gaia'
    dtSettings.description = 'sovereign intelligence'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Gaia_hypothesis'
    dtSettings.rdf = 'https://dbpedia.org/page/Gaia_hypothesis'
    dtSettings.measurement = 'Integer' 
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)
    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary =  true
    dtSettings1.name = 'nature'
    dtSettings1.description = 'rolling out of universe'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Nature'
    dtSettings1.rdf = 'https://dbpedia.org/page/Nature'
    dtSettings1.measurement = 'Integer' 
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)
    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary =  true
    dtSettings2.name = 'environment'
    dtSettings2.description = ''
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Built_environment'
    dtSettings2.rdf = 'https://dbpedia.org/page/Built_environment'
    dtSettings2.measurement = 'Integer' 
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)
    // culture
    const refContract3 = {}
    refContract3.type = 'library'
    refContract3.action = 'contracts'
    refContract3.reftype = 'datatype'
    refContract3.task = 'PUT'
    refContract3.privacy = 'public'
    let dtSettings3 = {}
    dtSettings3.primary =  true
    dtSettings3.name = 'culture'
    dtSettings3.description = 'humanity invention'
    dtSettings3.wiki = 'https://en.wikipedia.org/wiki/Culture'
    dtSettings3.rdf = 'https://dbpedia.org/page/Culture'
    dtSettings3.measurement = 'Integer' 
    dtSettings3.datatypeType = 'datatype'
    refContract3.data = dtSettings3
    gaiaJack.push(refContract3)
    // life
    const refContract4 = {}
    refContract4.type = 'library'
    refContract4.action = 'contracts'
    refContract4.reftype ='datatype'
    refContract4.task = 'PUT'
    refContract4.privacy = 'public'
    let dtSettings4 = {}
    dtSettings4.primary =  true
    dtSettings4.name = 'life'
    dtSettings4.description = 'be alive'
    dtSettings4.wiki = 'https://en.wikipedia.org/wiki/Life'
    dtSettings4.rdf = 'https://dbpedia.org/page/Life'
    dtSettings4.measurement = 'Integer' 
    dtSettings4.datatypeType = 'datatype'
    refContract4.data = dtSettings4
    gaiaJack.push(refContract4)
    return gaiaJack
  }

  /* prepare save contract message
  * @method prepareDTnatureMessage
  *
  */
  prepareDTnatureMessage = function (contract) {
    let gaiaJack = []
    // gaia
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary =  true
    dtSettings.name = 'universe'
    dtSettings.description = 'stuff and everything'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Universe'
    dtSettings.rdf = 'https://dbpedia.org/page/Universe'
    dtSettings.measurement = 'Integer' 
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)
    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary =  true
    dtSettings1.name = 'climate'
    dtSettings1.description = 'weather over time'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Climate'
    dtSettings1.rdf = 'https://dbpedia.org/page/Climate'
    dtSettings1.measurement = 'Integer' 
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)
    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary =  true
    dtSettings2.name = 'biodiversity'
    dtSettings2.description = 'life on earth'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Biodiversity'
    dtSettings2.rdf = 'https://dbpedia.org/page/Biodiversity'
    dtSettings2.measurement = 'Integer' 
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)
    return gaiaJack
  }

    /* prepare save contract message
  * @method prepareDTenvironmentMessage
  *
  */
  prepareDTenvironmentMessage = function (contract) {
    let gaiaJack = []
    // gaia
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary =  true
    dtSettings.name = 'agriculture'
    dtSettings.description = 'farming and gardening'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Agriculture'
    dtSettings.rdf = 'https://dbpedia.org/page/Agriculture'
    dtSettings.measurement = 'Integer' 
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)
    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary =  true
    dtSettings1.name = 'building'
    dtSettings1.description = 'shelter to living accommodation to factories'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Building'
    dtSettings1.rdf = 'https://dbpedia.org/page/Building'
    dtSettings1.measurement = 'Integer' 
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)
    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary =  true
    dtSettings2.name = 'travel'
    dtSettings2.description = 'moving around'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Travel'
    dtSettings2.rdf = 'https://dbpedia.org/page/Travel'
    dtSettings2.measurement = 'Integer' 
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)
    return gaiaJack
  }
  
  /* prepare save contract message
  * @method prepareDTcultureMessage
  *
  */
  prepareDTcultureMessage = function (contract) {
    let gaiaJack = []
    // gaia
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary =  true
    dtSettings.name = 'economy'
    dtSettings.description = 'human sytem to allocate resources'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Economy'
    dtSettings.rdf = 'https://dbpedia.org/page/Economy'
    dtSettings.measurement = 'Integer' 
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)
    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary =  true
    dtSettings1.name = 'work'
    dtSettings1.description = 'human activity to produce goods and services'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Work_(human_activity)'
    dtSettings1.rdf = 'https://dbpedia.org/page/Work_(human_activity)'
    dtSettings1.measurement = 'Integer' 
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)
    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary =  true
    dtSettings2.name = 'arts'
    dtSettings2.description = 'human expression of creativity'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/The_arts'
    dtSettings2.rdf = 'https://dbpedia.org/page/The_arts'
    dtSettings2.measurement = 'Integer' 
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)
    return gaiaJack
  }

  /* prepare save contract message
  * @method prepareDTlifeMessage
  *
  */
  prepareDTlifeMessage = function (contract) {
    let gaiaJack = []
    // gaia
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary =  true
    dtSettings.name = 'food'
    dtSettings.description = 'eating of nutritious plants and animals'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Food'
    dtSettings.rdf = 'https://dbpedia.org/page/Food'
    dtSettings.measurement = 'Integer' 
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)
    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary =  true
    dtSettings1.name = 'movement'
    dtSettings1.description = 'movement of body'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Physical_activity'
    dtSettings1.rdf = 'https://dbpedia.org/page/Physical_activity'
    dtSettings1.measurement = 'Integer' 
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)
    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary =  true
    dtSettings2.name = 'mind'
    dtSettings2.description = 'thinking, feeling and sleeping'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Mind'
    dtSettings2.rdf = 'https://dbpedia.org/page/Mind'
    dtSettings2.measurement = 'Integer' 
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)
    return gaiaJack
  }  

  /* prepare save contract message
  * @method prepareDTagingMessage
  *
  */
  prepareDTagingMessage = function (contract) {
    let gaiaJack = []
    // 
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary =  true
    dtSettings.name = 'Hallmarks of aging'
    dtSettings.description = 'How to categorise aging'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Hallmarks_of_aging'
    dtSettings.rdf = 'https://dbpedia.org/page/Hallmarks_of_aging'
    dtSettings.measurement = 'Integer' 
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)
    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary =  true
    dtSettings1.name = 'Genome instability'
    dtSettings1.description = 'Genome changes with time'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Genome_instability'
    dtSettings1.rdf = 'https://dbpedia.org/page/Genome_instability'
    dtSettings1.measurement = 'Integer' 
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)
    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary =  true
    dtSettings2.name = 'Telomere'
    dtSettings2.description = 'Telomere length over time'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Telomere#Shortening'
    dtSettings2.rdf = 'https://dbpedia.org/page/Telomere#Shortening'
    dtSettings2.measurement = 'Integer' 
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)
    const refContract3 = {}
    refContract3.type = 'library'
    refContract3.action = 'contracts'
    refContract3.reftype = 'datatype'
    refContract3.task = 'PUT'
    refContract3.privacy = 'public'
    let dtSettings3 = {}
    dtSettings3.primary =  true
    dtSettings3.name = 'Epigenetics'
    dtSettings3.description = 'Epigenetics changes with time'
    dtSettings3.wiki = 'https://en.wikipedia.org/wiki/Epigenetics'
    dtSettings3.rdf = 'https://dbpedia.org/page/Epigenetics'
    dtSettings3.measurement = 'Integer' 
    dtSettings3.datatypeType = 'datatype'
    refContract3.data = dtSettings3
    gaiaJack.push(refContract3)
    // nature
    const refContract4 = {}
    refContract4.type = 'library'
    refContract4.action = 'contracts'
    refContract4.reftype = 'datatype'
    refContract4.task = 'PUT'
    refContract4.privacy = 'public'
    let dtSettings4 = {}
    dtSettings4.primary =  true
    dtSettings4.name = 'Proteostasis'
    dtSettings4.description = 'Proteostasis changes with time'
    dtSettings4.wiki = 'https://en.wikipedia.org/wiki/Proteostasis#Proteostasis_and_aging'
    dtSettings4.rdf = 'https://dbpedia.org/page/Proteostasis#Proteostasis_and_aging'
    dtSettings4.measurement = 'Integer' 
    dtSettings4.datatypeType = 'datatype'
    refContract4.data = dtSettings4
    gaiaJack.push(refContract4)
    // environment
    const refContract5 = {}
    refContract5.type = 'library'
    refContract5.action = 'contracts'
    refContract5.reftype = 'datatype'
    refContract5.task = 'PUT'
    refContract5.privacy = 'public'
    let dtSettings5 = {}
    dtSettings5.primary =  true
    dtSettings5.name = 'Nutrient sensing'
    dtSettings5.description = 'Nutrient sensing changes with time'
    dtSettings5.wiki = 'https://en.wikipedia.org/wiki/Nutrient_sensing'
    dtSettings5.rdf = 'https://dbpedia.org/page/Nutrient_sensing'
    dtSettings5.measurement = 'Integer' 
    dtSettings5.datatypeType = 'datatype'
    refContract5.data = dtSettings5
    gaiaJack.push(refContract5)    
    const refContract6 = {}
    refContract6.type = 'library'
    refContract6.action = 'contracts'
    refContract6.reftype = 'datatype'
    refContract6.task = 'PUT'
    refContract6.privacy = 'public'
    let dtSettings6 = {}
    dtSettings6.primary =  true
    dtSettings6.name = 'Mitochondrion'
    dtSettings6.description = 'Mitochondrion changes with time'
    dtSettings6.wiki = 'https://en.wikipedia.org/wiki/Mitochondrion#Relationships_to_aging'
    dtSettings6.rdf = 'https://dbpedia.org/page/Mitochondrion#Relationships_to_aging'
    dtSettings6.measurement = 'Integer' 
    dtSettings6.datatypeType = 'datatype'
    refContract6.data = dtSettings6
    gaiaJack.push(refContract6)
    // nature
    const refContract7 = {}
    refContract7.type = 'library'
    refContract7.action = 'contracts'
    refContract7.reftype = 'datatype'
    refContract7.task = 'PUT'
    refContract7.privacy = 'public'
    let dtSettings7 = {}
    dtSettings7.primary =  true
    dtSettings7.name = 'Cellular senescence'
    dtSettings7.description = 'Cellular senescence changes with time'
    dtSettings7.wiki = 'https://en.wikipedia.org/wiki/Cellular_senescence'
    dtSettings7.rdf = 'https://dbpedia.org/page/Cellular_senescence'
    dtSettings7.measurement = 'Integer' 
    dtSettings7.datatypeType = 'datatype'
    refContract7.data = dtSettings7
    gaiaJack.push(refContract7)
    // environment
    const refContract8 = {}
    refContract8.type = 'library'
    refContract8.action = 'contracts'
    refContract8.reftype = 'datatype'
    refContract8.task = 'PUT'
    refContract8.privacy = 'public'
    let dtSettings8 = {}
    dtSettings8.primary =  true
    dtSettings8.name = 'Stem cell exhaustion'
    dtSettings8.description = 'Stem cell exhaustion changes with time'
    dtSettings8.wiki = 'https://en.wikipedia.org/wiki/Stem_cell'
    dtSettings8.rdf = 'https://dbpedia.org/page/Stem_cell'
    dtSettings8.measurement = 'Integer' 
    dtSettings8.datatypeType = 'datatype'
    refContract8.data = dtSettings8
    gaiaJack.push(refContract8)
    // environment
    const refContract9 = {}
    refContract9.type = 'library'
    refContract9.action = 'contracts'
    refContract9.reftype = 'datatype'
    refContract9.task = 'PUT'
    refContract9.privacy = 'public'
    let dtSettings9 = {}
    dtSettings9.primary =  true
    dtSettings9.name = 'Inter-cellular communication'
    dtSettings9.description = 'Inter-cellular communication changes with time'
    dtSettings9.wiki = 'https://en.wikipedia.org/wiki/Cell_signaling'
    dtSettings9.rdf = 'https://dbpedia.org/page/Cell_signaling'
    dtSettings9.measurement = 'Integer' 
    dtSettings9.datatypeType = 'datatype'
    refContract9.data = dtSettings9
    gaiaJack.push(refContract9)
    return gaiaJack
  }

  /* prepare datatypes planet boundries
  * @method prepareDTplanetMessage
  *
  */
  prepareDTplanetMessage = function (contract) {
    let planetBoundries = []
    planetBoundries.push({ name: 'Earth planet boundaries', description: 'gaia', wikipedia: 'Planetary_boundaries' })
    planetBoundries.push({ name: 'Ozone depletion', description: '', wikipedia: 'Ozone_depletion' })
    planetBoundries.push({ name: 'Aresol loading', description: '', wikipedia: 'Aerosol' })
    planetBoundries.push({ name: 'Ocean acidification', description: '', wikipedia: 'Ocean_acidification' })
    planetBoundries.push({ name: 'Bio geochemical flows', description: '', wikipedia: 'Biogeochemistry' })
    planetBoundries.push({ name: 'Freshwater change', description: '', wikipedia: 'Water_scarcity' })
    planetBoundries.push({ name: 'Landsystem change', description: '', wikipedia: 'Land_use' })
    planetBoundries.push({ name: 'Biosphere integrity', description: '', wikipedia: 'Biodiversity_loss' })
    planetBoundries.push({ name: 'Climate change', description: '', wikipedia: 'Climate_change' })
    planetBoundries.push({ name: 'Novel entities', description: '', wikipedia: 'Pollution' })
    
    let gaiaJack = []
    for (let wiki of planetBoundries) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.reftype = 'datatype'
      refContract.task = 'PUT'
      refContract.privacy = 'public'
      let dtSettings = {}
      dtSettings.primary =  true
      dtSettings.name = wiki.name
      dtSettings.description = wiki.description
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/' + wiki.wikipedia
      dtSettings.rdf = 'https://dbpedia.org/page/' + wiki.wikipedia
      dtSettings.measurement = 'Integer' 
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
      gaiaJack.push(refContract)
    }
    return gaiaJack
  }

  /* prepare datatypes human body
  * @method prepareDTbodyMessage
  *
  */
  prepareDTbodyMessage = function (contract) {
    let bodyParts = []
    bodyParts.push({ name: 'Human', description: 'life animal sapien species', wikipedia: 'Human' })
    bodyParts.push({ name: 'Body', description: 'body of life', wikipedia: 'Human_body' })
    bodyParts.push({ name: 'Human organs', description: 'List_of_organs_of_the_human_body', wikipedia: 'List_of_organs_of_the_human_body' })
    bodyParts.push({ name: 'Skeleton system', description: 'Human musculoskeleta system', wikipedia: 'Human_musculoskeletal_system' })
    bodyParts.push({ name: 'Skeleton', description: '', wikipedia: 'Human_skeleton' })
    bodyParts.push({ name: 'Joint', description: '', wikipedia: 'Joint' })
    bodyParts.push({ name: 'Ligament', description: '', wikipedia: 'Ligament' })
    bodyParts.push({ name: 'Muscular system', description: '', wikipedia: 'Muscular_system' })
    bodyParts.push({ name: 'Tendon', description: '', wikipedia: 'Tendon' })

    bodyParts.push({ name: 'Digestive system', description: 'human digetion', wikipedia: 'Human_digestive_system' })
    bodyParts.push({ name: 'Mouth', description: 'breath, talk, taste', wikipedia: 'Human_mouth' })
    bodyParts.push({ name: 'Tooth', description: 'chew, bite', wikipedia: 'Human_tooth' })
    bodyParts.push({ name: 'Tongue', description: 'tatest siliva', wikipedia: 'Tongue' })
    bodyParts.push({ name: 'Lips', description: 'form speech smile', wikipedia: 'Lip' })
    bodyParts.push({ name: 'Salivary system', description: 'saliva', wikipedia: 'Salivary_gland' })
    bodyParts.push({ name: 'Saliva gland', description: 'produce spit', wikipedia: 'Parotid_gland' })
    bodyParts.push({ name: 'Submandibular gland', description: 'produce saliva', wikipedia: 'Submandibular_gland' })
    bodyParts.push({ name: 'Sublingual gland', description: 'produce saliva', wikipedia: 'Sublingual_gland' })
    bodyParts.push({ name: 'Pharynx', description: 'connect mouth to throat', wikipedia: 'Pharynx' })
    bodyParts.push({ name: 'Esophagus', description: 'Esophagus', wikipedia: 'Esophagus' })
    bodyParts.push({ name: 'Stomach', description: 'Stomach', wikipedia: 'Stomach' })
    bodyParts.push({ name: 'Small intestine', description: 'Small intestine', wikipedia: 'Small_intestine' })
    bodyParts.push({ name: 'Duodenum', description: 'Duodenum', wikipedia: 'Duodenum' })
    bodyParts.push({ name: 'Jejunum', description: 'Jejunum', wikipedia: 'Jejunum' })
    bodyParts.push({ name: 'Ileum', description: 'Ileum', wikipedia: 'Ileum' })
    bodyParts.push({ name: 'Large intestine', description: 'Large intestine', wikipedia: 'Large_intestine' })
    bodyParts.push({ name: 'Cecum', description: 'Cecum', wikipedia: 'Cecum' })
    bodyParts.push({ name: 'Ascending colon', description: 'Ascending colon', wikipedia: 'Ascending_colon' })
    bodyParts.push({ name: 'Transverse colon', description: 'Transverse colon', wikipedia: 'Transverse_colon' })
    bodyParts.push({ name: 'Descending colon', description: 'Descending colon', wikipedia: 'Descending_colon' })
    bodyParts.push({ name: 'Sigmoid colon', description: 'Sigmoid colon', wikipedia: 'Sigmoid_colon' })
    bodyParts.push({ name: 'Rectum', description: 'Rectum', wikipedia: 'Rectum' })
    bodyParts.push({ name: 'Liver', description: 'Liver', wikipedia: 'Liver' })
    bodyParts.push({ name: 'Gallbladder', description: 'Gallbladder', wikipedia: 'Gallbladder' })
    bodyParts.push({ name: 'Mesentery', description: 'Mesentery', wikipedia: 'Mesentery' })
    bodyParts.push({ name: 'Pancreas', description: 'Pancreas', wikipedia: 'Pancreas' })
    bodyParts.push({ name: 'Anal canal', description: 'Anal canal', wikipedia: 'Anal_canal' })

    bodyParts.push({ name: 'Breathing system', description: 'take in air to lungs', wikipedia: 'Respiratory_system' })
    bodyParts.push({ name: 'Nasal cavity', description: 'Nasal cavity', wikipedia: 'Nasal_cavity' })
    bodyParts.push({ name: 'Larynx', description: 'Larynx', wikipedia: 'Larynx' })
    bodyParts.push({ name: 'Trachea', description: 'Trachea', wikipedia: 'Trachea' })
    bodyParts.push({ name: 'Bronchus', description: 'Bronchus', wikipedia: 'Bronchus' })
    bodyParts.push({ name: 'Bronchiole', description: 'Bronchiole', wikipedia: 'Bronchiole' })
    bodyParts.push({ name: 'Lung', description: 'air oxgyen co2', wikipedia: 'Lung' })
    bodyParts.push({ name: 'Muscles of respiration', description: 'Muscles of respiration', wikipedia: 'Muscles_of_respiration' })

    bodyParts.push({ name: 'Urinary system', description: 'human waste', wikipedia: 'Urinary_system' })
    bodyParts.push({ name: 'Kidney', description: 'Kidney', wikipedia: 'Kidney' })
    bodyParts.push({ name: 'Ureter', description: 'Ureter', wikipedia: 'Ureter' })
    bodyParts.push({ name: 'Bladder', description: 'Bladder', wikipedia: 'Bladder' })
    bodyParts.push({ name: 'Urethra', description: 'Urethra', wikipedia: 'Urethra' })

    bodyParts.push({ name: 'Reproductive system', description: 'human fertility', wikipedia: 'Human_reproductive_system' })
    bodyParts.push({ name: 'Female reproductive system', description: 'Female reproductive system', wikipedia: 'Female_reproductive_system' })
    bodyParts.push({ name: 'Ovary', description: 'Ovary', wikipedia: 'Ovary' })
    bodyParts.push({ name: 'Fallopian tube', description: 'Fallopian tube', wikipedia: 'Fallopian_tube'})
    bodyParts.push({ name: 'Uterus', description: 'Uterus', wikipedia: 'Uterus' })
    bodyParts.push({ name: 'Cervix', description: 'Cervix', wikipedia: 'Cervix'})
    bodyParts.push({ name: 'Placenta', description: 'Placenta', wikipedia: 'Placenta' })
    bodyParts.push({ name: 'Vulva', description: 'Vulva', wikipedia: 'Vulva' })
    bodyParts.push({ name: 'Clitoris', description: 'Clitoris', wikipedia: 'Clitoris' })
    bodyParts.push({ name: 'Vagina', description: 'Vagina', wikipedia: 'Vagina'})       

    bodyParts.push({ name: 'Male reproductive system', description: 'Male reproductive system', wikipedia: 'Male_reproductive_system'})
    bodyParts.push({ name: 'Testicle', description: 'Testicle', wikipedia: 'Testicle' })
    bodyParts.push({ name: 'Epididymis', description: 'Epididymis', wikipedia: 'Epididymis'})
    bodyParts.push({ name: 'Vas deferens', description: 'Vas deferens', wikipedia: 'Vas_deferens' })
    bodyParts.push({ name: 'Seminal vesicles', description: 'Seminal vesicles', wikipedia: 'Seminal_vesicles'})    
    bodyParts.push({ name: 'Prostate', description: 'Prostate', wikipedia: 'Prostate'})
    bodyParts.push({ name: 'Bulbourethral gland', description: 'Bulbourethral gland', wikipedia: 'Bulbourethral_gland'})
    bodyParts.push({ name: 'Human penis', description: 'Human penis', wikipedia: 'Human_penis'})
    bodyParts.push({ name: 'Scrotum', description: 'Scrotum', wikipedia: 'Scrotum'})    

    bodyParts.push({ name: 'Endocrine system', description: 'human hormones', wikipedia: 'Endocrine_system' })
    bodyParts.push({ name: 'Pituitary gland', description: 'Pituitary gland', wikipedia: 'Pituitary_gland' })
    bodyParts.push({ name: 'Pineal gland', description: 'Pineal gland', wikipedia: 'Pineal_gland'})
    bodyParts.push({ name: 'Thyroid', description: 'Thyroid', wikipedia: 'Thyroid'})
    bodyParts.push({ name: 'Parathyroid gland', description: 'Parathyroid gland', wikipedia: 'Parathyroid_gland'})
    bodyParts.push({ name: 'Adrenal gland', description: 'Adrenal gland', wikipedia: 'Adrenal_gland'})
    bodyParts.push({ name: 'Pancreas', description: 'Pancreas', wikipedia: 'Pancreas'})

    bodyParts.push({ name: 'Heart system', description: 'heart beat and blood flow', wikipedia: 'Circulatory_system' })
    bodyParts.push({ name: 'Heart', description: 'Heart', wikipedia: 'Heart' })
    bodyParts.push({ name: 'Artery', description: 'Artery', wikipedia: 'Artery'})
    bodyParts.push({ name: 'Vein', description: 'Vein', wikipedia: 'Vein' })
    bodyParts.push({ name: 'Capillary', description: 'Capillary', wikipedia: 'Capillary'})
    bodyParts.push({ name: 'Lymphatic vessel', description: 'Lymphatic vessel', wikipedia: 'Lymphatic_vessel' })
    bodyParts.push({ name: 'Lymph node', description: 'Lymph node', wikipedia: 'Lymph_node'})
    bodyParts.push({ name: 'Bone marrow', description: 'Bone marrow', wikipedia: 'Bone_marrow' })
    bodyParts.push({ name: 'Thymus', description: 'Thymus', wikipedia: 'Thymus'})
    bodyParts.push({ name: 'Spleen', description: 'Spleen', wikipedia: 'Spleen' })
    bodyParts.push({ name: 'Tonsil', description: 'Tonsil', wikipedia: 'Tonsil'})
    bodyParts.push({ name: 'Interstitium', description: 'Interstitium', wikipedia: 'Interstitium' })

    bodyParts.push({ name: 'Nervous system', description: 'senses and brain', wikipedia: 'Nervous_system' })
    bodyParts.push({ name: 'Human brain', description: 'Human brain', wikipedia: 'Human_brain' })
    bodyParts.push({ name: 'Cerebral hemisphere', description: 'Cerebral hemisphere', wikipedia: 'Cerebral_hemisphere'})
    bodyParts.push({ name: 'Thalamus', description: 'Thalamus', wikipedia: 'Thalamus' })
    bodyParts.push({ name: 'Hypothalamus', description: 'Hypothalamus', wikipedia: 'Hypothalamus'})
    bodyParts.push({ name: 'Midbrain', description: 'Midbrain', wikipedia: 'Midbrain' })
    bodyParts.push({ name: 'Cerebellum', description: 'Cerebellum', wikipedia: 'Cerebellum'})
    bodyParts.push({ name: 'Pons', description: 'Pons', wikipedia: 'Pons' })
    bodyParts.push({ name: 'Medulla oblongata', description: 'Medulla oblongata', wikipedia: 'Medulla_oblongata'})
    bodyParts.push({ name: 'Spinal cord', description: 'Spinal cord', wikipedia: 'Spinal_cord' })
    bodyParts.push({ name: 'Choroid plexus', description: 'Choroid plexus', wikipedia: 'Choroid_plexus'})
    bodyParts.push({ name: 'Nerve', description: 'Nerve', wikipedia: 'Nerve' })
    bodyParts.push({ name: 'Cranial nerves', description: 'Cranial nerves', wikipedia: 'Cranial_nerves'})
    bodyParts.push({ name: 'Spinal nerves', description: 'Spinal nerves', wikipedia: 'Spinal_nerve'})
    bodyParts.push({ name: 'Ganglion', description: 'Ganglion', wikipedia: 'Ganglion' })
    bodyParts.push({ name: 'Enteric nervous system', description: 'Enteric nervous system', wikipedia: 'Enteric_nervous_system'})
    bodyParts.push({ name: 'Head', description: 'Head', wikipedia: 'Head' })
    bodyParts.push({ name: 'Cornea', description: 'Cornea', wikipedia: 'Cornea'})
    bodyParts.push({ name: 'Ear', description: 'Ear', wikipedia: 'Ear' })
    bodyParts.push({ name: 'Nose', description: 'Nose', wikipedia: 'Nose'})

    bodyParts.push({ name: 'Skin system', description: 'skin', wikipedia: 'Integumentary_system' })
    bodyParts.push({ name: 'Mammary gland', description: 'Mammary gland', wikipedia: 'Mammary_gland'})
    bodyParts.push({ name: 'Skin', description: 'Skin', wikipedia: 'Human_skin'})
    bodyParts.push({ name: 'Hair', description: 'Hair', wikipedia: 'Hair'})

    
    let gaiaJack = []
    for (let wiki of bodyParts) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.reftype = 'datatype'
      refContract.task = 'PUT'
      refContract.privacy = 'public'
      let dtSettings = {}
      dtSettings.primary =  true
      dtSettings.name = wiki.name
      dtSettings.description = wiki.description
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/' + wiki.wikipedia
      dtSettings.rdf = 'https://dbpedia.org/page/' + wiki.wikipedia
      dtSettings.measurement = 'Integer' 
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
      gaiaJack.push(refContract)
    }
    return gaiaJack
  }

}

  export default CuesUtility