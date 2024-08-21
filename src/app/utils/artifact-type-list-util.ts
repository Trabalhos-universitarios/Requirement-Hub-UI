import {ArtifactType} from "../models/artifact-type-models";

export const ARTIFACT_TYPE_LIST: ArtifactType[] =
    [
        {identifier: 'UC', name: 'Use Case'},
        {identifier: 'UH', name: 'Use History'},
        {identifier: 'TP', name: 'Test Plan'},
        {identifier: 'CD', name: 'Configuration Documentation'},
        {identifier: 'DM', name: 'Data Models'},
        {identifier: 'UI', name: 'UI Prototypes'},
        {identifier: 'UM', name: 'User Manual'},
        {identifier: 'TM', name: 'Technical Manual'},
        {identifier: 'UML', name: 'Unified Modeling Language (UML) Diagrams'},
        {identifier: 'NFR', name: 'Non-Functional Requirements Documentation'},
        {identifier: 'FR', name: 'Functional Requirements Documentation'},
        {identifier: 'BR', name: 'Business Rules Documentation'}
    ];