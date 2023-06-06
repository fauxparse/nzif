import Body from './Body';
import Close from './Close';
import { useDialogContext } from './Context';
import Dialog, { overlayVariants } from './Dialog';
import { DialogProps } from './Dialog.types';
import Footer from './Footer';
import Header from './Header';
import Title from './Title';

export type { DialogProps };

export { overlayVariants, useDialogContext };

export default Object.assign(Dialog, { Header, Body, Footer, Close, Title });
