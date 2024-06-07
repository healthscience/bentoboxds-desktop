<div id="nbox-now" ref="nnowBBox" class="bentobox-cell">
  <div id="bentobox-network">
    <div id="bb-network-graph">Network</div>
    <div id="bb-world-map">map</div>
    <div id="bentobox-holder">
      <div id="network-bentobox">
        network bentobox
      </div>
    </div>
  </div>
  <div id="bento-past" v-if="quantSelect['nnow']">
    <!--<div id="past-box">past toolbar <button id="full-past-toolbar">Tools</button></div>-->
    <!--<bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartData"></bar-chart>-
    <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartData"></line-chart>-->
  </div>
</div>
<div id="vertdragbar" @mousedown="StartRightDrag()"></div> <!-- vertical slider -->
<div  id="nbox-future" ref="nfutureBBox" class="bentobox-cell">
  <div id="bentobox-network">
    <div id="bb-network-graph">Network</div>
    <div id="bb-world-map">map</div>
    <div id="bentobox-holder">
      <div id="network-bentobox">
        network bentobox
      </div>
    </div>
  </div>
  <div id="bento-future" v-if="quantSelect['future']">
    <!--<button id="full-future-toolbar" @click="predictFuture()">Predict</button>-->
    <!-- <div id="future-box">future toolbar <button id="full-future-toolbar">full</button></div>-->
    <!--<bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartfutureData" ></bar-chart>
    <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartfutureData"></line-chart>-->
  </div>
</div>
<div id="expand" @mousedown="StartExpandDrag()"></div>