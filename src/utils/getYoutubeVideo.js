import axios from "axios";



const categoryMap = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "20": "Gaming",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology"
};


async function getVideoInfo(videoUrl) {
  const videoId = new URL(videoUrl).searchParams.get("v");
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await res.json(); // important
    return data.items[0];
  } catch (error) {
    console.log("VIDEO FETCH FROM YOUTUBE ERROR:", error);
  }
}


 function getCategoryName(categoryId) {
  return categoryMap[categoryId] || undefined
}


async function getChannelInfo(channelId) {
  try {
    const { data } = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "snippet,statistics",
          id: channelId,
          key: process.env.YOUTUBE_API_KEY
        }
      }
    );
  console.log("CHANNEL RAW RESPONSE:", data);
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    const channel = data.items[0];

    return {
      channelName: channel.snippet.title,
      description: channel.snippet.description,
      thumbnails: channel.snippet.thumbnails,
      subscribers: channel.statistics.subscriberCount,
      totalViews: channel.statistics.viewCount,
      totalVideos: channel.statistics.videoCount
    };

  } catch (error) {
    console.log("CHANNEL FETCH ERROR:", error);
    return null;
  }
}

export {getVideoInfo, getCategoryName, getChannelInfo}