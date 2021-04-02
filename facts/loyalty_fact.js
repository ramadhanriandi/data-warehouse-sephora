require('dotenv').config();
const faker = require('faker');
const models = require('./models');

const findLoyaltyDimensions = async () => {
    const customers = await models.CustomerDimension.findAll({ attributes: ["id"] });
    const memberships = await models.MembershipDimension.findAll({ attributes: ["id", "level_name"] });
    const salesWithStarbucksCard = await models.SalesFact.findAll({
        attributes: [
            "time_id",
            "outlet_id",
            "transaction_number",
        ],
        where: {
            payment_id: 1,
        }
    });

    return { customers, memberships, salesWithStarbucksCard };
};

(async () => {
    // LOYALTY FACT
    await findLoyaltyDimensions().then((loyaltyDimensions) => {
        const { customers, memberships, salesWithStarbucksCard } = loyaltyDimensions;

        salesWithStarbucksCard.forEach((sales) => {
            (async () => {
                const transactionDollars = faker.random.number({ min: 3, max: 15, precision: 0.01 });

                let loyalty = models.LoyaltyFact.build({
                    time_id: sales.time_id,
                    customer_id: faker.random.number({ min: 1, max: customers.length }),
                    membership_id: faker.random.number({ min: 1, max: memberships.length }),
                    outlet_id: sales.outlet_id,
                    transaction_number: sales.transaction_number,
                    transaction_stars: Math.floor(transactionDollars),
                    transaction_dollars: transactionDollars,
                })

                await loyalty.save();
                await console.log(loyalty.transaction_number);
            })();
        });
    })
})();