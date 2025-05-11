export async function startWebcam(videoElement) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return stream;
  }
  
  export function stopWebcam(stream) {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }
  
  export function captureWebcamPhoto(videoElement, callback) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
      callback(file);
    }, "image/jpeg");
}