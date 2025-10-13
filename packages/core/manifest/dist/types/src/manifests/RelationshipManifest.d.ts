export type RelationshipManifest = {
    name: string;
    entity: string;
    eager?: boolean;
    type: 'many-to-one' | 'many-to-many' | 'one-to-many' | 'one-to-one';
    helpText?: string;
    owningSide?: boolean;
    inverseSide?: string;
    nested?: boolean;
};
