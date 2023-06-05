import Card from './Card';
import { CardProps } from './Card.types';
import { Details } from './Details';
import { Title } from './Title';

export type { CardProps };

export default Object.assign(Card, { Details, Title });
