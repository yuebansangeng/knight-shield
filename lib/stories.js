
module.exports = {
  'name': require('/Users/zhangyue/Gitlab/ux-ocean-warning/.bscpmrc').name,
  'stories': [
    {
      'name': 'default',
      'story': Object.assign({
        'content': require('/Users/zhangyue/Gitlab/ux-ocean-warning/examples/default'),
        'editableProps': [],
      })
    },    {
      'name': 'different-color',
      'story': Object.assign({
        'content': require('/Users/zhangyue/Gitlab/ux-ocean-warning/examples/different-color'),
        'editableProps': [],
      })
    },
  ],
  'readme': require('/Users/zhangyue/Gitlab/ux-ocean-warning/README.md')
}
