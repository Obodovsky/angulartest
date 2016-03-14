'use strict';

class Server {
  bootstrap(env){
    this.express = require('express');
    this.app = this.express();
    this.clientRouter = this.express.Router();
    this.apiRouter = this.express.Router();
    this.env = env;

    this.app.disable('x-powered-by');
    this.app.set('view engine', 'jade');
    this.app.set('view cache', this.env === 'production');

    this.setupRouting();
    this.app.listen(8880);
  }

  setupRouting(){
    const path = require('path');

    this.app.use('/build', this.express.static(path.join(__dirname, 'build'), {
      maxAge: this.env === 'production' ? 31536000 : 0
    }));

    this.app.use('/vendor', this.express.static(path.join(__dirname, 'vendor'), {
      maxAge: this.env === 'production' ? 31536000 : 0
    }));

    this.clientRouter.get('/partials/pallete', function(req, res, next) {
      res.render('partials/pallete')
    });

    this.clientRouter.get('/partials/index_special', function(req, res, next) {
      res.render('partials/index_special')
    });

    this.clientRouter.get('/partials/test_special', function(req, res, next) {
      res.render('partials/test_special')
    });

    this.clientRouter.get('*', (req, res, next) => {
      res.render('index', {
        pageTitle: 'Главная страница'
      })
    });

    this.apiRouter.get('/', (req, res, next) => {
      res.json({
        "message" : "Hello from API!"
      })
    });

    this.apiRouter.get('/data', (req, res, next) => {
      res.json({
        // teeth, radiusInner, radiusOuter, toothHeight,
        //   innerAnnulus, outerAnnulus
        'core.gear': [
          [8, 5, 9, 2, {
            innerRadius: 2.5,
            outerRadius: 5
          }, {
            innerRadius: 2.5,
            outerRadius: 8
          }]
        ],

        // holeRadius, hHoleCount, vHoleCount
        'core.rect': [
          [2.5, 1, 1],
          [2.5, 2, 1],
          [2.5, 3, 1],
          [2.5, 4, 1],
          [2.5, 5, 1],
          [2.5, 2, 2],
          [2.5, 3, 3],
          [2.5, 4, 4]
        ],

        // holeRadius, sHoleCount
        'core.triangle': [
          [2.5, 4],
          [2.5, 3],
          [2.5, 5]
        ],

        // holeRadius, hHoleCount, vHoleCount, positionOfT
        'core.t-shape': [
          // core.t-shape.0
          [2.5, 5, 2, 2],
          // core.t-shape.1
          [2.5, 5, 2, 1],
          // core.t-shape.2
          [2.5, 5, 2, 3]
        ],

        // innerHexSize, outerHexSize
        'core.screw': [
          [2, 4]
        ]
      });
    });

    this.app.use('/api', this.apiRouter);
    this.app.use('/', this.clientRouter);
  }
}

Object.create(Server.prototype).bootstrap(process.env.NODE_ENV || 'development');
