import { Manifest } from '@repo/types';
export declare class YamlService {
    load(manifestFilePath: string): Promise<Manifest>;
    loadManifestFromUrl(url: string): Promise<string>;
    ignoreEmojis(fileContent: string): string;
    interpolateDotEnvVariables(yamlContent: string): string;
}
