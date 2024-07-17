import { useToast } from '@/components/molecules/Toast';
import ShareIcon from '@/icons/ShareIcon';
import { IconButton } from '@radix-ui/themes';

const ShareButton = () => {
  const { notify } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify({
        description: 'Link copied to clipboard',
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

  return (
    <IconButton variant="ghost" size="3" radius="full" onClick={share}>
      <ShareIcon />
    </IconButton>
  );
};

export default ShareButton;
