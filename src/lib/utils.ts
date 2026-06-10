export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';

    return Math.floor(seconds) + 's ago';
  } catch {
    return 'recently';
  }
};

export const truncateText = (text: string, length: number = 150): string => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
