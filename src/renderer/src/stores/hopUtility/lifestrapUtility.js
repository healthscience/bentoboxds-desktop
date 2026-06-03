'use strict'
/**
*  LifestrapUtility
*
*
* @class LifestrapUtility
* @package    LifestrapUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'

class LifestrapUtility {

  constructor() {
    // super()
    this.trackLifestraps = []
  }

  /**
  * bring whole lifestrap to be
  * @method lifestrapTobe
  *
  */
  lifestrapTobe = function (lsKey, wholeIn) {
    let lifeStrapSet = {}
    if (wholeIn && wholeIn.lens && wholeIn.lens.length > 0) {
      lifeStrapSet.lens = this.lensTobe(lsKey, wholeIn.lens[0])
    } else {
      console.warn('lifestrapTobe: lens data is missing or empty', wholeIn)
      lifeStrapSet.lens = this.prepareEmptyLens(lsKey)
    }
    return lifeStrapSet
  }

  prepareEmptyLens = function (key) {
    return {
      pillars: {
        capacity: [],
        context: [],
        heli: [],
        attunement: [],
        coherence: { isStable: false, resonance: 0 }
      },
      residue: [],
      key: key,
      story: ""
    }
  }

  /**
   * 
   * @method 
   * @param {string|object} keyIn 
   * @param {object} lensData 
   */
  lensTobe = function (keyIn, lensData) {
    if (!lensData || !lensData.value || !lensData.value.concept) {
      console.error('lensTobe: invalid lensData', lensData)
      let emptyKey = ''
      if (typeof keyIn === 'string' && keyIn !== '') {
        emptyKey = keyIn
      } else if (keyIn && typeof keyIn === 'object') {
        emptyKey = this.convertBinaryToHex(keyIn).key
      }
      return this.prepareEmptyLens(emptyKey)
    }
    let lsContract = lensData
    let hexKeyLens = ''
    if (typeof keyIn === 'string' && keyIn !== '') {
      hexKeyLens = keyIn
    } else {
      // If keyIn is not a string, it might be the contract itself or null
      // Use the lensData's key if available, otherwise try keyIn if it's a contract
      let targetForHex = (lensData.key) ? lensData : keyIn
      if (targetForHex && typeof targetForHex === 'object') {
        hexKeyLens = this.convertBinaryToHex(targetForHex).key
      }
    }

    const slots = lsContract.value.concept.context?.slots || [];

    const unmappedFragments =
      lensData.value.concept.context?.unmappedFragments || [];

    const newTexture = {
      pillars: {
        capacity: [
          ...(lsContract.value.concept.capacity?.map((v) => ({
            label: "Capacity",
            value: v,
          })) || []),
          ...slots
            .filter((s) => s.type === "capacity")
            .map((s) => ({ label: "Capacity", value: s.value })),
        ],
        context: [
          ...slots
            .filter((s) => s.type === "heart" || s.label === "Activity")
            .map((s) => ({ label: "Activity", value: s.value })),
          ...slots
            .filter((s) => s.label === "Space" || s.type === "environment")
            .map((s) => ({ label: "Space", value: s.value })),
          ...slots
            .filter((s) => s.label === "Temporal" || s.type === "earth")
            .map((s) => ({ label: "Temporal", value: s.value })),
        ],
        heli: [
          ...(lensData.heli
            ? Object.entries(lsContract.value.concept.heli).flatMap(([k, v]) =>
                v.map((val) => ({ label: k, value: val })),
              )
            : []),
          ...slots
            .filter((s) => s.type === "heli")
            .map((s) => ({ label: "Orbit Target", value: s.value })),
          ...slots
            .filter((s) => s.label === "Rhythm")
            .map((s) => ({ label: "Rhythm", value: s.value })),
          ...slots
            .filter((s) => s.label === "Performance")
            .map((s) => ({ label: "Performance", value: s.value })),
        ],
        attunement: [
          ...slots
            .filter(
              (s) => s.type === "attunement" || s.label === "Attunement",
            )
            .map((s) => ({ label: "Attunement", value: s.value })),
        ],
        coherence: {
          isStable: lsContract.value.concept.context?.isStable || false,
          resonance: 0,
        },
      },
      residue: unmappedFragments,
      key: hexKeyLens,
      story: lsContract.value.concept.story || "",
    };

    return newTexture
  }

    /**
   * 
   * @method 
  */
  besearchTobe = function () {
  }

  /**
   * 
   * @method 
  */
  DialogueTobe = function () {
  }

  /**
   * 
   * @method 
  */
  EmulationTobe = function () {
  }

  /**
   *
   * @method convertBinaryToHex
   */
  convertBinaryToHex = function (contract) {
    let hexKey = "";
    if (
      contract.key &&
      contract.key.type === "Buffer" &&
      Array.isArray(contract.key.data)
    ) {
      hexKey = contract.key.data
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } else if (typeof contract.key === "string") {
      hexKey = contract.key;
    } else if (contract.key && typeof contract.key.toString === "function") {
      try {
        hexKey = contract.key.toString("hex");
      } catch (e) {
        console.error("Error converting key to hex", e);
      }
    }
    let hexContract = {};
    hexContract.key = hexKey;
    hexContract.value = contract.value;
    return hexContract;
  };

}

export default LifestrapUtility