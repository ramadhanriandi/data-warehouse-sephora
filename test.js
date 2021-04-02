const async = require('async');
require('dotenv').config();
const faker = require('faker');
const models = require('./models');

(async () => {
    const deliveries = await models.DeliveryDimension.findAll();
    async.eachLimit(deliveries, 5, (data) => {
        console.log(data.id);
    });
})();