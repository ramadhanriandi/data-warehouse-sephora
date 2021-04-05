require('dotenv').config();
const faker = require('faker');
const models = require('../models');

const findInventoryDimensions = async () => {
    const dates = await models.DateDimension.findAll({ attributes: ["id", "date"] });
    const products = await models.ProductDimension.findAll({ attributes: ["id"] });
    const warehouses = await models.WarehouseDimension.findAll({ attributes: ["id"] });
    const vendors = await models.VendorDimension.findAll({ attributes: ["id"] });

    return { products, dates, warehouses, vendors };
};

(async () => {
    // INVENTORY FACT
    await models.InventoryFact.sync({ force: true });

    await findInventoryDimensions().then((inventoryDimensions) => {
        const { products, dates, warehouses, vendors } = inventoryDimensions;

        warehouses.forEach((warehouse) => {
            (async () => {
                for (let productId = 1; productId <= products.length; productId++) {
                    let quantityAvailable = await faker.random.number({ max: 1000 });
                    
                    let latestRestockDate = dates[0].date;

                    for (let dateId = 1; dateId <= dates.length; dateId++) {
                        let quantityIn = await faker.random.number({ max: 100 });
                        let quantityOut = await faker.random.number({ max: quantityAvailable });
                        quantityAvailable += (quantityIn - quantityOut);

                        if (quantityIn > 0) {
                            latestRestockDate = dates[dateId - 1].date;
                        }

                        let inventory = models.InventoryFact.build({
                            date_id: dateId,
                            product_id: productId,
                            warehouse_id: warehouse.id,
                            vendor_id: vendors[faker.random.number({ max: vendors.length - 1 })].id,
                            quantity_in: quantityIn,
                            quantity_out: quantityOut,
                            quantity_available: quantityAvailable,
                            latest_restock_date: latestRestockDate,
                        });

                        await inventory.save();
                    }
                }
            })();
        });
    })
})();