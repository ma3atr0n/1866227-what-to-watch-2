export const Component = {
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  IConfig: Symbol.for('IConfig'),
  IDBClient: Symbol.for('IDBClient'),
  IUserService: Symbol.for('IUserService'),
  userModel: Symbol.for('userModel'),
  IFilmService: Symbol.for('IFilmService'),
  filmModel: Symbol.for('filmModel'),
  ICommentService: Symbol.for('ICommentService'),
  commentModel: Symbol.for('commentModel'),
  IExceptionFilter: Symbol.for('IExceptionFilter'),
  userController: Symbol.for('userController'),
  filmController: Symbol.for('filmController'),
  filmPromoController: Symbol.for('filmPromoController'),
  filmFavoriteController: Symbol.for('filmFavoriteController'),
};
