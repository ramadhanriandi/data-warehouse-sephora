require('dotenv').config();
const faker = require('faker');
const sequelize = require('./db');
const models = require('./models');

const { COUNTRIES, CITIES_BY_COUNTRY } = require('./data/countries');
const { DELIVERIES } = require('./data/deliveries');
const MEMBERSHIPS = require('./data/memberships');
const PAYMENTS = require('./data/payments');
const PRODUCTS = require('./data/products');
const PROMOTIONS = require('./data/promotions');
const DAY_NAMES = require('./data/times');

(async () => {
    await sequelize.drop();
    await sequelize.sync({ force: true });

    // CUSTOMER DIMENSION
    for (let i = 0; i < 1000; i++) {
        let customer = models.CustomerDimension.build({
            birth_date: faker.date.between(new Date("1970"), new Date("2003")),
            country: COUNTRIES[faker.random.number({ max: 11 })],
            is_received_marketing: faker.random.boolean(),
            joined_date: faker.date.between(new Date("2015"), new Date()),
        });
        await customer.save();
    }

    // DELIVERY DIMENSION
    let delivery = models.DeliveryDimension.build({
        name: "Dine In",
        type: "DINE_IN",
    });
    await delivery.save();

    DELIVERIES.forEach(async (deliveryName) => {
        (async () => {
            let delivery = models.DeliveryDimension.build({
                name: deliveryName,
                type: "TAKE_AWAY",
            });
            await delivery.save();
            await console.log("done");
        })();
    });

    // ITEM DIMENSION
    for (let i = 0; i < 20; i++) {
        let item = models.ItemDimension.build({
            name: faker.commerce.product(),
            category: faker.commerce.productMaterial(),
            sub_category: faker.commerce.productAdjective(),
            unit_cost: faker.random.number({ min: 0.1, max: 5, precision: .01 }),
        });
        await item.save();
    };

    // MEDIA DIMENSION
    let media = models.MediaDimension.build({
        name: "Starbucks App",
        type: "MOBILE_APP",
    });
    await media.save();

    DELIVERIES.forEach(async (mediaName) => {
        (async () => {
            let media = models.MediaDimension.build({
                name: mediaName,
                type: "MOBILE_APP",
            });
            await media.save();
            await console.log("done");
        })();
    });

    // MEMBERSHIP DIMENSION
    MEMBERSHIPS.forEach(async (levelName) => {
        (async () => {
            let membership = models.MembershipDimension.build({
                level_name: levelName,
            });
            await membership.save();
            await console.log("done");
        })();
    });

    // PAYMENT DIMENSION
    PAYMENTS.forEach(async (data) => {
        (async () => {
            let payment = models.PaymentDimension.build({
                name: data.name,
                type: data.type,
            });
            await payment.save();
            await console.log("done");
        })();
    });

    // PRODUCT DIMENSION
    PRODUCTS.forEach(async (data) => {
        (async () => {
            let unitPrice = faker.random.number({ min: 1, max: 5, precision: .01 });
            let unitCost = faker.random.number({ min: 0.1, max: unitPrice - 0.5, precision: .01 });
            let product = models.ProductDimension.build({
                name: data.name,
                category: data.category,
                sub_category: data.sub_category,
                unit_price: unitPrice,
                unit_cost: unitCost,
            });
            await product.save();
            await console.log("done");
        })();
    });

    // PROMOTION DIMENSION
    let promotion = models.PromotionDimension.build({
        name: "No Promotion",
        start_date: null,
        end_date: null,
        type: "NO_PROMOTION",
        discount: 0
    });
    await promotion.save();

    for (let i = 0; i < 19; i++) {
        let promotionType = PROMOTIONS[faker.random.number({ max: PROMOTIONS.length - 1 })];
        let startDate = faker.date.between(new Date("2020"), new Date());
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + faker.random.number({ min: 0, max: 30 }));
        let promotion = models.PromotionDimension.build({
            name: faker.lorem.sentence(),
            start_date: startDate,
            end_date: endDate,
            type: promotionType,
            discount: promotionType === "FREE" ? 100 : faker.random.number({ min: 5, max: 99, precision: 5 })
        });
        await promotion.save();
    }

    // OUTLET DIMENSION
    COUNTRIES.forEach((countryName) => {
        CITIES_BY_COUNTRY[countryName].forEach(async (cityName) => {
            (async () => {
                const numberOfOutletInCity = faker.random.number({ min: 1, max: 3 });

                for (let i = 0; i < numberOfOutletInCity; i++) {
                    let outlet = models.OutletDimension.build({
                        name: faker.company.companyName(1),
                        location_name: faker.address.streetName(),
                        city: cityName,
                        country: countryName,
                    });
                    await outlet.save();
                }
                await console.log("done");
            })();
        });
    });

    // SUPPLIER DIMENSION
    COUNTRIES.forEach((countryName) => {
        CITIES_BY_COUNTRY[countryName].forEach(async (cityName) => {
            const numberOfSupplierInCity = faker.random.number({ min: 1, max: 3 });
            (async () => {
                for (let i = 0; i < numberOfSupplierInCity; i++) {
                    let supplier = models.SupplierDimension.build({
                        name: faker.company.companyName(),
                        city: cityName,
                        country: countryName,
                    });
                    await supplier.save();
                }
                await console.log("done");
            })();
        });
    });

    // TIME DIMENSION
    const now = new Date();
    for (let currDate = new Date("2020"); currDate <= now; currDate.setDate(currDate.getDate() + 1)) {
        const newTime = new Date(currDate);

        let timeDimension = models.TimeDimension.build({
            date: newTime,
            day: newTime.getDate(),
            month: newTime.getMonth() + 1,
            year: newTime.getFullYear(),
            day_name: DAY_NAMES[newTime.getDay()],
            is_holiday: faker.random.number({ max: 100 }) % 11 === 0,
            is_weekend: newTime.getDay() === 5 || newTime.getDay() === 6,
        });

        await timeDimension.save();
    }

    // WAREHOUSE DIMENSION
    COUNTRIES.forEach((countryName) => {
        CITIES_BY_COUNTRY[countryName].forEach(async (cityName) => {
            (async () => {
                let warehouse = models.WarehouseDimension.build({
                    name: faker.company.companyName(1),
                    location_name: faker.address.streetName(),
                    city: cityName,
                    country: countryName,
                });
                await warehouse.save();
                await console.log("done");
            })();
        });
    });

    await console.log("done all");

})();