import type { Metadata } from 'next';
import { DesignSystemShowcase } from '../../features/design-system/showcase';
import './showcase.css';
export const metadata: Metadata = {
  title: 'Design System',
  description: 'MARO bilingual design foundations and interactive components.',
};
export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}
