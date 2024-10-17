const timeFormatter = (time) => {
  // Define the two date-time strings
  const date1 = new Date(time);
  const date2 = new Date();

  // Calculate the difference in milliseconds
  const diffInMilliseconds = date2 - date1;

  // Convert the difference to days, hours, minutes, and seconds
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const hours = diffInHours % 24;
  const minutes = diffInMinutes % 60;
  const seconds = diffInSeconds % 60;

  // Display the difference
  if (diffInDays > 365) {
    return `${Math.floor(diffInDays / 365)} years ago`;
  } else if (diffInDays > 30) {
    return `${Math.floor(diffInDays / 30)} months ago`;
  } else if (diffInDays > 0) {

    return diffInDays == 1 ? `${diffInDays}  day ago` : `${diffInDays}  days ago`;
  } else if (hours > 0) {
    return `${hours} hours ago`;
  } else if (minutes > 0) {
    return `${minutes} minutes ago`;
  } else {
    return `${seconds} seconds ago`;
  }
};

export default timeFormatter;