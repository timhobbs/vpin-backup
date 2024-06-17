import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import archiver from 'archiver';
import { globSync } from 'glob';
import { Config, PathParsed } from './interfaces';

const createTmpDir = () => {
    if (existsSync('tmp')) {
        return;
    }

    mkdirSync('tmp');
}

const createFile = (filePath, replaceInPath = '') => {
    try {
        console.log(`***** filePath`, filePath);

        // Get file
        const file = readFileSync(filePath, 'utf-8');

        // Get path parts
        const parsedPath: PathParsed = path.parse(filePath);

        // Remove root from the path and replace windows path slashes
        const pathOnly = `./tmp/${parsedPath.dir
            .replace(parsedPath.root, '')
            .replace(/\\/g, '/')
            .replace(replaceInPath, '')
        }`;
        console.log(`***** filePath::pathOnly`, pathOnly);

        // Create path
        if (!existsSync(pathOnly)) {
            mkdirSync(pathOnly, { recursive: true });
        }

        // Save file
        writeFileSync(`${pathOnly}/${parsedPath.base}`, file);
    } catch (error) {
        console.error(`***** createFile::error`, error);
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDashedFile = (parsedPath, file) => {
    // Save file named using path parts
    try {
        writeFileSync(`./tmp/${
            // Remove root from the path and replace slashes with dashes
            parsedPath.dir.replace(parsedPath.root, '').replace(/\\/g, '-')
        }-${parsedPath.base}`, file);
    } catch (error) {
        console.error(`***** readFile::error`, error);
    }
}

const readGlob = (globPath, replaceInPath = '') => {
    try {
        // Fix windows paths - glob no likey!
        console.log(`***** globPath`, globPath);
        globPath = globPath.replace(/\\/g, '/');
        console.log(`***** globPath::fixed`, globPath);

        const files = globSync(globPath);
        console.log(`***** globPath::files`, files);

        for (const file of files) {
            console.log(`***** globPath::file`, file);
            createFile(file, replaceInPath);
        }
    } catch (error) {
        console.error(`***** readGlob::error`, error);
    }
}

const createArchive = (config: Config, callback) => {
    // Create a file to stream archive data to.
    const output = createWriteStream(`${config.backupsFolder}/vpin-backup-${
        new Date().toISOString().split('T')[0].replace(/-/g, '')
    }.zip`);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // Listen for all archive data to be written - 'close' event is fired only when a file descriptor is involved
    output.on('close', () => {
        console.log(`***** ${archive.pointer()} total bytes`);
        console.log(`***** archiver has been finalized and the output file descriptor has closed.`);

        // Execute callback
        callback();
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', () => {
        console.log(`***** Data has been drained`);
    });

    output.on('finish', () => {
        console.log(`***** Data is finished`);
    });

    // Good practice to catch warnings (i.e., stat failures and other non-blocking errors)
    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            // log warning
            console.error(`***** Error`, err);
        } else {
            // throw error
            throw err;
        }
    });

    // Good practice to catch this error explicitly
    archive.on('error', (err) => {
        throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory('tmp/', false);

    // Finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
};

const cleanUp = () => {
    rmSync('./tmp', { recursive: true, force: true });
}

const init = async () => {
    try {
        // Start by creating the tmp dir
        createTmpDir();
        const configFile = readFileSync('config.json', 'utf-8');
        console.log(`***** configFile`, configFile);

        const config: Config = JSON.parse(configFile);
        for (const filePath of config.files) {
            console.log(`***** configFile::filePath`, filePath);

            if (filePath.includes('*')) {
                // Read glob files
                readGlob(filePath, config.replaceInPath);

                continue;
            }

            // Create the single file
            createFile(filePath, config.replaceInPath);
        }

        // Archive the files
        createArchive(config, () => {
            // Clean up the tmp dir
            cleanUp();
        });

    } catch (error) {
        console.error(`***** init:error`, error);
    }
};

init();