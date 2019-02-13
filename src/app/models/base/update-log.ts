export class UpdateLog {
  public static logs = [{
    time: '190213',
    version: '5.2.1',
    updates: [
      '支持对资源封面对全局设置',
      '支持在链接中选择资源页或介绍页',
    ]
  }, {
    time: '190212',
    version: '5.2.0',
    updates: [
      '优化介绍性文字显示',
      '保留搜索记录',
      '新上传的资源显示标识并临时置顶',
      '取消资源头部隐藏的功能',
      '为修改介绍设置独立按钮',
      '优化横屏模式的双栏显示',
      '优化选择器显示，添加深色背景',
      '在直链末端补充文件名',
    ]
  }, {
    time: '190115',
    version: '5.0.5',
    updates: [
      '优化上传进度条',
      '修改字体为非衬线字体',
    ]
  }, {
    time: '181228',
    version: '5.0.4 beta',
    updates: [
      '增加上传文件百分比显示',
      '优化资源显示',
      '优化Markdown样式',
    ]
  }, {
    time: '181226',
    version: '5.0.0 beta',
    updates: [
      '增加浑天匣主页',
      '修改字体为衬线字体',
    ]
  }, {
    time: '181225',
    version: '4.6.0',
    updates: [
      '优化个人主页模块，改用菜单栏显示',
      '重新支持查看贴士和更新日志',
      '支持下载资源封面',
      '悬浮鼠标显示操作提示（仅支持桌面端）',
    ]
  }, {
    time: '181219',
    version: '4.5.0',
    updates: [
      '链接资源显示前往次数',
      '支持批量资源文件上传',
      '修复长资源名下文件选择器的错位显示',
      '选择器资源列表以资源名排序',
      '拆分全局设置模块，添加封面图隐藏功能',
      '未登录状态下也显示底部操作栏',
      '修改操作模态框最大高度',
    ]
  }, {
    time: '181210',
    version: '4.4.4',
    updates: [
      '缩小竖屏模式的封面占比',
      '支持批量资源移动',
      '支持资源封面设置为与其他资源一致',
    ]
  }, {
    time: '181209',
    version: '4.4.0',
    updates: [
      '支持资源移动',
      '图片资源默认封面为自身缩略图',
    ]
  }, {
    time: '181206',
    version: '4.3.2',
    updates: [
      '支持图片资源封面为自身',
      '多选删除操作也会弹出确认框，防止误操作',
    ]
  }, {
    time: '181203',
    version: '4.3.0 beta',
    updates: [
      '优化操作界面，绝对布局替换为相对布局',
      '优化单选条样式，优化按钮样式',
      '支持资源封面类型选择',
      '子资源列表不再返回封面原图，节省流量',
      '优化代码结构，统一代码风格',
      '支持隐藏导航栏按钮',
    ]
  }, {
    time: '181128',
    version: '4.2.4 beta',
    updates: [
      '增加对应用权限的检查，以及需要重新授权的判断和跳转',
      '修复无法删除的错误',
      '支持更多按钮的排列',
    ]
  }, {
    time: '181127',
    version: '4.2.0 beta',
    updates: [
      '取消slug的资源祖先链设计，改用资源ID定位资源',
      '修复当删除资源失败时删除界面没有消失的问题',
      '优化判断用户登录逻辑',
      '优化蓝白渐变色的先后顺序',
      '给非目录资源的按钮预留按钮组',
      '删除2.X版本登录组件等冗余代码',
    ]
  }, {
    time: '181120',
    version: '4.0.4 beta',
    updates: [
      '优化批量删除时的进度条显示',
      '支持右滑返回父目录',
    ]
  }, {
    time: '181119',
    version: '4.0.0 beta',
    updates: [
      '支持批量删除资源，使用async-await新特性',
      '修改随机图片事件触发时间',
      '修改未登录状态的logo和slogan',
      '添加资源封面缩略图加载前的渐变背景',
    ],
  }, {
    time: '181114',
    version: '3.9.2',
    updates: [
      '优化资源封面显示方式，缩略图模糊',
      '子资源随机纯色改为随机渐变色',
    ],
  }, {
    time: '180928',
    version: '3.8.0',
    updates: [
      '全新logo',
    ],
  }, {
    time: '180925',
    version: '3.7.2',
    updates: [
      '优化排序框显示，增加行高',
      '修复多选模式下仍然显示排序按钮的错误',
      '优化封面图片未加载完成时的黑色显示，以随机纯色封面取代',
      '支持点击所有者头像时跳转到所有者主目录',
      '优化网页分享到APP平台的图片显示',
    ],
  }, {
    time: '180924',
    version: '3.5.8',
    updates: [
      '修复资源所有者没设置头像时无法显示随机头像的错误',
      '取消大量随机图片带来的加载延迟，换用随机背景色',
      '增加判断资源首字母是否为emoji表情',
      '取消封面的模糊效果',
      '优化选择资源时的显示效果，鼠标选择时背景色加深',
      '增加浑天匣更新日志',
      '使用更简短的链接s.6-79.cn取代原先的直链',
      '支持上传文件时修改固有文件名',
      '取消修改界面每修改一项就返回主面板的设置',
      '新增资源按时间、名称和类型的排序',
    ],
  }, {
    time: '180828',
    version: '3.0.3',
    updates: [
      '修复手机端无法上传资源的错误',
      '资源处于公开状态时，新增私有资源获取直链按钮',
    ],
  }, {
    time: '180503',
    version: '3.0.1',
    updates: [
      '支持链接资源的直链分享',
    ],
  }, {
    time: '180427',
    version: '3.0.0',
    updates: [
      '用户登陆统一接管到齐天簿(OAuth2.0)',
      '优化用户信息在齐天簿中更新后会在浑天匣中重新获取',
    ],
  }, {
    time: '180416',
    version: '2.0.4 beta',
    updates: [
      '修改七牛上传链接，原链接被抛弃',
    ]
  }, {
    time: '180308',
    version: '2.0.3 beta',
    updates: [
      '修复横屏状态时，多次点击资源产生的URL错误',
      '更名为浑天匣',
      '修改浑天匣图标',
    ],
  }, {
    time: '180221',
    version: '2.0.0 beta',
    updates: [
      '支持产品内测',
      '支持直链',
      '修复文件夹资源出现直链的错误',
      '支持上传链接资源',
      '在META标签中添加描述和图片',
      '新增个人界面，允许修改个人信息',
      '添加加载条，防止多次点击资源产生的URL错误',
      '允许加密资源自定义密码',
    ],
  }, {
    time: '180202',
    version: '1.8.0 alpha',
    updates: [
      '适配新版本，资源ID改为更安全的随机字符串',
    ],
  }, {
    time: '180126',
    version: '1.7.0 alpha',
    updates: [
      '删除测试的图片资源',
      '支持文件删除操作',
      '新增消息提醒块',
      '支持上传文件和创建文件夹',
      '分离组件，支持修改分享状态',
      '支持查看介绍',
      '支持资源下载',
      '支持页面跳转',
      '支持和后端的交互',
    ],
  }, {
    time: '180114',
    version: '1.0.0 alpha',
    updates: [
      'UI设计的第一个版本'
    ]
  }];
}
