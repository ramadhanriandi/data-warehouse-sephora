require('dotenv').config();
const faker = require('faker');
const models = require('./models');

const findInventoryDimensions = async () => {
    const items = await models.ItemDimension.findAll({ attributes: ["id"] });
    const times = await models.TimeDimension.findAll({ attributes: ["id"] });
    const warehouses = await models.WarehouseDimension.findAll({ attributes: ["id", "city"] });
    const suppliers = await models.SupplierDimension.findAll({ attributes: ["id", "city"] });

    return { items, times, warehouses, suppliers };
};

(async () => {
    // INVENTORY FACT
    await models.InventoryFact.sync({ force: true });
    await findInventoryDimensions().then((inventoryDimensions) => {
        const { items, times, warehouses, suppliers } = inventoryDimensions;

        warehouses.forEach((warehouse) => {
            const sameCitySuppliers = suppliers.filter((supplier) => {
                return supplier.city === warehouse.city;
            });
            (async () => {
                for (let itemId = 1; itemId <= items.length; itemId++) {
                    let quantityAvailable = await faker.random.number({ max: 1000 });

                    for (let timeId = 1; timeId <= times.length; timeId++) {
                        let quantityIn = await faker.random.number({ max: 100 });
                        let quantityOut = await faker.random.number({ max: quantityAvailable });
                        quantityAvailable += (quantityIn - quantityOut);

                        let inventory = models.InventoryFact.build({
                            time_id: timeId,
                            item_id: itemId,
                            warehouse_id: warehouse.id,
                            supplier_id: sameCitySuppliers[faker.random.number({ max: sameCitySuppliers.length - 1 })].id,
                            quantity_in: quantityIn,
                            quantity_out: quantityOut,
                            quantity_available: quantityAvailable,
                        });
                        await inventory.save();
                    }
                    await console.log(itemId);
                }
                await console.log(warehouse);
            })();
        });
    })
    await console.log("done");
})();