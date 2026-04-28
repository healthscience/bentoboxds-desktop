importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

let pyodideReadyPromise;

async function initPyodide() {
  console.log("[PyodideWorker] Initializing Pyodide...");
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage("micropip");
  
  const micropip = self.pyodide.pyimport("micropip");
  
  // Infrastructure for future Python-based metabolic logic
  await self.pyodide.runPythonAsync(`
    import json
    
    def process_metabolic_data(data_json):
        data = json.loads(data_json)
        # Placeholder for future logic
        # age = data.get('age', 30)
        # weight = data.get('weight', 70)
        
        result = {
            "status": "success",
            "processed": True,
            "timestamp": data.get('timestamp')
        }
        return json.dumps(result)
  `);
  
  console.log("[PyodideWorker] Pyodide initialized.");
}

pyodideReadyPromise = initPyodide();

self.onmessage = async (e) => {
  const { type, data } = e.data;
  console.log(`[PyodideWorker] Received message: ${type}`, data);
  
  if (type === 'PROCESS_DATA') {
    await pyodideReadyPromise;
    
    try {
      const process_metabolic_data = self.pyodide.globals.get('process_metabolic_data');
      const resultJson = process_metabolic_data(JSON.stringify(data));
      const result = JSON.parse(resultJson);
      self.postMessage({ type: 'DATA_PROCESSED', data: result });
    } catch (err) {
      console.error("[PyodideWorker] Error processing data:", err);
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  }
};
