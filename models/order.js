const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE,TEXT, ARRAY } = Sequelize
const BankUser = require('./bankUser')
const ClientUser = require('./clientUser')
const Guarantee = require('./guarantee')
const Order = sequelize.define('order', {
    // bankUser: { type: Schema.Types.ObjectId, ref: 'bankUser' },// 银行用户Id
    // clientUser: { type: Schema.Types.ObjectId, ref: 'clientUser' },// 代理商用户id
    company: { type: INTEGER },// 代理商id
    orderNumber: { type: STRING },// 订单编号
    // 保函审批表
    // checkForm: [{type: Schema.Types.ObjectId, ref: 'clientGuarantee'}],
    checkFormId:{type: ARRAY(TEXT)},
    //  test: { type: Schema.Types.ObjectId, ref: 'clientGuarantee' },
    scanDocument: ARRAY(TEXT),// 保函扫描件
    status: { type: INTEGER },//订单状态，0:已创建、1-8:待审批（审批等级）、9:已审批、10:已完成，-1:驳回
    // 代理商资料
    companyName: { type: STRING },// 客户名称
    contact: { type: STRING },// 联系人
    contactNumber: { type: STRING },// 联系电话
    receiveAddress: { type: STRING },// 收件地址
    remarks: { type: STRING },// 备注
    rejectRemarks: { type: STRING }, // 驳回理由
    approver: { type: STRING },// 审批人
    guaranteeSelfAddId: {type: INTEGER}, // 项目自增id，基于已有项目增加
    applyDate: { type: DATE },// 申请日期
    processDate: { type: DATE },// 处理日期
    operator: {type: ARRAY(JSON)},// 操作历史记录
})
BankUser.hasMany(Order, {as: 'order', foreignKey: 'bankUserId'})
Order.belongsTo(BankUser, {as: 'bankUser', foreignKey: 'bankUserId'})

ClientUser.hasMany(Order, {as: 'order', foreignKey: 'clientUserId'})
Order.belongsTo(ClientUser, {as: 'clientUser', foreignKey: 'clientUserId'})

Order.hasMany(Guarantee, {as: 'checkForm', foreignKey: 'guaranteeId'})
Guarantee.belongsTo(Order, {as: 'order', foreignKey: 'guaranteeId'})

module.exports = Order

