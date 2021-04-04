require('dotenv').config();
const faker = require('faker');
const sequelize = require('./db');
const models = require('./models');

const { COUNTRIES, CITIES_BY_COUNTRY } = require('./data/countries');
const GENDER = require('./data/gender');
const MARITAL_STATUS = require('./data/marital_status');
const MEMBERSHIPS = require('./data/memberships');
const PRODUCTS = require('./data/products');
const PROMOTIONS = require('./data/promotions');
const { DAY_NAMES, MONTH_NAMES } = require('./data/times');
const OUTLETS = require('./data/outlets');
const WAREHOUSES = require('./data/warehouses');
const VENDORS = require('./data/vendors');

(async () => {
        await sequelize.drop();
        await sequelize.sync({ force: true });

        // CUSTOMER DIMENSION
        for (let i = 0; i < 1000; i++) {
                country = faker.datatype.number(5);
                let customer = models.CustomerDimension.build({
                        birth_date: faker.date.between(new Date("1970"), new Date("2003")),
                        gender: GENDER[faker.datatype.number({max: 1})],
                        birth_place: CITIES_BY_COUNTRY[COUNTRIES[country]][faker.datatype.number({max: 2})],
                        marital_status: MARITAL_STATUS[faker.datatype.number({max: 1})],
                        address: CITIES_BY_COUNTRY[COUNTRIES[country]][faker.datatype.number({max: 2})] + ", " + COUNTRIES[country],
                        membership_level: MEMBERSHIPS[faker.datatype.number({max: 2})]
                });
                customer.save();
                console.log("done");
        }

        // // DATE DIMENSION
        for (let currDate = new Date("2020"); currDate <= new Date(2020,3,31); currDate.setDate(currDate.getDate() + 1)) {
                
                (async () => {
                        const newTime = new Date(currDate);

                        let dateDimension = models.DateDimension.build({
                                date: newTime,
                                day: newTime.getDate(),
                                day_of_week: DAY_NAMES[newTime.getDay()],
                                month: MONTH_NAMES[newTime.getMonth()],
                                quarter: Math.ceil((newTime.getMonth() + 1)/4),
                                year: newTime.getFullYear(),
                                is_holiday: faker.datatype.number({ max: 100 }) % 11 === 0,
                                is_weekend: newTime.getDay() === 5 || newTime.getDay() === 6,
                                is_restock_day: newTime.getDay() === 3
                                });

                        await dateDimension.save();
                })();
        }

        // PRODUCT DIMENSION
        PRODUCTS.forEach(async (data) => {
                (async () => {
                        let unitPrice = faker.datatype.number({ min: 1, max: 5, precision: .01 });
                        let unitCost = faker.datatype.number({ min: 0.1, max: unitPrice - 0.5, precision: .01 });
                        let product = models.ProductDimension.build({
                                name: data.name,
                                brand: data.brand,
                                category: data.category,
                                package_type: data.package_type,
                                package_size: parseInt(data.package_size),
                                weight: parseFloat(data.weight),
                                cost_per_unit: unitCost,
                                price_per_unit: unitPrice,
                                expired_date: faker.date.between(new Date("2022"), new Date("2023")),
                        });
                        await product.save();
                        await console.log("done");
                })();
        });

        let outlet = models.OutletDimension.build({
                branch_manager_id: OUTLETS[0].branch_manager_id,
                name: OUTLETS[0].name,
                type: OUTLETS[0].type,
                address: OUTLETS[0].address,
                city: OUTLETS[0].city,
                province: OUTLETS[0].province,
                country: OUTLETS[0].country,
        })
        await outlet.save();
        
        // OUTLET DIMENSION
        OUTLETS.forEach(async (data_outlet) => {
                (async () => {
                        await console.log(data_outlet);
                        let outlet = models.OutletDimension.build({
                                branch_manager_id: data_outlet.branch_manager_id,
                                name: data_outlet.name,
                                type: data_outlet.type,
                                address: data_outlet.address,
                                city: data_outlet.city,
                                province: data_outlet.province,
                                country: data_outlet.country,
                        })
                        await outlet.save();
                        await console.log('done');
                })();
        })

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
                let promotionType = PROMOTIONS[faker.datatype.number({ max: PROMOTIONS.length - 1 })];
                let startDate = faker.date.between(new Date(2020,1,1), new Date(2020,3,30));
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + faker.datatype.number({ min: 0, max: 30 }));
                let promotion = models.PromotionDimension.build({
                        title: faker.lorem.sentence(),
                        start_date: startDate,
                        end_date: endDate,
                        type: PROMOTIONS[faker.datatype.number({ max: PROMOTIONS.length - 1 })],
                        discount: promotionType === "FREE" ? 100 : faker.datatype.number({ min: 5, max: 99, precision: 5 })
                });
                await promotion.save();
        }

        // WAREHOUSE DIMENSION
        WAREHOUSES.forEach(async (data) => {
                (async () => {
                        let warehouse = models.WarehouseDimension.build({
                                name: data.name,
                                type: data.type,
                                address: data.address,
                                city: data.city,
                                province: data.province,
                                country: data.country,
                                capacity: data.capacity,
                                warehouse_manager_id: data.branch_manager_id,
                        })
                        await warehouse.save();
                        await console.log('done');
                })();
        })

        // VENDOR DIMENSION
        VENDORS.forEach(async (data) => {
                (async () => {
                        let vendor = models.VendorDimension.build({
                                name: data.name,
                                type: data.type,
                                address: data.address,
                                city: data.city,
                                province: data.province,
                                country: data.country,
                                capacity: data.capacity,
                                PIC: data.PIC,
                        })
                        await vendor.save();
                        await console.log('done');
                })();
        })
})();