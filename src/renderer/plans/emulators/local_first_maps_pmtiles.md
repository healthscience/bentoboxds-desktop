# Local-First Map Strategy: PMTiles & Protomaps Integration

This plan outlines the integration of PMTiles and Protomaps into the HOP protocol's Earth Environment to provide high-performance, local-first satellite and terrain views.

## 1. Core Concept
Instead of relying on thousands of individual tile requests to external servers, we transition to a single-file archive format (**PMTiles**). This allows for:
- **Offline Capability**: Maps can be bundled or shared between peers as single files.
- **Efficiency**: Uses HTTP Range Requests to fetch only the necessary data from the archive.
- **Privacy**: No tracking from external tile providers.

## 2. Architecture

### Data Layers
- **Base Map (OSM)**: Current live OpenStreetMap tiles for general navigation.
- **Satellite (PMTiles)**: Raster imagery stored in a `.pmtiles` file.
- **Terrain (PMTiles)**: Vector or raster terrain data for topographic visualization.

### Component Integration
- **`OpenstreetMap.vue`**: Will be updated to support multiple tile sources.
- **`pmtiles` library**: Used to interface between OpenLayers and the `.pmtiles` files.
- **`EarthEnvironment.vue`**: Will provide UI controls in the Lens HUD to toggle between these layers.

## 3. Implementation Steps

### Phase 1: Infrastructure
- [ ] Install `pmtiles` dependency: `npm install pmtiles`.
- [ ] Create a `public/maps` directory for storing local map archives.
- [ ] Implement a PMTiles protocol handler for OpenLayers.

### Phase 2: Layer Support
- [ ] Update `OpenstreetMap.vue` to accept a `layerType` prop (e.g., 'streets', 'satellite', 'terrain').
- [ ] Add logic to switch between `ol-source-osm` and a custom PMTiles source.
- [ ] Define styling for vector terrain data (contours, hillshading).

### Phase 3: UI & Controls
- [ ] Add a layer switcher to the `EarthEnvironment.vue` Lens HUD.
- [ ] Implement "Download Region" functionality to save a specific bounding box to IndexedDB or local storage.

## 4. Local-First Benefits for HOP
- **Peer Sharing**: A peer can "strap" a map region to a Genesis location and share the `.pmtiles` file with others.
- **Low Latency**: Instant map loading from local disk/cache.
- **Resilience**: The map remains functional even when the peer is disconnected from the global internet.

## 5. Transition to Peer-to-Peer Tiling (The Future of HOP)
The PMTiles approach serves as a critical bridge to a fully decentralized P2P tile network (like Peermaps or osm-p2p):

### Bridge to P2P
- **Data Portability**: PMTiles archives are single files, making them the perfect "payload" for initial P2P transfers between peers.
- **DHT Integration**: In a future version, instead of fetching byte-ranges from a central server, the HOP client can query the Distributed Hash Table (DHT) for specific tile IDs (`z/x/y`).
- **Caching as Providing**: As users travel and cache tiles via PMTiles or direct P2P, they naturally become providers for those specific "geographies" to other peers in the network.
- **Protocol Alignment**: By moving to a range-request and tile-based architecture now, we are aligning the Earth World's data consumption with the way P2P protocols like Hypercore (used by Peermaps) operate.

## 6. Technical Reference
- **Format**: [PMTiles Spec](https://github.com/protomaps/PMTiles)
- **Engine**: [Protomaps.js / OpenLayers Integration](https://protomaps.com/docs/frontends/openlayers)
- **P2P Inspiration**: [Peermaps](https://peermaps.org/) | [osm-p2p](https://github.com/digidem/osm-p2p)
