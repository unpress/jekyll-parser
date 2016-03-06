import tmp from 'tmp';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import { assert } from 'chai';
import cp from 'cp';

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

  this.Given(/^project$/, (callback) => {
    tmp.dir((err, p) => {
      this.projectPath = p;
      if (err) return callback(err);
      callback();
    });
  });

  this.Given(/^file "([^"]*)" with content:$/, (arg1, string, callback) => {
    createFileWithDirectories(path.join(this.projectPath, arg1), string).then(() => callback()).catch(callback);
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

  this.Then(/^the first layout should be named "([^"]*)"$/, (arg1, callback) => {
    assert.equal(this.parsedProject.layouts[0].name, arg1);
    callback();
  });

  this.Then(/^the parsed project should have (\d+) post$/, (arg1, callback) => {
    let count = Number(arg1);
    assert.equal(this.parsedProject.posts.length, count);
    callback();
  });

  this.Then(/^the first post should have title "([^"]*)"$/, (arg1, callback) => {
    assert.equal(this.parsedProject.posts[0].meta.title, arg1);
    callback();
  });

  this.Given(/^image "([^"]*)"$/, (arg1, callback) => {
    mkdirp(path.resolve(this.projectPath, path.dirname(arg1)), (err) => {
      if (err) return callback(err);
      cp(path.resolve(__dirname, '..', 'assets', arg1), path.resolve(this.projectPath, arg1), callback);
    });
  });

  this.Then(/^the parsed project should have image with key "([^"]*)"$/, (arg1, callback) => {
    assert(this.parsedProject.images.some(i => i.key === arg1), `has image with key ${arg1}`);
    callback();
  });

  this.Then(/^the mime type of image "([^"]*)" should be "([^"]*)"$/, (key, mime, cb) => {
    assert.equal(this.parsedProject.images.find(i => i.key === key).mimeType, mime);
    cb();
  });

  this.Then(/^the base64 representation of image "([^"]*)" should be "([^"]*)"$/, (key, base64, cb) => {
    assert.equal(this.parsedProject.images.find(i => i.key === key).base64, base64);
    cb();
  });
};
