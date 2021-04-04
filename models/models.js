const { DataTypes } = require("sequelize");
const sequelize = require("../db.js");

const SalesFact = sequelize.define("sales_fact", {
    transaction_number: DataTypes.STRING,
    units_sold: DataTypes.INTEGER,
    dollars_sold: DataTypes.FLOAT,
    dollars_cost: DataTypes.FLOAT,
    profit: DataTypes.FLOAT,
}, {
    timestamps: false,
});

const InventoryFact = sequelize.define("inventory_fact", {
    quantity_in: DataTypes.INTEGER,
    quantity_out: DataTypes.INTEGER,
    quantity_available: DataTypes.INTEGER,
    latest_restock_date: DataTypes.DATEONLY
}, {
    timestamps: false,
});

const RatingFact = sequelize.define("rating_fact", {
    transaction_number: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    average_rating: DataTypes.FLOAT,
    review: DataTypes.STRING,
}, {
    timestamps: false,
});

const CustomerDimension = sequelize.define("customer_dimension", {
    birth_date: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    birth_place: DataTypes.STRING,
    marital_status: DataTypes.STRING,
    address: DataTypes.STRING,
    membership_level: DataTypes.STRING,
}, {
    timestamps: false,
});

const DateDimension = sequelize.define("date_dimension", {
    date: DataTypes.DATEONLY,
    day: DataTypes.INTEGER,
    day_of_week: DataTypes.STRING,
    month: DataTypes.STRING,
    quarter: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    is_holiday: DataTypes.BOOLEAN,
    is_weekend: DataTypes.BOOLEAN,
    is_restock_day: DataTypes.BOOLEAN,
}, {
    timestamps: false,
});

const ProductDimension = sequelize.define("product_dimension", {
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    category: DataTypes.STRING,
    package_type: DataTypes.STRING,
    package_size: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    cost_per_unit: DataTypes.FLOAT,
    price_per_unit: DataTypes.FLOAT,
    expired_date: DataTypes.DATEONLY,
}, {
    timestamps: false,
});

const OutletDimension = sequelize.define("outlet_dimension", {
    branch_manager_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    country: DataTypes.STRING,
}, {
    timestamps: false,
});

const PromotionDimension = sequelize.define("promotion_dimension", {
    title: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    type: DataTypes.STRING,
    discount: DataTypes.INTEGER,
}, {
    timestamps: false,
});

const WarehouseDimension = sequelize.define("warehouse_dimension", {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    country: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    warehouse_manager_id: DataTypes.INTEGER,
}, {
    timestamps: false,
});

const VendorDimension = sequelize.define("vendor_dimension", {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    country: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    PIC: DataTypes.STRING,
}, {
    timestamps: false,
});

SalesFact.belongsTo(DateDimension, { foreignKey: "date_id" });
SalesFact.belongsTo(ProductDimension, { foreignKey: "product_id" });
SalesFact.belongsTo(OutletDimension, { foreignKey: "outlet_id" });
SalesFact.belongsTo(CustomerDimension, { foreignKey: "customer_id" });
SalesFact.belongsTo(PromotionDimension, { foreignKey: "promotion_id" });

InventoryFact.belongsTo(DateDimension, { foreignKey: "date_id" });
InventoryFact.belongsTo(ProductDimension, { foreignKey: "product_id" });
InventoryFact.belongsTo(WarehouseDimension, { foreignKey: "warehouse_id" });
InventoryFact.belongsTo(VendorDimension, { foreignKey: "vendor_id" });


RatingFact.belongsTo(DateDimension, { foreignKey: "date_id" });
RatingFact.belongsTo(ProductDimension, { foreignKey: "product_id" });
RatingFact.belongsTo(CustomerDimension, { foreignKey: "customer_id" });

module.exports = {
    SalesFact,
    InventoryFact,
    RatingFact,
    CustomerDimension,
    DateDimension,
    ProductDimension,
    OutletDimension,
    PromotionDimension,
    WarehouseDimension,
    VendorDimension,
};