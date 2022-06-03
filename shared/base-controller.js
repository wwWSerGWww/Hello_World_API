import { NotExistedError, DuplicationError, BusinessError } from './errors/business-errors.js';
import {
  NotExistedError as NotExistedHttpError,
  DuplicationError as DuplicationHttpError,
} from './errors/http-errors.js';

export default class BaseController {
  httpErrorsByErrorTypeObj = {
    [NotExistedError.name]: NotExistedHttpError,
    [DuplicationError.name]: DuplicationHttpError
    // add new common errors handlers here...
  };

  constructor(httpErrorsByErrorTypeObj) {
    if (this.constructor.name === 'BaseController') {
      throw new Error(`${this.constructor.name}: can not create instance of abstract class`);
    }

    this.httpErrorsByErrorTypeObj = {
      ...this.httpErrorsByErrorTypeObj,
      ...httpErrorsByErrorTypeObj
    };
  }

  sendError = (res, businessError) => {
    if (!(businessError instanceof BusinessError))
      throw new Error(`The ${businessError.name} is not a business error!`);

    const errorHandler = this.httpErrorsByErrorTypeObj[businessError.name];
    if (!errorHandler)
      throw new Error(`${businessError.name} handler not found`);

    errorHandler(res, businessError.message);
  }

}