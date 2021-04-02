require('dotenv').config();
const faker = require('faker');
const models = require('./models');

const findSatisfactionDimensions = async () => {
    const medias = await models.MediaDimension.findAll({ attributes: ["id"] });
    const sales = await models.SalesFact.findAll({
        attributes: [
            "time_id",
            "product_id",
            "outlet_id",
            "delivery_id",
            "transaction_number",
            "units_sold",
        ],
    });
    await console.log(sales.length);
    return { medias, sales };
};

(async () => {
    // SATISFACTION FACT
    await findSatisfactionDimensions().then((satisfactionDimensions) => {
        const { medias, sales } = satisfactionDimensions;

        sales.forEach((sale) => {
            if (faker.random.number({ min: 1, max: 5 }) % 2 === 0) {
                (async () => {
                    let satisfaction = models.SatisfactionFact.build({
                        time_id: sale.time_id,
                        product_id: sale.product_id,
                        outlet_id: sale.outlet_id,
                        media_id: medias[faker.random.number({ max: medias.length - 1 })].id,
                        transaction_number: sale.transaction_number,
                        stars: faker.random.number({ min: 1, max: 5 }),
                        units_sold: sale.units_sold,
                    })

                    await satisfaction.save();
                    await console.log(satisfaction.transaction_number);
                })();
            }
        });
    })
})();