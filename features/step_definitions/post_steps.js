'use strict';

import PostParser from '../../src/parser/post';
import fromPairs from 'lodash.frompairs';
import { assert } from 'chai';

module.exports = function() {
  this.Given(/^file with content:$/, (string, callback) => {
    this.parsedFileRaw = string;
    callback();
  });

  this.When(/^parsed as post$/, callback => {
    let parser = new PostParser();
    this.parseResult = parser.parse(this.parsedFileRaw);
    callback();
  });

  this.Then(/^the parsed post has following metadata:$/, (table, callback) => {
    let expected = fromPairs(table.raw())
      , actual = this.parseResult.meta;
    assert.deepEqual(actual, expected);

    callback();
  });

  this.Then(/^the parsed post has following body:$/, (string, callback) => {
    let expected = string
      , actual = this.parseResult.body;
    assert.equal(actual, expected);
    callback();
  });
};
