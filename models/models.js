const { DataTypes } = require("sequelize");
const sequelize = require("./db.js");

const InventoryFact = sequelize.define("inventory_fact", {
    quantity_in: DataTypes.INTEGER,
    quantity_out: DataTypes.INTEGER,
    quantity_available: DataTypes.INTEGER,
}, {
    timestamps: false,
});

const LoyaltyFact = sequelize.define("loyalty_fact", {
    transaction_number: DataTypes.STRING,
    transaction_stars: DataTypes.INTEGER,
    transaction_dollars: DataTypes.FLOAT,
}, {
    timestamps: false,
});

const SalesFact = sequelize.define("sales_fact", {
    transaction_number: DataTypes.STRING,
    units_sold: DataTypes.INTEGER,
    dollars_sold: DataTypes.FLOAT,
    dollars_cost: DataTypes.FLOAT,
    profit: DataTypes.FLOAT,
}, {
    timestamps: false,
});

const SatisfactionFact = sequelize.define("satisfaction_fact", {
    transaction_number: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    units_sold: DataTypes.INTEGER,
}, {
    timestamps: false,
});

const CustomerDimension = sequelize.define("customer_dimension", {
    birth_date: DataTypes.DATEONLY,
    country: DataTypes.STRING,
    is_received_marketing: DataTypes.BOOLEAN,
    joined_date: DataTypes.DATEONLY,
}, {
    timestamps: false,
});

const DeliveryDimension = sequelize.define("delivery_dimension", {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
}, {
    timestamps: false,
});

const ItemDimension = sequelize.define("item_dimension", {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    sub_category: DataTypes.STRING,
    unit_cost: DataTypes.FLOAT,
}, {
    timestamps: false,
});

const MediaDimension = sequelize.define("media_dimension", {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
}, {
    timestamps: false,
});

const MembershipDimension = sequelize.define("membership_dimension", {
    level_name: DataTypes.STRING,
}, {
    timestamps: false,
});

const PaymentDimension = sequelize.define("payment_dimension", {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
}, {
    timestamps: false,
});

const ProductDimension = sequelize.define("product_dimension", {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    sub_category: DataTypes.STRING,
    unit_price: DataTypes.FLOAT,
    unit_cost: DataTypes.FLOAT,
}, {
    timestamps: false,
});

const PromotionDimension = sequelize.define("promotion_dimension", {
    name: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    type: DataTypes.STRING,
    discount: DataTypes.INTEGER,
}, {
    timestamps: false,
});

const OutletDimension = sequelize.define("outlet_dimension", {
    name: DataTypes.STRING,
    location_name: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
}, {
    timestamps: false,
});

const SupplierDimension = sequelize.define("supplier_dimension", {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
}, {
    timestamps: false,
});

const TimeDimension = sequelize.define("time_dimension", {
    date: DataTypes.DATEONLY,
    day: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    day_name: DataTypes.STRING,
    is_holiday: DataTypes.BOOLEAN,
    is_weekend: DataTypes.BOOLEAN,
}, {
    timestamps: false,
});

const WarehouseDimension = sequelize.define("warehouse_dimension", {
    name: DataTypes.STRING,
    location_name: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
}, {
    timestamps: false,
});

InventoryFact.belongsTo(TimeDimension, { foreignKey: "time_id" });
InventoryFact.belongsTo(ItemDimension, { foreignKey: "item_id" });
InventoryFact.belongsTo(WarehouseDimension, { foreignKey: "warehouse_id" });
InventoryFact.belongsTo(SupplierDimension, { foreignKey: "supplier_id" });

LoyaltyFact.belongsTo(TimeDimension, { foreignKey: "time_id" });
LoyaltyFact.belongsTo(CustomerDimension, { foreignKey: "customer_id" });
LoyaltyFact.belongsTo(MembershipDimension, { foreignKey: "membership_id" });
LoyaltyFact.belongsTo(OutletDimension, { foreignKey: "outlet_id" });

SalesFact.belongsTo(TimeDimension, { foreignKey: "time_id" });
SalesFact.belongsTo(ProductDimension, { foreignKey: "product_id" });
SalesFact.belongsTo(OutletDimension, { foreignKey: "outlet_id" });
SalesFact.belongsTo(PaymentDimension, { foreignKey: "payment_id" });
SalesFact.belongsTo(PromotionDimension, { foreignKey: "promotion_id" });
SalesFact.belongsTo(DeliveryDimension, { foreignKey: "delivery_id" });

SatisfactionFact.belongsTo(TimeDimension, { foreignKey: "time_id" });
SatisfactionFact.belongsTo(ProductDimension, { foreignKey: "product_id" });
SatisfactionFact.belongsTo(OutletDimension, { foreignKey: "outlet_id" });
SatisfactionFact.belongsTo(MediaDimension, { foreignKey: "media_id" });

module.exports = {
    InventoryFact,
    LoyaltyFact,
    SalesFact,
    SatisfactionFact,
    CustomerDimension,
    DeliveryDimension,
    ItemDimension,
    MediaDimension,
    MembershipDimension,
    PaymentDimension,
    ProductDimension,
    PromotionDimension,
    OutletDimension,
    SupplierDimension,
    TimeDimension,
    WarehouseDimension,
};