import tmp from 'tmp';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import { assert } from 'chai';

import ProjectParser from '../../src/parser/project';

function createFileWithDirectories(p, content) {
  return new Promise((resolve, reject) => {
    let base = path.dirname(p);
    mkdirp(base, err => {
      if (err) return reject(err);
      fs.writeFile(p, content, 'utf8', err => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}


module.exports = function() {
  this.Given(/^project with following file structure:$/, (table, callback) => {
    tmp.dir((err, p) => {
      this.projectPath = p;
      if (err) return callback(err);
      Promise.all(table.hashes().map(r => {
        return createFileWithDirectories(path.join(p, r.filename), r.content || 'no content');
      })).then(() => callback()).catch(callback);
    });
  });

  this.When(/^I parse the project$/, callback => {
    let parser = new ProjectParser(this.projectPath);
    parser.parse().then(res => {
      this.parsedProject = res;
      callback();
    }).catch(callback);
  });

  this.Then(/^the parsed project should have (\d+) layout$/, (arg1, callback) => {
    let count = Number(arg1);
    assert.equal(this.parsedProject.layouts.length, count);
    callback();
  });
};