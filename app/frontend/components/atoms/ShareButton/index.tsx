import Button from '@/components/atoms/Button';
import ShareIcon from '@/icons/ShareIcon';
import { notifications } from '@mantine/notifications';

const ShareButton = () => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notifications.show({
        message: 'Link copied to clipboard',
      });
    } catch (err) {
      console.error('Failed', err);
    }
  };

  const share = () => {
    const data = {
      title: document.title,
      url: window.location.href,
    };
    if (navigator.canShare?.(data)) {
      navigator.share(data).catch(() => {
        // do nothing
      });
    } else {
      copyToClipboard();
    }
  };

  return <Button variant="ghost" leftSection={<ShareIcon />} onClick={share} />;
};

export default ShareButton;
