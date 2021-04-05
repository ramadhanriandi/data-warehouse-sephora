require('dotenv').config();
const faker = require('faker');
const models = require('../models');

const findSalesDimensions = async () => {
    const dates = await models.DateDimension.findAll({ attributes: ["id"] });
    const products = await models.ProductDimension.findAll({ attributes: ["id", "price_per_unit", "cost_per_unit"] });
    const outlets = await models.OutletDimension.findAll({ attributes: ["id"] });
    const customers = await models.CustomerDimension.findAll({ attributes: ["id"] });
    const promotions = await models.PromotionDimension.findAll({ attributes: ["id", "discount"] });

    return { dates, products, outlets, customers, promotions };
};

(async () => {
    // SALES FACT
    await models.SalesFact.sync({ force: true });
    await findSalesDimensions().then((salesDimensions) => {
        const { dates, products, outlets, customers, promotions} = salesDimensions;

        outlets.forEach((outlet) => {
            (async () => {
                for (let dateId = 1; dateId <= dates.length; dateId++) {
                    const numberOfTransactions = faker.random.number({ min: 2, max: 5 });

                    for (let transactionId = 0; transactionId < numberOfTransactions; transactionId++) {
                        const numberOfItems = faker.random.number({ min: 1, max: 3 });
                        const customer = customers[faker.random.number({ max: customers.length - 1 })];
                        const transactionNumber = `SEPHORA-${outlet.id}-${dateId}-${transactionId}`;

                        for (let productIdx = 0; productIdx < numberOfItems; productIdx++) {
                            const product = products[faker.random.number({ max: products.length - 1 })];
                            let promotion = productIdx === 0 ? promotions[faker.random.number({ max: promotions.length - 1 })] : promotions[0];
                            const unitsSold = faker.random.number({ min: 1, max: 2 });
                            let dollarsSold = ((100 - promotion.discount) / 100) * product.price_per_unit;

                            if (unitsSold === 2) {
                                dollarsSold += product.price_per_unit;
                            }

                            const dollarsCost = product.cost_per_unit * unitsSold;
                            let profit = dollarsSold - dollarsCost;

                            if (profit < 0) {
                                promotion = promotions[0];
                                dollarsSold = unitsSold * product.price_per_unit;
                                profit = dollarsSold - dollarsCost;
                            }

                            let sales = models.SalesFact.build({
                                date_id: dateId,
                                product_id: product.id,
                                outlet_id: outlet.id,
                                customer_id: customer.id,
                                promotion_id: promotion.id,
                                transaction_number: transactionNumber,
                                units_sold: unitsSold,
                                dollars_sold: dollarsSold,
                                dollars_cost: dollarsCost,
                                profit,
                            })

                            await sales.save();
                        }
                    }
                }
            })();
        });
    })
})();