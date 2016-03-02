import yamlFront from 'yaml-front-matter';
import omit from 'lodash.omit';

export default class PostParser {
  parse(raw) {
    let res = yamlFront.loadFront(raw);
    return {
      body: res.__content,
      meta: omit(res, '__content')
    };
  }
}
