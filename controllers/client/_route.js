"use strict"

const {Router, Middleware: {clientAuth, roleAuth}} = App

const index = require('./index')

Router.post('agency/login/', index.post_login)

// 获取企业信息
Router.get('agency/company/', clientAuth, index.get_company)

Router.get('agency/getAuthority/', clientAuth, index.getAuthority)

// 工程
const project = require('./project')

Router.get('agency/project', clientAuth, project.list)

Router.get('agency/project/:id', clientAuth, project.details)

Router.post('agency/project', clientAuth, project.create)

Router.put('agency/project/:id', clientAuth, project.update)

Router.delete('agency/project/:id', clientAuth, project.delete)


// 代理商保函
const guarantee = require('./guarantee')

Router.get('agency/guarantee', clientAuth, guarantee.list)

Router.get('agency/guarantee/:id', clientAuth, guarantee.details)

Router.post('agency/guarantee', clientAuth, guarantee.create)

Router.put('agency/guarantee/:id', clientAuth, guarantee.update)

Router.delete('agency/guarantee/:id', clientAuth, guarantee.delete)


// 银行保函
const bankGuarantee = require('./bankGuarantee')

Router.get('agency/bankGuarantee', clientAuth, bankGuarantee.list)

Router.get('agency/bankGuarantee/:id', clientAuth, bankGuarantee.details)

Router.post('agency/bankGuarantee', clientAuth, bankGuarantee.create)

Router.put('agency/bankGuarantee/:id', clientAuth, bankGuarantee.update)

Router.put('agency/bankGuarantee/back/:id', clientAuth, bankGuarantee.back)

Router.delete('agency/bankGuarantee/:id', clientAuth, bankGuarantee.delete)

// 代理商角色
const clientRole = require('./role')

Router.get('agency/role', clientAuth, clientRole.list)

Router.get('agency/role/:id', clientAuth, clientRole.details)

Router.post('agency/role', clientAuth, clientRole.create)

Router.put('agency/role/:id', clientAuth, clientRole.update)

Router.delete('agency/role/:id', clientAuth, clientRole.delete)

// 代理商用户
const clientUser = require('./user')

Router.get('agency/user', clientAuth, clientUser.list)

Router.get('agency/user/:id', clientAuth, clientUser.details)

Router.post('agency/user', clientAuth, clientUser.create)

Router.put('agency/user/:id', clientAuth, clientUser.update)

Router.delete('agency/user/:id', clientAuth, clientUser.delete)

//客户
const customerUser_pg = require('./customer.js')

Router.get('agency/customers', clientAuth, customerUser_pg.list)

Router.get('agency/customers/:id', clientAuth, customerUser_pg.details)

Router.post('agency/customers', clientAuth, customerUser_pg.create)

Router.put('agency/customers/:id', clientAuth, customerUser_pg.update)

Router.delete('agency/customer/:id', clientAuth, customerUser_pg.delete)


//保函类型
const guaranteeType = require('./setting/guaranteeType')

Router.get('agency/setting/guaranteeType', clientAuth, guaranteeType.list)

Router.get('agency/setting/guaranteeType/:id', clientAuth, guaranteeType.details)

Router.post('agency/setting/guaranteeType', clientAuth, guaranteeType.create)

Router.put('agency/setting/guaranteeType/:id', clientAuth, guaranteeType.update)

Router.delete('agency/setting/guaranteeType/:id', clientAuth, guaranteeType.delete)