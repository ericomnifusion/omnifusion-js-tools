// Assume that the API result is stored in $input.first().json.data
const data = $input.first().json.data;
const posts = data.posts;

// Helper function to format the date as "Feb 20, 2025"
function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper function to get relative time (e.g., "2 days ago")
function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date; // difference in milliseconds
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}

// Start with the header using the total number of posts
let postInfo = `The customer has ${posts.length} posts:\n\n`;

// Iterate over each post to extract caption, location, and timestamp
posts.forEach((post, index) => {
  const node = post.node;
  
  // Extract caption from the first caption edge if available
  let caption = "No caption";
  if (node.edge_media_to_caption &&
      node.edge_media_to_caption.edges &&
      node.edge_media_to_caption.edges.length > 0) {
    caption = node.edge_media_to_caption.edges[0].node.text;
  }
  
  // Extract location name if available; otherwise provide a fallback
  let location = "No location";
  if (node.location && node.location.name) {
    location = node.location.name;
  }
  
  // Extract and format the timestamp if available
  let timeStr = "Unknown time";
  if (node.taken_at_timestamp) {
    const date = new Date(node.taken_at_timestamp * 1000);
    timeStr = `${formatDate(date)} (${getRelativeTime(date)})`;
  }
  
  // Append the formatted post details to the postInfo string
  postInfo += `Post #${index + 1}\nCaption: ${caption}\nLocation: ${location}\nTime: ${timeStr}\n\n`;
});

// At this point, postInfo contains the complete formatted string
console.log(postInfo);

return {
  "prompt": `Your customer's name is ${$('Get basic profile info').first().json.data.full_name}

${postInfo}`
}
