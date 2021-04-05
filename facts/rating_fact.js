require('dotenv').config();
const faker = require('faker');
const models = require('../models');

const findRatingDimensions = async () => {
    const sales = await models.SalesFact.findAll({
        attributes: [
            "date_id",
            "product_id",
            "customer_id",
            "transaction_number",
        ],
    });
    
    return { sales };
};

(async () => {
    // RATING FACT
    await findRatingDimensions().then((ratingDimensions) => {
        const { sales } = ratingDimensions;

        let productRating = {}

        sales.forEach((sale) => {
            if (faker.random.number({ min: 1, max: 5 }) % 2 === 0) {
                (async () => {
                    const rawRating = faker.random.number({ min: 1, max: 5 });

                    const newRating = rawRating + faker.random.number({ max: 5 - rawRating });
                    
                    if (productRating.hasOwnProperty(sale.product_id)) {
                        const { count, average_rating } = productRating[sale.product_id];

                        productRating[sale.product_id] = {
                            count: count + 1,
                            average_rating: (count * average_rating + newRating)/(count + 1),
                        }
                    } else {
                        productRating[sale.product_id] = { count: 1, average_rating: newRating };
                    }

                    let rating = models.RatingFact.build({
                        date_id: sale.date_id,
                        product_id: sale.product_id,
                        customer_id: sale.customer_id,
                        transaction_number: sale.transaction_number,
                        rating: newRating,
                        average_rating: productRating[sale.product_id].average_rating,
                        review: faker.lorem.paragraph(1),
                    })

                    await rating.save();
                })();
            }
        });
    })
})();