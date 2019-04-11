
/**
 *  
 */
export interface HeaderModel {
    home: HeaderHome;
    secondaryLinks: HeaderSecondaryLink[];
    navigationLinks: HeaderNavigationLink[];
}


export class HeaderHome implements Selectable {
    /**
     * 
     */
    text: string;

    /**
     * 
     */
    route: string;

    /**
     * 
     */
    imageSourcePath: string;

    /**
     * 
     */
    imageAltText: string;

    /**
     * 
     */
    id: string;

    /**
     * 
     */
    selected: boolean;
}

/**
 * 
 */
export class HeaderNavigationLink implements Selectable {
    /**
     * 
     */
    text: string;

    /**
     * 
     */
    route: string;

    /**
     * 
     */
    children: HeaderNavigationLink[];

    /**
     * 
     */
    id: string;

    /**
     * 
     */
    selected: boolean;
}

/**
 * 
 */
export class HeaderSecondaryLink implements Selectable {
    /**
     * 
     */
    text: string;

    /**
     * 
     */
    route: string;

    /**
     * 
     */
    imageSourcePath: string;

    /**
     * 
     */
    imageAltText: string;

    /**
     * 
     */
    id: string;

    /**
     * 
     */
    selected: boolean;
}

export interface Selectable {
    /**
     * 
     */
    id: string;

    /**
     * 
     */
    selected: boolean
}
