import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ICard } from '@sunbird/shared';
@Injectable()
export class UtilService {
  getDataForCard(data, staticData, dynamicFields, metaData) {
    const list: Array<ICard> = [];
    _.forEach(data, (item, key) => {
      const card = this.processContent(item, staticData, dynamicFields, metaData);
      list.push(card);
    });
    return <ICard[]>list;
  }

  processContent(data, staticData, dynamicFields, metaData) {
    let fieldValue: any;
    const content = {
      name: data.name || data.courseName,
      image: data.appIcon || data.courseLogoUrl,
      description: data.description,
      rating: data.me_averageRating || '0'
    };
      _.forIn(staticData, (value, key1) => {
        content[key1] = value;
      });
      _.forIn(metaData, (value, key1) => {
        content[key1] = _.pick(data, value);
      });
      _.forIn(dynamicFields, (fieldData, fieldName) => {
        if (_.isArray(fieldData) && _.includes(fieldData[0], '.')) {
          fieldValue = {0: _.get(data, fieldData[0])};
        } else {
          fieldValue = _.pick(data, fieldData);
        }
        _.forIn(fieldValue, (val1, key1) => {
          const name = _.zipObjectDeep([fieldName], [val1]);
          _.forIn(name, (values, index) => {
            content[index] = _.merge(name[index], content[index]);
          });
        });
      });
     return content;
  }
}
