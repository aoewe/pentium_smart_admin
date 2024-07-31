import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'el-icon-house'
      }
    }]
  }
]
export const asyncRoutes = [
  // 系统管理
  {
    path: '/authority',
    component: Layout,
    name: 'Authority',
    meta: {
      title: '权限管理'
    },
    children: [{
        path: 'role',
        name: 'AuthorityRole',
        component: () => import('@/views/authority/role'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'menu',
        name: 'AuthorityMenu',
        component: () => import('@/views/authority/menu'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/authority/logs'),
        meta: {
          title: '日志管理'
        }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/authority/config'),
        meta: {
          title: '配置管理'
        }
      },
      {
        path: 'api',
        name: 'AuthorityApi',
        component: () => import('@/views/authority/api'),
        meta: {
          title: 'API管理'
        }
      }
    ]
  },
  // 数据管理
  {
    path: '/dataManage',
    component: Layout,
    name: 'dataManage',
    meta: {
      title: '数据管理'
    },
    children: [{
        path: 'form',
        name: 'Form',
        component: () => import('@/views/dataManage/form'),
        meta: {
          title: '生产数据列表'
        }
      },
      {
        path: 'newData',
        name: 'NewData',
        component: () => import('@/views/dataManage/newData'),
        meta: {
          title: '添加生产数据'
        }
      },
      {
        path: 'equipmentParty',
        name: 'EquipmentParty',
        component: () => import('@/views/dataManage/equipmentParty'),
        meta: {
          title: '设备方列表'
        }
      },
      {
        path: 'factoryDetails',
        name: 'FactoryDetails',
        component: () => import('@/views/dataManage/factoryDetails'),
        meta: {
          title: '设备方结算'
        }
      },
      {
        path: 'settlementList',
        name: 'SettlementList',
        component: () => import('@/views/dataManage/settlementList'),
        meta: {
          title: '已结算列表'
        }
      },
      {
        path: 'purchaser',
        name: 'Purchaser',
        component: () => import('@/views/dataManage/purchaser'),
        meta: {
          title: '购买方列表'
        }
      },
      {
        path: 'purchaserDetails',
        name: 'PurchaserDetails',
        meta: {
          title: '购买方结算'
        },
        component: () => import('@/views/dataManage/purchaserDetails')
      },
      {
        path: 'owner',
        name: 'Owner',
        component: () => import('@/views/dataManage/owner'),
        meta: {
          title: '业主方列表'
        }
      }
    ]
  },
  // 企业管理
  {
    path: '/mnterpriseManage',
    meta: {
      title: '企业管理'
    },
    component: Layout,
    children: [{
        path: 'equipmentLayingParty',
        name: 'EquipmentLayingParty',
        component: () => import('@/views/mnterpriseManage/equipmentLayingParty'),
        meta: {
          title: '铺设方'
        }
      },
      {
        path: 'layingDetails',
        name: 'LayingDetails',
        component: () => import('@/views/mnterpriseManage/layingDetails'),
        meta: {
          title: '铺设方详情'
        }
      },
      {
        path: 'ownerList',
        name: 'OwnerList',
        component: () => import('@/views/mnterpriseManage/ownerList'),
        meta: {
          title: '业主方'
        }
      },
      {
        path: 'equipmentPartyList',
        name: 'EquipmentPartyList',
        component: () => import('@/views/mnterpriseManage/equipmentPartyList'),
        meta: {
          title: '购买方'
        }
      },
      {
        path: 'equipmentDetails',
        name: 'EquipmentDetails',
        component: () => import('@/views/mnterpriseManage/equipmentDetails'),
        meta: {
          title: '购买方详情'
        }
      }
    ]
  },
  // 设备管理
  {
    path: '/equipmentManage',
    meta: {
      title: '设备管理'
    },
    component: Layout,
    children: [{
        path: 'equipmentAllList',
        name: 'EquipmentAllList',
        component: () => import('@/views/equipmentManage/equipmentAllList'),
        meta: {
          title: '设备列表'
        }
      }, {
        path: 'equipmentApply',
        name: 'EquipmentApply',
        component: () => import('@/views/equipmentManage/equipmentApply'),
        meta: {
          title: '设备申请'
        }
      },
      {
        path: 'faultList',
        name: 'FaultList',
        component: () => import('@/views/equipmentManage/faultList'),
        meta: {
          title: '故障列表'
        }
      },
      {
        path: 'newEquipment',
        name: 'NewEquipment',
        component: () => import('@/views/equipmentManage/newEquipment'),
        meta: {
          title: '新增设备'
        }
      },
      {
        path: 'exhibition',
        name: 'Exhibition',
        component: () => import('@/views/equipmentManage/exhibition'),
        meta: {
          title: '设备展示'
        }
      },
      {
        path: 'exhibitionDetails',
        name: 'ExhibitionDetails',
        component: () => import('@/views/equipmentManage/exhibitionDetails'),
        meta: {
          title: '编辑设备'
        }
      },
      {
        path: 'monitorList',
        name: 'MonitorList',
        component: () => import('@/views/equipmentManage/monitorList'),
        meta: {
          title: '监控管理'
        }
      }
    ]
  },
  // 账号管理
  {
    path: '/account',
    meta: {
      title: '账号管理'
    },
    name: 'Account',
    component: Layout,
    children: [{
        path: 'index',
        name: 'AccountList',
        component: () => import('@/views/account/index'),
        meta: {
          title: '账号列表'
        }
      },
      {
        path: 'stream',
        name: 'Stream',
        component: () => import('@/views/account/stream'),
        meta: {
          title: '用户流水'
        }
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('@/views/account/department'),
        meta: {
          title: '部门管理'
        }
      },
      {
        path: 'salesman',
        name: 'Salesman',
        component: () => import('@/views/account/salesman'),
        meta: {
          title: '业务员管理'
        }
      },
      {
        path: 'postReview',
        name: 'PostReview',
        component: () => import('@/views/account/postReview'),
        meta: {
          title: '员工审核'
        }
      },
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('@/views/account/staff'),
        meta: {
          title: '岗位列表'
        }
      }
    ]
  },
  // 财务管理
  {
    path: '/financeManage',
    component: Layout,
    name: 'FinanceManage',
    meta: {
      title: '财务管理'
    },
    children: [{
      path: 'factory',
      name: 'Factory',
      meta: {
        title: '生产模块'
      },
      component: () => import('@/views/financeManage/factory'),
      children: [{
          path: 'settlementLog',
          name: 'SettlementLog',
          component: () => import('@/views/financeManage/factory/settlementLog'),
          meta: {
            title: '结算日志'
          }
        },
        {
          path: 'generateOrder',
          name: 'GenerateOrder',
          meta: {
            title: '生成付款单'
          },
          component: () => import('@/views/financeManage/factory/generateOrder')
        }, {
          path: 'orderList',
          name: 'OrderList',
          meta: {
            title: '付款单列表'
          },
          component: () => import('@/views/financeManage/factory/orderList')
        }
      ]
    }, {
      path: 'mall',
      name: 'Mall',
      meta: {
        title: '商城模块'
      },
      component: () => import('@/views/financeManage/mall'),
      children: [{
        path: 'rechargeAudit',
        component: () => import('@/views/financeManage/mall/rechargeAudit'),
        name: 'RechargeAudit',
        meta: {
          title: '充值审核'
        }
      }]
    }]
  },
  // 内容管理
  {
    path: '/contentManage',
    component: Layout,
    name: 'ContentManage',
    meta: {
      title: '内容管理'
    },
    children: [{
        path: 'article',
        name: 'Article',
        component: () => import('@/views/contentManage/article'),
        meta: {
          title: '文章列表'
        }
      },
      {
        path: 'banner',
        name: 'Banner',
        meta: {
          title: '幻灯片列表'
        },
        component: () => import('@/views/contentManage/banner')
      },
      {
        path: 'recruitInfo',
        name: 'RecruitInfo',
        meta: {
          title: '招聘信息'
        },
        component: () => import('@/views/contentManage/recruitInfo')
      },
      {
        path: 'publishRecruit',
        name: 'PublishRecruit',
        meta: {
          title: '招聘管理'
        },
        component: () => import('@/views/contentManage/publishRecruit')
      },
      {
        path: 'cooperativeEnterprise',
        name: 'CooperativeEnterprise',
        meta: {
          title: '合作企业'
        },
        component: () => import('@/views/contentManage/cooperativeEnterprise')
      },
      {
        path: 'icon',
        component: () => import('@/views/contentManage/icons'),
        name: 'Icons',
        meta: {
          title: '图标',
          icon: 'icon',
          noCache: true
        }
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('@/views/contentManage/feedback'),
        meta: {
          title: '用户反馈'
        }
      }
    ]
  },
  // 商城管理
  {
    path: '/goodsManage',
    component: Layout,
    name: 'GoodsManage',
    meta: {
      title: '商城管理'
    },
    children: [{
      path: 'list',
      name: 'GoodsList',
      component: () => import('@/views/goodsManage/list'),
      meta: {
        title: '商品列表'
      }
    }, {
      path: 'details',
      name: 'GoodsDetails',
      component: () => import('@/views/goodsManage/details'),
      meta: {
        title: '新增/编辑商品'
      }
    }, {
      path: 'category',
      name: 'GoodsCategory',
      component: () => import('@/views/goodsManage/category'),
      meta: {
        title: '商品类别'
      }
    }, {
      path: 'goodsOrderList',
      name: 'GoodsOrderList',
      component: () => import('@/views/goodsManage/goodsOrderList'),
      meta: {
        title: '订单列表'
      }
    }, {
      path: 'orderDetails',
      name: 'OrderDetails',
      component: () => import('@/views/goodsManage/orderDetails'),
      meta: {
        title: '订单详情'
      }
    }, {
      path: 'editView',
      name: 'EditView',
      component: () => import('@/views/goodsManage/editView'),
      meta: {
        title: '编辑视图'
      }
    }]
  },
  // 学院管理
  {
    path: '/studyManage',
    component: Layout,
    name: 'StudyManage',
    meta: {
      title: '学院管理'
    },
    children: [{
      path: 'course',
      name: 'Course',
      component: () => import('@/views/studyManage/course'),
      meta: {
        title: '课程管理'
      }
    }, {
      path: 'subject',
      name: 'Subject',
      component: () => import('@/views/studyManage/subject'),
      meta: {
        title: '试题管理'
      }
    }, {
      path: 'student',
      name: 'Student',
      component: () => import('@/views/studyManage/student'),
      meta: {
        title: '学生管理'
      }
    }, {
      path: 'editCourse',
      name: 'EditCourse',
      component: () => import('@/views/studyManage/editCourse'),
      meta: {
        title: '编辑课程'
      }
    }, {
      path: 'editStudent',
      name: 'EditStudent',
      component: () => import('@/views/studyManage/editStudent'),
      meta: {
        title: '编辑试题'
      }
    }, {
      path: 'videoCategory',
      name: 'VideoCategory',
      component: () => import('@/views/studyManage/videoCategory'),
      meta: {
        title: '视频分类'
      }
    }, {
      path: 'courseCategory',
      name: 'CourseCategory',
      component: () => import('@/views/studyManage/courseCategory'),
      meta: {
        title: '课程分类'
      }
    }]
  },
  // 客户管理
  {
    path: '/crmManage',
    component: Layout,
    name: 'SrmManage',
    meta: {
      title: '客户管理'
    },
    children: [{
      path: 'customerClass',
      name: 'CustomerClass',
      component: () => import('@/views/crmManage/customerClass'),
      meta: {
        title: '客户分类'
      }
    }, {
      path: 'highSeasClients',
      name: 'HighSeasClients',
      component: () => import('@/views/crmManage/highSeasClients'),
      meta: {
        title: '公海客户'
      }
    },{
      path: 'Salesmanlist',
      name: 'Salesmanlist',
      component: () => import('@/views/crmManage/Salesmanlist'),
      meta: {
        title: '业务员列表'
      }
    },{
      path: 'Reporting',
      name: 'Reporting',
      component: () => import('@/views/crmManage/Reporting'),
      meta: {
        title: '报备中客户'
      }
    },{
      path: 'FinishList',
      name: 'FinishList',
      component: () => import('@/views/crmManage/FinishList'),
      meta: {
        title: '归档客户'
      }
    },{
      path: 'Archivalaudit',
      name: 'Archivalaudit',
      component: () => import('@/views/crmManage/Archivalaudit'),
      meta: {
        title: '归档审核'
      }
    },{
      path: 'Visitrecord',
      name: 'Visitrecord',
      component: () => import('@/views/crmManage/Visitrecord'),
      meta: {
        title: '拜访记录'
      }
    }]
  },
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
