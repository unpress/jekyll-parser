import walk from 'walk';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

import PostParser from './post';

export default class ProjectParser {
  constructor(path) {
    this.root = path;
  }

  parse() {
    let postParser = new PostParser();
    return new Promise(resolve => {
      let out = {
        layouts: [],
        posts: [],
        images: []
      };
      let walker = walk.walk(this.root);
      walker.on('file', (root, fileStats, next) => {
        let p = root.replace(this.root, '').replace(/^\//, '');
        if (p === '_layouts') {
          out.layouts.push({
            name: path.basename(fileStats.name, '.html')
          });
          next();
        }
        else if (p === '_posts') {
          fs.readFile(path.join(root, fileStats.name), 'utf8', (err, str) => {
            if (err) return next(err);
            out.posts.push(postParser.parse(str));
            next();
          });
        }
        else if (mime.lookup(fileStats.name).indexOf('image/') === 0) {
          fs.readFile(path.join(root, fileStats.name), (err, buf) => {
            if (err) return next(err);
            out.images.push({
              mimeType: mime.lookup(fileStats.name),
              key: path.join(
                root,
                fileStats.name
              ).replace(path.resolve(this.root), '').replace(/^\//, ''),
              base64: buf.toString('base64')
            });
            next();
          });
        }
        else { next(); }
      });
      walker.on('end', () => resolve(out));
    });
  }
}
