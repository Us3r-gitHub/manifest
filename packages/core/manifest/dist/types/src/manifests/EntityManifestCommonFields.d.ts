import { EntityManifest } from './EntityManifest';
export interface EntityManifestCommonFields extends Pick<EntityManifest, 'className' | 'nameSingular' | 'namePlural' | 'slug' | 'single' | 'properties' | 'hooks' | 'middlewares' | 'nested'> {
}
