require('dotenv').config();
const faker = require('faker');
const { DELIVERIES_BY_COUNTRY } = require('./data/deliveries');
const models = require('./models');

const findSalesDimensions = async () => {
    const times = await models.TimeDimension.findAll({ attributes: ["id"] });
    const products = await models.ProductDimension.findAll({ attributes: ["id", "unit_price", "unit_cost"] });
    const outlets = await models.OutletDimension.findAll({ attributes: ["id", "country"] });
    const promotions = await models.PromotionDimension.findAll({ attributes: ["id", "start_date", "end_date", "discount"] });
    const deliveries = await models.DeliveryDimension.findAll({ attributes: ["id", "name"] });

    return { times, products, outlets, promotions, deliveries };
};

(async () => {
    // SALES FACT
    await models.SalesFact.sync({ force: true });
    await findSalesDimensions().then((salesDimensions) => {
        const { times, products, outlets, promotions, deliveries } = salesDimensions;

        outlets.forEach((outlet) => {
            (async () => {
                for (let timeId = 1; timeId <= times.length; timeId++) {
                    const numberOfTransactions = faker.random.number({ min: 3, max: 10 });

                    for (let transactionId = 0; transactionId < numberOfTransactions; transactionId++) {
                        const paymentId = faker.random.number({ min: 1, max: 5 });
                        const numberOfItems = faker.random.number({ min: 1, max: 3 });
                        let deliveryId = 1;
                        const transactionNumber = `STARBUCKS-${outlet.id}-${timeId}-${transactionId}`;

                        if (faker.random.number({ min: 1, max: 3 }) % 2 === 0) {
                            const deliveriesInCountry = DELIVERIES_BY_COUNTRY[outlet.country];
                            const deliveryName = deliveriesInCountry[faker.random.number({ max: deliveriesInCountry.length - 1 })];
                            const choosenDelivery = deliveries.find((delivery) => {
                                return delivery.name === deliveryName;
                            });

                            deliveryId = choosenDelivery.id;
                        }

                        for (let productIdx = 0; productIdx < numberOfItems; productIdx++) {
                            const product = products[faker.random.number({ max: products.length - 1 })];
                            const promotion = productIdx === 0 ? promotions[faker.random.number({ max: promotions.length - 1 })] : promotions[0];
                            const unitsSold = faker.random.number({ min: 1, max: 2 });
                            let dollarsSold = ((100 - promotion.discount) / 100) * product.unit_price;

                            if (unitsSold === 2) {
                                dollarsSold += product.unit_price;
                            }

                            const dollarsCost = product.unit_cost * unitsSold;
                            const profit = dollarsSold - dollarsCost;

                            let sales = models.SalesFact.build({
                                time_id: timeId,
                                product_id: product.id,
                                outlet_id: outlet.id,
                                payment_id: paymentId,
                                promotion_id: promotion.id,
                                delivery_id: deliveryId,
                                transaction_number: transactionNumber,
                                units_sold: unitsSold,
                                dollars_sold: dollarsSold,
                                dollars_cost: dollarsCost,
                                profit,
                            })

                            await sales.save();
                        }
                    }
                    await console.log(timeId);
                }
            })();
        });
    })
})();