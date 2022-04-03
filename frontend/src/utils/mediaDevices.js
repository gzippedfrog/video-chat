import { DEVICE_ERRORS_DENIED } from "../const/DEVICE_ERRORS";

export const getUserMedia = async (constraints) => {
  const copy = [...constraints];

  try {
    const constraint = copy.shift();
    return await navigator.mediaDevices.getUserMedia(constraint);
  } catch (e) {
    console.warn("getUserMedia; error;", e);
    if (DEVICE_ERRORS_DENIED.includes(e.name) || !copy.length) {
      throw e;
    }
    return getUserMedia(copy);
  }
};

const VIDEO_QUALITY = 360;
const VIDEO_ASPECT_RATIO = 16 / 9;

export const getConstraints = () => {
  const height = VIDEO_QUALITY;
  const aspectRatio = VIDEO_ASPECT_RATIO;

  return [
    {
      video: {
        aspectRatio,
        height
      },
      audio: true
    },
    {
      video: {
        aspectRatio,
        height: { max: height }
      },
      audio: true
    },
    {
      video: {
        aspectRatio
      },
      audio: true
    },
    {
      video: true,
      audio: true
    }
  ];
};
