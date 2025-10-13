import { ManifestService } from '../../manifest/services/manifest.service';
import { EntityService } from '../../entity/services/entity.service';
export declare class DatabaseService {
    private manifestService;
    private entityService;
    constructor(manifestService: ManifestService, entityService: EntityService);
    isDbEmpty(): Promise<boolean>;
}
