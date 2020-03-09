"use strict"
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")
const md5 = require('MD5')
const {Config, Helper, Models, Validator} = App
const {bankKye, aesKey} = Config
const {Sequelize, PG} = Models
const {Admin} = PG
const {Op} = App.sequelize
exports.getToken = async ctx => {
    ctx.body = {
        "code": 20000,
        "data": {
            "token": "admin-token"
        }
    }
}
exports.userInfo = async ctx => {
    ctx.body = {
        code:20000,
        data:{
            roles:[ "admin" ],
            introduction:"I am a super administrator",
            avatar:"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            name:"Super Admin"
        }
    }
}
exports.getlist = async ctx => {
    ctx.body = {
        "code": 200,
        "message": "操作成功",
        "data": {
            "roles": [
                "TEST"
            ],
            "icon": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            "menus": [
                {
                    "id": 1,
                    "parentId": 0,
                    "createTime": "2020-02-02T06:50:36.000+0000",
                    "title": "商品",
                    "level": 0,
                    "sort": 0,
                    "name": "pms",
                    "icon": "product",
                    "hidden": 0
                },
                {
                    "id": 2,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:51:50.000+0000",
                    "title": "商品列表",
                    "level": 1,
                    "sort": 0,
                    "name": "product",
                    "icon": "product-list",
                    "hidden": 0
                },
                {
                    "id": 3,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:52:44.000+0000",
                    "title": "添加商品",
                    "level": 1,
                    "sort": 0,
                    "name": "addProduct",
                    "icon": "product-add",
                    "hidden": 0
                },
                {
                    "id": 4,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:53:51.000+0000",
                    "title": "商品分类",
                    "level": 1,
                    "sort": 0,
                    "name": "productCate",
                    "icon": "product-cate",
                    "hidden": 0
                },
                {
                    "id": 5,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:54:51.000+0000",
                    "title": "商品类型",
                    "level": 1,
                    "sort": 0,
                    "name": "productAttr",
                    "icon": "product-attr",
                    "hidden": 0
                },
                {
                    "id": 6,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:56:29.000+0000",
                    "title": "品牌管理",
                    "level": 1,
                    "sort": 0,
                    "name": "brand",
                    "icon": "product-brand",
                    "hidden": 0
                },
                {
                    "id": 7,
                    "parentId": 0,
                    "createTime": "2020-02-02T08:54:07.000+0000",
                    "title": "订单",
                    "level": 0,
                    "sort": 0,
                    "name": "oms",
                    "icon": "order",
                    "hidden": 0
                },
                {
                    "id": 8,
                    "parentId": 7,
                    "createTime": "2020-02-02T08:55:18.000+0000",
                    "title": "订单列表",
                    "level": 1,
                    "sort": 0,
                    "name": "order",
                    "icon": "product-list",
                    "hidden": 0
                },
                {
                    "id": 9,
                    "parentId": 7,
                    "createTime": "2020-02-02T08:56:46.000+0000",
                    "title": "订单设置",
                    "level": 1,
                    "sort": 0,
                    "name": "orderSetting",
                    "icon": "order-setting",
                    "hidden": 0
                },
                {
                    "id": 10,
                    "parentId": 7,
                    "createTime": "2020-02-02T08:57:39.000+0000",
                    "title": "退货申请处理",
                    "level": 1,
                    "sort": 0,
                    "name": "returnApply",
                    "icon": "order-return",
                    "hidden": 0
                },
                {
                    "id": 11,
                    "parentId": 7,
                    "createTime": "2020-02-02T08:59:40.000+0000",
                    "title": "退货原因设置",
                    "level": 1,
                    "sort": 0,
                    "name": "returnReason",
                    "icon": "order-return-reason",
                    "hidden": 0
                },
                {
                    "id": 12,
                    "parentId": 0,
                    "createTime": "2020-02-04T08:18:00.000+0000",
                    "title": "营销",
                    "level": 0,
                    "sort": 0,
                    "name": "sms",
                    "icon": "sms",
                    "hidden": 0
                },
                {
                    "id": 13,
                    "parentId": 12,
                    "createTime": "2020-02-04T08:19:22.000+0000",
                    "title": "秒杀活动列表",
                    "level": 1,
                    "sort": 0,
                    "name": "flash",
                    "icon": "sms-flash",
                    "hidden": 0
                },
                {
                    "id": 14,
                    "parentId": 12,
                    "createTime": "2020-02-04T08:20:16.000+0000",
                    "title": "优惠券列表",
                    "level": 1,
                    "sort": 0,
                    "name": "coupon",
                    "icon": "sms-coupon",
                    "hidden": 0
                },
                {
                    "id": 16,
                    "parentId": 12,
                    "createTime": "2020-02-07T08:22:38.000+0000",
                    "title": "品牌推荐",
                    "level": 1,
                    "sort": 0,
                    "name": "homeBrand",
                    "icon": "product-brand",
                    "hidden": 0
                },
                {
                    "id": 17,
                    "parentId": 12,
                    "createTime": "2020-02-07T08:23:14.000+0000",
                    "title": "新品推荐",
                    "level": 1,
                    "sort": 0,
                    "name": "homeNew",
                    "icon": "sms-new",
                    "hidden": 0
                },
                {
                    "id": 18,
                    "parentId": 12,
                    "createTime": "2020-02-07T08:26:38.000+0000",
                    "title": "人气推荐",
                    "level": 1,
                    "sort": 0,
                    "name": "homeHot",
                    "icon": "sms-hot",
                    "hidden": 0
                },
                {
                    "id": 19,
                    "parentId": 12,
                    "createTime": "2020-02-07T08:28:16.000+0000",
                    "title": "专题推荐",
                    "level": 1,
                    "sort": 0,
                    "name": "homeSubject",
                    "icon": "sms-subject",
                    "hidden": 0
                },
                {
                    "id": 20,
                    "parentId": 12,
                    "createTime": "2020-02-07T08:28:42.000+0000",
                    "title": "广告列表",
                    "level": 1,
                    "sort": 0,
                    "name": "homeAdvertise",
                    "icon": "sms-ad",
                    "hidden": 0
                },
                {
                    "id": 21,
                    "parentId": 0,
                    "createTime": "2020-02-07T08:29:13.000+0000",
                    "title": "权限",
                    "level": 0,
                    "sort": 0,
                    "name": "ums",
                    "icon": "ums",
                    "hidden": 0
                },
                {
                    "id": 22,
                    "parentId": 21,
                    "createTime": "2020-02-07T08:29:51.000+0000",
                    "title": "用户列表",
                    "level": 1,
                    "sort": 0,
                    "name": "admin",
                    "icon": "ums-admin",
                    "hidden": 0
                },
                {
                    "id": 23,
                    "parentId": 21,
                    "createTime": "2020-02-07T08:30:13.000+0000",
                    "title": "角色列表",
                    "level": 1,
                    "sort": 0,
                    "name": "role",
                    "icon": "ums-role",
                    "hidden": 0
                },
                {
                    "id": 24,
                    "parentId": 21,
                    "createTime": "2020-02-07T08:30:53.000+0000",
                    "title": "菜单列表",
                    "level": 1,
                    "sort": 0,
                    "name": "menu",
                    "icon": "ums-menu",
                    "hidden": 0
                },
                {
                    "id": 25,
                    "parentId": 21,
                    "createTime": "2020-02-07T08:31:13.000+0000",
                    "title": "资源列表",
                    "level": 1,
                    "sort": 0,
                    "name": "resource",
                    "icon": "ums-resource",
                    "hidden": 0
                }
            ],
            "username": "admin"
        }
    }
    // {
    //     code: 200,
    //     message: "操作成功",
    //     data: {
    //         "icon": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    //         "roles": ["TEST"],
    //         // "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg",
    //         "menus":[],
    //         "username":"admin"
    //     }
    // }
}
exports.userlist = async ctx => {
    ctx.body = {
        "code": 200,
        "message": "操作成功",
        "data": {
            "pageNum": 1,
            "pageSize": 10,
            "totalPage": 1,
            "total": 5,
            "list": [
                {
                    "id": 1,
                    "username": "test",
                    "password": "$2a$10$NZ5o7r2E.ayT2ZoxgjlI.eJ6OEYqjH7INR/F.mXDbjZJi9HF0YCVG",
                    "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg",
                    "email": "test@qq.com",
                    "nickName": "测试账号",
                    "note": null,
                    "createTime": "2018-09-29T05:55:30.000+0000",
                    "loginTime": "2018-09-29T05:55:39.000+0000",
                    "status": 1
                },
                {
                    "id": 3,
                    "username": "admin",
                    "password": "$2a$10$.E1FokumK5GIXWgKlg.Hc.i/0/2.qdAwYFL1zc5QHdyzpXOr38RZO",
                    "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg",
                    "email": "admin@163.com",
                    "nickName": "系统管理员",
                    "note": "系统管理员",
                    "createTime": "2018-10-08T05:32:47.000+0000",
                    "loginTime": "2019-04-20T04:45:16.000+0000",
                    "status": 1
                },
                {
                    "id": 4,
                    "username": "macro",
                    "password": "$2a$10$Bx4jZPR7GhEpIQfefDQtVeS58GfT5n6mxs/b4nLLK65eMFa16topa",
                    "icon": "string",
                    "email": "macro@qq.com",
                    "nickName": "macro",
                    "note": "macro专用111",
                    "createTime": "2019-10-06T07:53:51.000+0000",
                    "loginTime": "2020-02-03T06:55:55.000+0000",
                    "status": 1
                },
                {
                    "id": 6,
                    "username": "productAdmin",
                    "password": "$2a$10$6/.J.p.6Bhn7ic4GfoB5D.pGd7xSiD1a9M6ht6yO0fxzlKJPjRAGm",
                    "icon": null,
                    "email": "product@qq.com",
                    "nickName": "商品管理员",
                    "note": "只有商品权限",
                    "createTime": "2020-02-07T08:15:08.000+0000",
                    "loginTime": null,
                    "status": 1
                },
                {
                    "id": 7,
                    "username": "orderAdmin",
                    "password": "$2a$10$UqEhA9UZXjHHA3B.L9wNG.6aerrBjC6WHTtbv1FdvYPUI.7lkL6E.",
                    "icon": null,
                    "email": "order@qq.com",
                    "nickName": "订单管理员",
                    "note": "只有订单管理权限",
                    "createTime": "2020-02-07T08:15:50.000+0000",
                    "loginTime": null,
                    "status": 1
                }
            ]
        }
    }
}
exports.rolelistAll = async ctx => {
    ctx.body = {
        "code": 200,
        "message": "操作成功",
        "data": {
            "pageNum": 1,
            "pageSize": 5,
            "totalPage": 1,
            "total": 4,
            "list": [
                {
                    "id": 1,
                    "name": "商品管理员",
                    "description": "只能查看及操作商品",
                    "adminCount": 0,
                    "createTime": "2020-02-03T08:50:37.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 2,
                    "name": "订单管理员",
                    "description": "只能查看及操作订单",
                    "adminCount": 0,
                    "createTime": "2018-09-30T07:53:45.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 5,
                    "name": "超级管理员",
                    "description": "拥有所有查看和操作功能",
                    "adminCount": 0,
                    "createTime": "2020-02-02T07:11:05.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 6,
                    "name": "测试角色",
                    "description": "仅供测试",
                    "adminCount": 0,
                    "createTime": "2020-02-12T02:14:09.000+0000",
                    "status": 1,
                    "sort": 0
                }
            ]
        }
    }
}
exports.rolelist = async ctx => {
    ctx.body = {
        "code": 200,
        "message": "操作成功",
        "data": {
            "pageNum": 1,
            "pageSize": 5,
            "totalPage": 1,
            "total": 4,
            "list": [
                {
                    "id": 1,
                    "name": "商品管理员",
                    "description": "只能查看及操作商品",
                    "adminCount": 0,
                    "createTime": "2020-02-03T08:50:37.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 2,
                    "name": "订单管理员",
                    "description": "只能查看及操作订单",
                    "adminCount": 0,
                    "createTime": "2018-09-30T07:53:45.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 5,
                    "name": "超级管理员",
                    "description": "拥有所有查看和操作功能",
                    "adminCount": 0,
                    "createTime": "2020-02-02T07:11:05.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 6,
                    "name": "测试角色",
                    "description": "仅供测试",
                    "adminCount": 0,
                    "createTime": "2020-02-12T02:14:09.000+0000",
                    "status": 1,
                    "sort": 0
                }
            ]
        }
    }
}
exports.menuTreeList = async ctx => {
    ctx.body = {
        "code": 200,
        "message": "操作成功",
        "data": {
            "pageNum": 1,
            "pageSize": 5,
            "totalPage": 1,
            "total": 4,
            "list": [
                {
                    "id": 1,
                    "name": "商品管理员",
                    "description": "只能查看及操作商品",
                    "adminCount": 0,
                    "createTime": "2020-02-03T08:50:37.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 2,
                    "name": "订单管理员",
                    "description": "只能查看及操作订单",
                    "adminCount": 0,
                    "createTime": "2018-09-30T07:53:45.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 5,
                    "name": "超级管理员",
                    "description": "拥有所有查看和操作功能",
                    "adminCount": 0,
                    "createTime": "2020-02-02T07:11:05.000+0000",
                    "status": 1,
                    "sort": 0
                },
                {
                    "id": 6,
                    "name": "测试角色",
                    "description": "仅供测试",
                    "adminCount": 0,
                    "createTime": "2020-02-12T02:14:09.000+0000",
                    "status": 1,
                    "sort": 0
                }
            ]
        }
    }
}
