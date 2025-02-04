'use strict'
import { Info } from 'luxon'
/**
*  BiomarkersUtility
*
*
* @class BiomarkersUtility
* @package    BiomarkersUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'
import hashObject from 'object-hash'

class BiomarkersUtility {

  constructor() {
    // super()
    this.trackGaia = []
  }

  /**
  * prepare save marker contract
  * @method prepareMarkerContractPrime
  *
  */
  prepareMarkerContractPrime = function (markerInfo) {
    // structure inputs for cue contract
    const markerContract = {}
    markerContract.type = 'library'
    markerContract.action = 'markers'
    markerContract.reftype = 'new-markers'
    markerContract.task = 'PUT'
    markerContract.privacy = 'public'
    let markerHolder = {}
    let concept = {}
    concept.name = markerInfo.name
    concept.settings = { glue: 'prime', datatype: markerInfo.contract.key }
    markerHolder.concept = concept
    markerHolder.computational = { relationships: [] } 
    markerContract.data = markerHolder
    return markerContract
  }

  /**
  * match cue to another
  * @method markerMatch
  *
  */
  markerMatch = function (relMarkers, markersLive) {
    let fullMarker = []
    for (let markID of relMarkers) {
      let markerMatch = markersLive.filter(item => item.key === markID)
      if (markerMatch.length > 0) {
        fullMarker.push(markerMatch)
      }
    }
    return fullMarker
  }

  /* prepare datatype biomarkers
  * @method prepareDTbiomarkersMessage
  *
  */
  prepareContractbiomarkersMessage = function (contract) {

    const data = [
      { body: 'heart', type: 'Cholesterol / HDL Ratio', description: '', lab: '', active: false, uuid: '9b106f1d-9a69-4f7e-9d1f-6a7e4f9d1f6a' },
      { body: 'heart', type: 'HDL Large', description: '', lab: '', active: false, uuid: '8a2b5e2c-8b5d-4e6f-8b5d-5e6f4e8b5d8a' },
      { body: 'heart', type: 'LDL Cholesterol', description: '', lab: '', active: false, uuid: '7c3d4f3e-7d4f-4f5e-7d4f-4f5e7d4f3e7c' },
      { body: 'heart', type: 'LDL Particle Number', description: '', lab: '', active: false, uuid: '6e4f5g4h-6f5g-4h5i-6f5g-4h5i6f5g4h6e' },
      { body: 'heart', type: 'LDL Peak Size', description: '', lab: '', active: false, uuid: '5f5h6i5j-5g6i-4j6k-5g6i-4j6k5g6i5j5f' },
      { body: 'heart', type: 'Lipoprotein (a)', description: '', lab: '', active: false, uuid: '4i6j7k6l-4h7k-4k7l-4h7k-4k7l4h7k6l4i' },
      { body: 'heart', type: 'Total Cholesterol', description: '', lab: '', active: false, uuid: '3j7k8m7n-3i8m-4m8n-3i8m-4m8n3i8m7n3j' },
      { body: 'heart', type: 'Apolipoprotein B (Apo B)', description: '', lab: '', active: false, uuid: '2k8m9o8p-2j9o-4o9p-2j9o-4o9p2j9o8p2k' },
      { body: 'heart', type: 'HDL Cholesterol', description: '', lab: '', active: false, uuid: '1l9n0q9r-1k0q-4q0r-1k0q-4q0r1k0q9r1l' },
      { body: 'heart', type: 'High-Sensitivity C-Reactive Protein (hs-CRP)', description: '', lab: '', active: false, uuid: '0m0p1r0s-0l1r-4r1s-0l1r-4r1s0l1r0s0m' },
      { body: 'heart', type: 'LDL Medium', description: '', lab: '', active: false, uuid: '9n1q2s1t-9m2s-4s2t-9m2s-4s2t9m2s1t9n' },
      { body: 'heart', type: 'LDL Pattern', description: '', lab: '', active: false, uuid: '8o2r3t2u-8n3t-4t3u-8n3t-4t3u8n3t2u8o' },
      { body: 'heart', type: 'LDL Small', description: '', lab: '', active: false, uuid: '7p3s4u3v-7o4u-4u4v-7o4u-4u4v7o4u3v7p' },
      { body: 'heart', type: 'Non-HDL Cholesterol', description: '', lab: '', active: false, uuid: '6q4t5v4w-6p5v-4v5w-6p5v-4v5w6p5v4w6q' },
      { body: 'heart', type: 'Triglycerides', description: '', lab: '', active: false, uuid: '5r5u6w5x-5q6w-4w6x-5q6w-4w6x5q6w5x5r' },
      { body: 'thyroid', type: 'Thyroid Peroxidase Antibodies (TPO)', description: '', lab: '', active: false, uuid: '4s6v7x6y-4r7x-4x7y-4r7x-4x7y4r7x6y4s' },
      { body: 'thyroid', type: 'Thyroxine (T4) Free', description: '', lab: '', active: false, uuid: '3t7w8y7z-3s8y-4y8z-3s8y-4y8z3s8y7z3t' },
      { body: 'thyroid', type: 'Iodine', description: '', lab: '', active: false, uuid: '2u8x9z8a-2t9z-4z9a-2t9z-4z9a2t9z8a2u' },
      { body: 'thyroid', type: 'Thyroglobulin Antibodies (TgAb)', description: '', lab: '', active: false, uuid: '1v9y0a9b-1u0a-4a0b-1u0a-4a0b1u0a9b1v' },
      { body: 'thyroid', type: 'Thyroid-Stimulating Hormone (TSH)', description: '', lab: '', active: false, uuid: '0w0z1b0c-0v1b-4b1c-0v1b-4b1c0v1b0z0w' },
      { body: 'thyroid', type: 'Triiodothyronine (T3) Free', description: '', lab: '', active: false, uuid: '9x1a2c1d-9w2c-4c2d-9w2c-4c2d9w2c1d9x' },
      { body: 'thyroid', type: 'Selenium', description: '', lab: '', active: false, uuid: '8y2b3d2e-8x3d-4d3e-8x3d-4d3e8x3d2e8y' },
      { body: 'cancer detect', type: 'Prostate Specific Antigen (PSA), Free', description: '', lab: '', active: false, uuid: '7z3c4e3f-7y4e-4e4f-7y4e-4e4f7y4e3f7z' },
      { body: 'cancer detect', type: 'Prostate Specific Antigen (PSA), Total', description: '', lab: '', active: false, uuid: '6a4d5f4g-6b5f-4f5g-6b5f-4f5g6b5f4g6a' },
      { body: 'cancer detect', type: 'Multi-Cancer Detection Test', description: '', lab: '', active: false, uuid: '5b5e6g5h-5c6g-4g6h-5c6g-4g6h5c6g5h5b' },
      { body: 'cancer detect', type: 'Prostate Specific Antigen (PSA) %, Free', description: '', lab: '', active: false, uuid: '4c6f7h6i-4d7h-4h7i-4d7h-4h7i4d7h6i4c' },
      { body: 'autoimmunity', type: 'Antinuclear Antibodies (ANA) Screen', description: '', lab: '', active: false, uuid: '3d7g8i7j-3e8i-4i8j-3e8i-4i8j3e8i7j3d' },
      { body: 'autoimmunity', type: 'Celiac Disease (Comprehensive Panel)', description: '', lab: '', active: false, uuid: '2e8h9j8k-2f9j-4j9k-2f9j-4j9k2f9j8k2e' },
      { body: 'autoimmunity', type: 'Antinuclear Antibodies (ANA) Pattern', description: '', lab: '', active: false, uuid: '1f9i0k9l-1g0k-4k0l-1g0k-4k0l1g0k9l1f' },
      { body: 'autoimmunity', type: 'Antinuclear Antibodies (ANA) Titer', description: '', lab: '', active: false, uuid: '0g0j1l0m-0h1l-4l1m-0h1l-4l1m0h1l0j0g' },
      { body: 'autoimmunity', type: 'Rheumatoid Factor', description: '', lab: '', active: false, uuid: '9h1k2m1n-9i2m-4m2n-9i2m-4m2n9i2m1n9h' },
      { body: 'immune regulation', type: 'Eosinophils', description: '', lab: '', active: false, uuid: '8i2l3n2o-8j3n-4n3o-8j3n-4n3o8j3n2o8i' },
      { body: 'immune regulation', type: 'Lyme Antibody (IgG)', description: '', lab: '', active: false, uuid: '7j3m4o3p-7k4o-4o4p-7k4o-4o4p7k4o3p7j' },
      { body: 'immune regulation', type: 'Lymphocytes', description: '', lab: '', active: false, uuid: '6k4n5p4q-6l5p-4p5q-6l5p-4p5q6l5p4q6k' },
      { body: 'immune regulation', type: 'Neutrophils', description: '', lab: '', active: false, uuid: '5l5o6q5r-5m6q-4q6r-5m6q-4q6r5m6q5r5l' },
      { body: 'immune regulation', type: 'High-Sensitivity C-Reactive Protein (hs-CRP)', description: '', lab: '', active: false, uuid: '4m6p7r6s-4n7r-4r7s-4n7r-4r7s4n7r6s4m' },
      { body: 'immune regulation', type: 'Basophils', description: '', lab: '', active: false, uuid: '3n7q8s7t-3o8s-4s8t-3o8s-4s8t3o8s7t3n' },
      { body: 'immune regulation', type: 'Lyme Antibody', description: '', lab: '', active: false, uuid: '2o8r9t8u-2p9t-4t9u-2p9t-4t9u2p9t8u2o' },
      { body: 'immune regulation', type: 'Lyme Antibody (IgM)', description: '', lab: '', active: false, uuid: '1p9s0u9v-1q0u-4u0v-1q0u-4u0v1q0u9v1p' },
      { body: 'immune regulation', type: 'Monocytes', description: '', lab: '', active: false, uuid: '0q0v1v0w-0r1v-4v1w-0r1v-4v1w0r1v0v0q' },
      { body: 'immune regulation', type: 'White Blood Cell Count', description: '', lab: '', active: false, uuid: '9r1w2w1x-9s2w-4w2x-9s2w-4w2x9s2w1x9r' },
      { body: 'female health', type: 'Pregnancy (hCG)', description: '', lab: '', active: false, uuid: '8s2x3x2y-8t3x-4x3y-8t3x-4x3y8t3x2y8s' },
      { body: 'female health', type: 'Testosterone, Free (female)', description: '', lab: '', active: false, uuid: '7t3y4y3z-7u4y-4y4z-7u4y-4y4z7u4y3z7t' },
      { body: 'female health', type: 'Follicle Stimulating Hormone (FSH) (female)', description: '', lab: '', active: false, uuid: '6u4z5z4a-6v5z-4z5a-6v5z-4z5a6v5z4a6u' },
      { body: 'female health', type: 'Prolactin (female)', description: '', lab: '', active: false, uuid: '5v5a6a5b-5w6a-4a6b-5w6a-4a6b5w6a5b5v' },
      { body: 'female health', type: 'DHEA-Sulfate (female)', description: '', lab: '', active: false, uuid: '4w6b7b6c-4x7b-4b7c-4x7b-4b7c4x7b6c4w' },
      { body: 'female health', type: 'Anti-Mullerian Hormone', description: '', lab: '', active: false, uuid: '3x7c8c7d-3y8c-4c8d-3y8c-4c8d3y8c7d3x' },
      { body: 'female health', type: 'Sex Hormone Binding Globulin', description: '', lab: '', active: false, uuid: '2y8d9d8e-2z9d-4d9e-2z9d-4d9e2z9d8e2y' },
      { body: 'female health', type: 'Testosterone, Total', description: '', lab: '', active: false, uuid: '1z9e0e9f-1a0e-4e0f-1a0e-4e0f1a0e9f1z' },
      { body: 'female health', type: 'Luteinizing Hormone (LH) (female)', description: '', lab: '', active: false, uuid: '0a0f1f0g-0b1f-4f1g-0b1f-4f1g0b1f0g0a' },
      { body: 'female health', type: 'Estradiol (E2) (female)', description: '', lab: '', active: false, uuid: '9b1g2g1h-9c2g-4g2h-9c2g-4g2h9c2g1h9b' },
      { body: 'male health', type: 'DHEA-Sulfate (male)', description: '', lab: '', active: false, uuid: '8c2h3h2i-8d3h-4h3i-8d3h-4h3i8d3h2i8c' },
      { body: 'male health', type: 'Follicle Stimulating Hormone (FSH) (male)', description: '', lab: '', active: false, uuid: '7d3i4i3j-7e4i-4i4j-7e4i-4i4j7e4i3j7d' },
      { body: 'male health', type: 'Prostate Specific Antigen (PSA), Free', description: '', lab: '', active: false, uuid: '6e4j5j4k-6f5j-4j5k-6f5j-4j5k6f5j4k6e' },
      { body: 'male health', type: 'Prostate Specific Antigen (PSA), Total', description: '', lab: '', active: false, uuid: '5f5k6k5l-5g6k-4k6l-5g6k-4k6l5g6k5l5f' },
      { body: 'male health', type: 'Prolactin (male)', description: '', lab: '', active: false, uuid: '4g6l7l6m-4h7l-4l7m-4h7l-4l7m4h7l6m4g' },
      { body: 'male health', type: 'Testosterone, Total', description: '', lab: '', active: false, uuid: '3h7m8m7n-3i8m-4m8n-3i8m-4m8n3i8m7n3h' },
      { body: 'male health', type: 'Estradiol (E2) (male)', description: '', lab: '', active: false, uuid: '2i8n9n8o-2j9n-4n9o-2j9n-4n9o2j9n8o2i' },
      { body: 'male health', type: 'Luteinizing Hormone (LH)', description: '', lab: '', active: false, uuid: '1j9o0o9p-1k0o-4o0p-1k0o-4o0p1k0o9p1j' },
      { body: 'male health', type: 'Prostate Specific Antigen (PSA) %, Free', description: '', lab: '', active: false, uuid: '0k0p1p0q-0l1p-4p1q-0l1p-4p1q0l1p0q0k' },
      { body: 'male health', type: 'Sex Hormone Binding Globulin (SHBG)', description: '', lab: '', active: false, uuid: '9l1q2q1r-9m2q-4q2r-9m2q-4q2r9m2q1r9l' },
      { body: 'male health', type: 'Testosterone, Free (male)', description: '', lab: '', active: false, uuid: '8m2r3r2s-8n3r-4r3s-8n3r-4r3s8n3r2s8m' },
      { body: 'metabolic', type: 'Leptin', description: '', lab: '', active: false, uuid: '7n3s4s3t-7o4s-4s4t-7o4s-4s4t7o4s3t7n' },
      { body: 'metabolic', type: 'Hemoglobin A1c (HbA1c)', description: '', lab: '', active: false, uuid: '6o4t5t4u-6p5t-4t5u-6p5t-4t5u6p5t4u6o' },
      { body: 'metabolic', type: 'Adiponectin', description: '', lab: '', active: false, uuid: '5p5u6u5v-5q6u-4u6v-5q6u-4u6v5q6u5v5p' },
      { body: 'metabolic', type: 'Insulin', description: '', lab: '', active: false, uuid: '4q6v7v6w-4r7v-4v7w-4r7v-4v7w4r7v6w4q' },
      { body: 'metabolic', type: 'Uric Acid', description: '', lab: '', active: false, uuid: '3r7w8w7x-3s8w-4w8x-3s8w-4w8x3s8w7x3r' },
      { body: 'metabolic', type: 'Glucose', description: '', lab: '', active: false, uuid: '2s8x9x8y-2t9x-4x9y-2t9x-4x9y2t9x8y2s' },
      { body: 'nutrients', type: 'Calcium', description: '', lab: '', active: false, uuid: '1t9y0y9z-1u0y-4y0z-1u0y-4y0z1u0y9z1t' },
      { body: 'nutrients', type: 'Ferritin', description: '', lab: '', active: false, uuid: '0u0z1z0a-0v1z-4z1a-0v1z-4z1a0v1z0a0u' },
      { body: 'nutrients', type: 'Iodine', description: '', lab: '', active: false, uuid: '9v1a2a1b-9w2a-4a2b-9w2a-4a2b9w2a1b9v' },
      { body: 'nutrients', type: 'Iron Binding Capacity (TIBC)', description: '', lab: '', active: false, uuid: '8w2b3b2c-8x3b-4b3c-8x3b-4b3c8x3b2c8w' },
      { body: 'nutrients', type: 'Magnesium', description: '', lab: '', active: false, uuid: '7x3c4c3d-7y4c-4c4d-7y4c-4c4d7y4c3d7x' },
      { body: 'nutrients', type: 'Omega-3: EPA+DPA+DHA', description: '', lab: '', active: false, uuid: '6y4d5d4e-6z5d-4d5e-6z5d-4d5e6z5d4e6y' },
      { body: 'nutrients', type: 'Omega-6: Arachidonic Acid', description: '', lab: '', active: false, uuid: '5z5e6e5f-5a6e-4e6f-5a6e-4e6f5a6e5f5z' },
      { body: 'nutrients', type: 'Omega-6 / Omega-3 Ratio', description: '', lab: '', active: false, uuid: '4a6f7f6g-4b7f-4f7g-4b7f-4f7g4b7f6g4a' },
      { body: 'nutrients', type: 'Selenium', description: '', lab: '', active: false, uuid: '3b7g8g7h-3c8g-4g8h-3c8g-4g8h3c8g7h3b' },
      { body: 'nutrients', type: 'Zinc', description: '', lab: '', active: false, uuid: '2c8h9h8i-2d9h-4h9i-2d9h-4h9i2d9h8i2c' },
      { body: 'nutrients', type: 'Arachidonic Acid/EPA Ratio', description: '', lab: '', active: false, uuid: '1d9i0i9j-1e0i-4i0j-1e0i-4i0j1e0i9j1d' },
      { body: 'nutrients', type: 'Copper', description: '', lab: '', active: false, uuid: '0e0j1j0k-0f1j-4j1k-0f1j-4j1k0f1j0j0e' },
      { body: 'nutrients', type: 'Homocysteine', description: '', lab: '', active: false, uuid: '9f1k2k1l-9g2k-4k2l-9g2k-4k2l9g2k1l9f' },
      { body: 'nutrients', type: 'Iron', description: '', lab: '', active: false, uuid: '8g2l3l2m-8h3l-4l3m-8h3l-4l3m8h3l2m8g' },
      { body: 'nutrients', type: 'Iron % Saturation', description: '', lab: '', active: false, uuid: '7h3m4m3n-7i4m-4m4n-7i4m-4m4n7i4m3n7h' },
      { body: 'nutrients', type: 'Methylmalonic Acid (MMA)', description: '', lab: '', active: false, uuid: '6i4n5n4o-6j5n-4n5o-6j5n-4n5o6j5n4o6i' },
      { body: 'nutrients', type: 'Omega-3 Total', description: '', lab: '', active: false, uuid: '5j5o6o5p-5k6o-4o6p-5k6o-4o6p5k6o5p5j' },
      { body: 'nutrients', type: 'Omega-6: Linoleic Acid', description: '', lab: '', active: false, uuid: '4k6p7p6q-4l7p-4p7q-4l7p-4p7q4l7p6q4k' },
      { body: 'nutrients', type: 'Omega-6 Total', description: '', lab: '', active: false, uuid: '3l7q8q7r-3m8q-4q8r-3m8q-4q8r3m8q7r3l' },
      { body: 'nutrients', type: 'Vitamin D', description: '', lab: '', active: false, uuid: '2m8r9r8s-2n9r-4r9s-2n9r-4r9s2n9r8s2m' },
      { body: 'stress', type: 'Cortisol', description: '', lab: '', active: false, uuid: '1n9s0s9t-1o0s-4s0t-1o0s-4s0t1o0s9t1n' },
      { body: 'stress', type: 'Insulin-like Growth Factor (IGF-1)', description: '', lab: '', active: false, uuid: '0o0t1t0u-0p1t-4t1u-0p1t-4t1u0p1t0u0o' },
      { body: 'stress', type: 'Biological Age', description: '', lab: '', active: false, uuid: '9p1u2u1v-9q2u-4u2v-9q2u-4u2v9q2u1v9p' },
      { body: 'stress', type: 'DHEA-Sulfate (female)', description: '', lab: '', active: false, uuid: '8q2v3v2w-8r3v-4v3w-8r3v-4v3w8r3v2w8q' },
      { body: 'liver', type: 'Albumin', description: '', lab: '', active: false, uuid: '7r3w4w3x-7s4w-4w4x-7s4w-4w4x7s4w3x7r' },
      { body: 'liver', type: 'Aspartate Transaminase (AST)', description: '', lab: '', active: false, uuid: '6s4x5x4y-6t5x-4x5y-6t5x-4x5y6t5x4y6s' },
      { body: 'liver', type: 'Total Bilirubin', description: '', lab: '', active: false, uuid: '5t5y6y5z-5u6y-4y6z-5u6y-4y6z5u6y5z5t' },
      { body: 'liver', type: 'Alanine Transaminase (ALT)', description: '', lab: '', active: false, uuid: '4u6z7z6a-4v7z-4z7a-4v7z-4z7a4v7z6a4u' },
      { body: 'liver', type: 'Alkaline Phosphatase (ALP)', description: '', lab: '', active: false, uuid: '3v7a8a7b-3w8a-4a8b-3w8a-4a8b3w8a7b3v' },
      { body: 'liver', type: 'Gamma-glutamyl Transferase (GGT)', description: '', lab: '', active: false, uuid: '2w8b9b8c-2x9b-4b9c-2x9b-4b9c2x9b8c2w' },
      { body: 'liver', type: 'Total Protein', description: '', lab: '', active: false, uuid: '1x9c0c9d-1y0c-4c0d-1y0c-4c0d1y0c9d1x' },
      { body: 'kidneys', type: 'Blood Urea Nitrogen (BUN)', description: '', lab: '', active: false, uuid: '0y0d1d0e-0z1d-4d1e-0z1d-4d1e0z1d0e0y' },
      { body: 'kidneys', type: 'Calcium', description: '', lab: '', active: false, uuid: '9z1e2e1f-9a2e-4e2f-9a2e-4e2f9a2e1f9z' },
      { body: 'kidneys', type: 'Creatinine', description: '', lab: '', active: false, uuid: '8a2f3f2g-8b3f-4f3g-8b3f-4f3g8b3f2g8a' },
      { body: 'kidneys', type: 'Globulin', description: '', lab: '', active: false, uuid: '7b3g4g3h-7c4g-4g4h-7c4g-4g4h7c4g3h7b' },
      { body: 'kidneys', type: 'Sodium', description: '', lab: '', active: false, uuid: '6c4g5h4i-6d5h-4h5i-6d5h-4h5i6d5h4i6c' },
      { body: 'kidneys', type: 'Albumin (Microalbumin) - Urine', description: '', lab: '', active: false, uuid: '5d5i6i5j-5e6i-4i6j-5e6i-4i6j5e6i5j5d' },
      { body: 'kidneys', type: 'BUN / Creatinine Ratio', description: '', lab: '', active: false, uuid: '4e6j7j6k-4f7j-4j7k-4f7j-4j7k4f7j6k4e' },
      { body: 'kidneys', type: 'Chloride', description: '', lab: '', active: false, uuid: '3f7k8k7l-3g8k-4k8l-3g8k-4k8l3g8k7l3f' },
      { body: 'kidneys', type: 'Estimated Glomerular Filtration Rate (eGFR)', description: '', lab: '', active: false, uuid: '2g8l9l8m-2h9l-4l9m-2h9l-4l9m2h9l8m2g' },
      { body: 'kidneys', type: 'Potassium', description: '', lab: '', active: false, uuid: '1h9m0m9n-1i0m-4m0n-1i0m-4m0n1i0m9n1h' },
      { body: 'pancreas', type: 'Lipase', description: '', lab: '', active: false, uuid: '0i0n1n0o-0j1n-4n1o-0j1n-4n1o0j1n0o0i' },
      { body: 'pancreas', type: 'Amylase', description: '', lab: '', active: false, uuid: '9j1o2o1p-9k2o-4o2p-9k2o-4o2p9k2o1p9j' },
      { body: 'heavy metals', type: 'Arsenic', description: '', lab: '', active: false, uuid: '8k2p3p2q-8l3p-4p3q-8l3p-4p3q8l3p2q8k' },
      { body: 'heavy metals', type: 'Mercury', description: '', lab: '', active: false, uuid: '7l3q4q3r-7m4q-4q4r-7m4q-4q4r7m4q3r7l' },
      { body: 'heavy metals', type: 'Aluminum', description: '', lab: '', active: false, uuid: '6m4r5r4s-6n5r-4r5s-6n5r-4r5s6n5r4s6m' },
      { body: 'heavy metals', type: 'Lead', description: '', lab: '', active: false, uuid: '5n5s6s5t-5o6s-4s6t-5o6s-4s6t5o6s5t5n' },
      { body: 'blood', type: 'Hematocrit', description: '', lab: '', active: false, uuid: '4o6t7t6u-4p7t-4t7u-4p7t-4t7u4p7t6u4o' },
      { body: 'blood', type: 'Mean Corpuscular Hemoglobin Concentration (MCHC)', description: '', lab: '', active: false, uuid: '3p7u8u7v-3q8u-4u8v-3q8u-4u8v3q8u7v3p' },
      { body: 'blood', type: 'Mean Corpuscular Volume (MCV)', description: '', lab: '', active: false, uuid: '2q8v9v8w-2r9v-4v9w-2r9v-4v9w2r9v8w2q' },
      { body: 'blood', type: 'Platelet Count', description: '', lab: '', active: false, uuid: '1r9w0w9x-1s0w-4w0x-1s0w-4w0x1s0w9x1r' },
      { body: 'blood', type: 'Red Cell Distribution Width (RDW)', description: '', lab: '', active: false, uuid: '0s0x1x0y-0t1x-4x1y-0t1x-4x1y0t1x0y0s' },
      { body: 'blood', type: 'ABO Group and Rhesus (Rh) Factor', description: '', lab: '', active: false, uuid: '9t1y2y1z-9u2y-4y2z-9u2y-4y2z9u2y1z9t' },
      { body: 'blood', type: 'Hemoglobin', description: '', lab: '', active: false, uuid: '8u2z3z2a-8v3z-4z3a-8v3z-4z3a8v3z2a8u' },
      { body: 'blood', type: 'Mean Corpuscular Hemoglobin (MCH)', description: '', lab: '', active: false, uuid: '7v3a4a3b-7w4a-4a4b-7w4a-4a4b7w4a3b7v' },
      { body: 'blood', type: 'Mean Platelet Volume (MPV)', description: '', lab: '', active: false, uuid: '6w4b5b4c-6x5b-4b5c-6x5b-4b5c6x5b4c6w' },
      { body: 'blood', type: 'Red Blood Cell (RBC) Count', description: '', lab: '', active: false, uuid: '5x5c6c5d-5y6c-4c6d-5y6c-4c6d5y6c5d5x' },
      { body: 'electrolytes', type: 'Chloride', description: '', lab: '', active: false, uuid: '4y6d7d6e-4z7d-4d7e-4z7d-4d7e4z7d6e4y' },
      { body: 'electrolytes', type: 'Potassium', description: '', lab: '', active: false, uuid: '3z7e8e7f-3a8e-4e8f-3a8e-4e8f3a8e7f3z' },
      { body: 'electrolytes', type: 'Carbon Dioxide', description: '', lab: '', active: false, uuid: '2a8f9f8g-2b9f-4f9g-2b9f-4f9g2b9f8g2a' },
      { body: 'electrolytes', type: 'Calcium', description: '', lab: '', active: false, uuid: '1b9g0g9h-1c0g-4g0h-1c0g-4g0h1c0g9h1b' },
      { body: 'electrolytes', type: 'Magnesium, RBC', description: '', lab: '', active: false, uuid: '0c0h1h0i-0d1h-4h1i-0d1h-4h1i0d1h0i0c' },
      { body: 'electrolytes', type: 'Sodium', description: '', lab: '', active: false, uuid: '9d1i2i1j-9e2i-4i2j-9e2i-4i2j9e2i1j9d' },
      { body: 'urine', type: 'Appearance', description: '', lab: '', active: false, uuid: '8e2j3j2k-8f3j-4j3k-8f3j-4j3k8f3j2k8e' },
      { body: 'urine', type: 'Bilirubin', description: '', lab: '', active: false, uuid: '7f3k4k3l-7g4k-4k4l-7g4k-4k4l7g4k3l7f' },
      { body: 'urine', type: 'Color', description: '', lab: '', active: false, uuid: '6g4l5l4m-6h5l-4l5m-6h5l-4l5m6h5l4m6g' },
      { body: 'urine', type: 'Hyaline Casts', description: '', lab: '', active: false, uuid: '5h5m6m5n-5i6m-4m6n-5i6m-4m6n5i6m5n5h' },
      { body: 'urine', type: 'Leukocytes', description: '', lab: '', active: false, uuid: '4i6n7n6o-4j7n-4n7o-4j7n-4n7o4j7n6o4i' },
      { body: 'urine', type: 'Occult Blood', description: '', lab: '', active: false, uuid: '3j7o8o7p-3k8o-4o8p-3k8o-4o8p3k8o7p3j' },
      { body: 'urine', type: 'Protein', description: '', lab: '', active: false, uuid: '2k8p9p8q-2l9p-4p9q-2l9p-4p9q2l9p8q2k' },
      { body: 'urine', type: 'Specific Gravity', description: '', lab: '', active: false, uuid: '1l9q0q9r-1m0q-4q0r-1m0q-4q0r1m0q9r1l' },
      { body: 'urine', type: 'White Blood Cell (WBC)', description: '', lab: '', active: false, uuid: '0m0r1r0s-0n1r-4r1s-0n1r-4r1s0n1r0s0m' },
      { body: 'urine', type: 'Albumin - Urine (Microalbumin)', description: '', lab: '', active: false, uuid: '9n1s2s1t-9o2s-4s2t-9o2s-4s2t9o2s1t9n' },
      { body: 'urine', type: 'Bacteria', description: '', lab: '', active: false, uuid: '8o2t3t2u-8p3t-4t3u-8p3t-4t3u8p3t2u8o' },
      { body: 'urine', type: 'Clarity', description: '', lab: '', active: false, uuid: '7p3u4u3v-7q4u-4u4v-7q4u-4u4v7q4u3v7p' },
      { body: 'urine', type: 'Glucose-Urine', description: '', lab: '', active: false, uuid: '6q4v5v4w-6r5v-4v5w-6r5v-4v5w6r5v4w6q' },
      { body: 'urine', type: 'Ketones', description: '', lab: '', active: false, uuid: '5r5w6w5x-5s6w-4w6x-5s6w-4w6x5s6w5x5r' },
      { body: 'urine', type: 'Nitrite', description: '', lab: '', active: false, uuid: '4s6x7x6y-4t7x-4x7y-4t7x-4x7y4t7x6y4s' },
      { body: 'urine', type: 'pH', description: '', lab: '', active: false, uuid: '3t7y8y7z-3u8y-4y8z-3u8y-4y8z3u8y7z3t' },
      { body: 'urine', type: 'Red Blood Cell', description: '', lab: '', active: false, uuid: '2u8z9z8a-2v9z-4z9a-2v9z-4z9a2v9z8a2u' },
      { body: 'urine', type: 'Squamous Epithelial Cells', description: '', lab: '', active: false, uuid: '1v9a0a9b-1w0a-4a0b-1w0a-4a0b1w0a9b1v' },
      { body: 'urine', type: 'Yeast', description: '', lab: '', active: false, uuid: '0w0b1b0c-0x1b-4b1c-0x1b-4b1c0x1b0w0b' },
      { body: 'alzheimer\'s', type: 'Apolipoprotein E (ApoE) Genotype', description: '', lab: '', active: false, uuid: '9x1c2c1d-9y2c-4c2d-9y2c-4c2d9y2c1d9x' },
      { body: 'allergies', type: 'Indoor & Outdoor Allergy Profile (IgE)', description: '', lab: '', active: false, uuid: '8y2d3d2e-8z3d-4d3e-8z3d-4d3e8z3d2e8y' },
      { body: 'allergies', type: 'Food Allergy Profile (IgE)', description: '', lab: '', active: false, uuid: '7z3e4e3f-7a4e-4e4f-7a4e-4e4f7a4e3f7z' },
      { body: 'sexual health', type: 'Gonorrhea', description: '', lab: '', active: false, uuid: '6a4f5f4g-6b5f-4f5g-6b5f-4f5g6b5f4g6a' },
      { body: 'sexual health', type: 'HIV 1 & 2 Antigen-Antibody', description: '', lab: '', active: false, uuid: '5b5g6g5h-5c6g-4g6h-5c6g-4g6h5c6g5h5b' },
      { body: 'sexual health', type: 'Trichomoniasis', description: '', lab: '', active: false, uuid: '4c6h7h6i-4d7h-4h7i-4d7h-4h7i4d7h6i4c' },
      { body: 'sexual health', type: 'Chlamydia', description: '', lab: '', active: false, uuid: '3d7i8i7j-3e8i-4i8j-3e8i-4i8j3e8i7j3d' },
      { body: 'sexual health', type: 'Herpes Simplex Virus 1 and 2', description: '', lab: '', active: false, uuid: '2e8j9j8k-2f9j-4j9k-2f9j-4j9k2f9j8k2e' },
      { body: 'sexual health', type: 'RPR (Syphilis)', description: '', lab: '', active: false, uuid: '1f9k0k9l-1g0k-4k0l-1g0k-4k0l1g0k9l1f' },
      { body: 'epigenetic clock', type: 'Dunedin Pace', description: '', lab: '', active: false, uuid: '0g0l1l0m-0h1l-4l1m-0h1l-4l1m0h1l0g0l' },
      { body: 'body', type: 'body mass index', description: '', lab: '', active: false, uuid: '9h1m2m1n-9i2m-4m2n-9i2m-4m2n9i2m1n9h' },
      { body: 'blood', type: 'fasting plasma glucose', description: '', lab: '', active: false, uuid: '8i2n3n2o-8j3n-4n3o-8j3n-4n3o8j3n2o8i' },
      { body: 'body', type: 'fat', description: '', lab: '', active: false, uuid: '7j3o4o3p-7k4o-4o4p-7k4o-4o4p7k4o3p7j' },
      { body: 'body', type: 'Glutathione', description: '', lab: '', active: false, uuid: '6k4p5p4q-6l5p-4p5q-6l5p-4p5q6l5p4q6k' },
      { body: 'body', type: 'grip strength strong', description: '', lab: '', active: false, uuid: '5l5q6q5r-5m6q-4q6r-5m6q-4q6r5m6q5r5l' },
      { body: 'body', type: 'grip strength passive', description: '', lab: '', active: false, uuid: '4m6r7r6s-4n7r-4r7s-4n7r-4r7s4n7r6s4m' },
      { body: 'body', type: 'hsCRP', description: '', lab: '', active: false, uuid: '3n7s8s7t-3o8s-4s8t-3o8s-4s8t3o8s7t3n' },
      { body: 'body', type: 'NAD', description: '', lab: '', active: false, uuid: '2o8t9t8u-2p9t-4t9u-2p9t-4t9u2p9t8u2o' },
      { body: 'body', type: 'vo2 max', description: '', lab: '', active: false, uuid: '1p9u0u9v-1q0u-4u0v-1q0u-4u0v1q0u9v1p' },
      { body: 'body', type: 'telomeres length', description: '', lab: '', active: false, uuid: '0q0v1v0w-0r1v-4v1w-0r1v-4v1w0r1v0v0q' }
    ];
    
    let gaiaJack = []
    for (let mark of data) {
      const markContract = {}
      markContract.type = 'library'
      markContract.action = 'marker'
      markContract.reftype = 'marker-cues'
      markContract.task = 'PUT'
      markContract.privacy = 'public'
      let markSettings = {}
      markSettings.primary =  true
      markSettings.name = mark.type
      markSettings.description = mark.type
      markSettings.wiki = ''
      markSettings.cueid = ''
      markSettings.marker = '' 
      markSettings.lab = mark.lab
      markSettings.datatypeType = 'marker'
      markContract.data = markSettings
      gaiaJack.push(markContract)
    }
    return gaiaJack
  }

}

  export default BiomarkersUtility