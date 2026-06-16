export default defineAppConfig({
  pages: [
    'pages/tasks/index',
    'pages/devices/index',
    'pages/backups/index',
    'pages/recovery/index',
    'pages/notifications/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2BA471',
    navigationBarTitleText: '机房数据助手',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2BA471',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/tasks/index',
        text: '班级任务'
      },
      {
        pagePath: 'pages/devices/index',
        text: '设备清单'
      },
      {
        pagePath: 'pages/backups/index',
        text: '备份包'
      },
      {
        pagePath: 'pages/recovery/index',
        text: '恢复操作'
      },
      {
        pagePath: 'pages/notifications/index',
        text: '通知记录'
      }
    ]
  }
})
