import walk from 'walk';

export default class ProjectParser {
  constructor(path) {
    this.root = path;
  }

  parse() {
    return new Promise(resolve => {
      let out = {
        layouts: []
      };
      let walker = walk.walk(this.root);
      walker.on('file', (root, fileStats, next) => {
        let p = root.replace(this.root, '').replace(/^\//, '');
        if (p === '_layouts') {
          out.layouts.push(fileStats.name);
        }
        next();
      });
      walker.on('end', () => resolve(out));
    });
  }
}
