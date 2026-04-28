import { defineStore } from "pinia";
import { ref } from "vue";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { useChatStore } from "@/stores/chatStore.js";

export const useOrbitStore = defineStore("orbit", () => {
  const storeAI = aiInterfaceStore();
  const storeChat = useChatStore();

  const tools = ref({
    pulse: { x: 50, y: 40 },
    heli: { x: 90, y: 16 },
    cube: { x: 10, y: 20 },
    filter: { x: 70, y: 45 },
    tiny: { x: 10, y: 40 },
  });
  const expandedHeliClock = ref(false);
  const expandedPulse = ref(false);
  const expandedTinyDevice = ref(false);

  const draggingToolId = ref(null);
  const isInterplayActive = ref(false);

  const startDragging = (id) => {
    draggingToolId.value = id;
    document.body.style.cursor = "move";
  };

  const updatePosition = (id, x, y) => {
    if (tools.value[id]) {
      tools.value[id].x = Math.max(2, Math.min(x, 98));
      tools.value[id].y = Math.max(2, Math.min(y, 98));
    }
  };

  const stopDragging = () => {
    draggingToolId.value = null;
    document.body.style.cursor = "default";
  };

  const toggleInstrument = (id) => {
    if (tools.value[id]) {
      delete tools.value[id];
    } else {
      tools.value[id] = { x: 50, y: 50 };
    }
  };

  const isInstrumentActive = (id) => {
    return !!tools.value[id];
  };

  const addInstrument = (id, x, y) => {
    tools.value[id] = {
      x: Math.max(2, Math.min(x, 98)),
      y: Math.max(2, Math.min(y, 98)),
    };
    triggerBeebeeNotification();
  };

  const triggerBeebeeNotification = () => {
    // Open Beebee panel
    storeChat.isChatOpen = true;
    storeChat.chatWidth = 380;

    // Inject the specific message
    const notificationMessage = {
      role: "beebee",
      type: "agent",
      content:
        "I sense a new tether to the World. Is this a heartbeat (API), a memory (File Upload), or a Peer (HOP Query)?",
      timestamp: new Date(),
      status: "complete",
      conversationId: storeAI.chatAttention || "chat",
      context: "chat",
    };

    storeChat.addMessage(notificationMessage);
  };

  const toggleTinyExpand = () => {
    expandedTinyDevice.value = !expandedTinyDevice.value;
  };

  return {
    tools,
    expandedHeliClock,
    expandedPulse,
    expandedTinyDevice,
    draggingToolId,
    isInterplayActive,
    startDragging,
    updatePosition,
    stopDragging,
    toggleInstrument,
    isInstrumentActive,
    addInstrument,
    toggleTinyExpand,
  };
});
