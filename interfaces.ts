export interface PathParsed {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
}

export interface Config {
    files: string[];
    backupsFolder: string;
    replaceInPath?: string;
}