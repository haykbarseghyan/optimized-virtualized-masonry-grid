// imageWorker.ts

self.onmessage = async (event: MessageEvent<{ imageSrc: string }>) => {
  const { imageSrc } = event.data;

  try {
    const response = await fetch(imageSrc);
    const blob = await response.blob();

    self.postMessage({ success: true, blob });
  } catch (error) {
    self.postMessage({ success: false, error: (error as Error).message });
  }
};

export {};
